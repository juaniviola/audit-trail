import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { Criteria } from '../../../domain/criteria/Criteria';
import { Filter } from '../../../domain/criteria/Filter';
import { Operator } from '../../../domain/criteria/FilterOperator';
import { Filters } from '../../../domain/criteria/Filters';
import { Order } from '../../../domain/criteria/Order';

export type TypeOrmFilter = {
  query: string;
  parameters: Record<string, any>;
};

export type TypeOrmSort = string;

interface TypeOrmQuery {
  filter: TypeOrmFilter;
  sort: TypeOrmSort;
  offset: number;
  limit: number;
}

interface TransformerFunction<T, K> {
  (value: T): K;
}

export class TypeOrmCriteriaConverter {
  private filterTransformers: Map<Operator, TransformerFunction<Filter, TypeOrmFilter>>;
  private alias: string;
  private uniqueParameters: boolean;
  private filterType: 'AND' | 'OR' = 'AND';

  constructor(alias: string = 'entity', uniqueParameters: boolean = false, filterType?: 'AND' | 'OR') {
    this.alias = alias;
    this.uniqueParameters = uniqueParameters;
    if (filterType) {
      this.filterType = filterType;
    }
    this.filterTransformers = new Map<Operator, TransformerFunction<Filter, TypeOrmFilter>>([
      [Operator.EQUAL, this.equalFilter.bind(this)],
      [Operator.NOT_EQUAL, this.notEqualFilter.bind(this)],
      [Operator.GT, this.greaterThanFilter.bind(this)],
      [Operator.LT, this.lowerThanFilter.bind(this)],
      [Operator.CONTAINS, this.containsFilter.bind(this)],
      [Operator.NOT_CONTAINS, this.notContainsFilter.bind(this)],
      [Operator.IN, this.inFilter.bind(this)],
      [Operator.NOT_IN, this.notInFilter.bind(this)],
    ]);
  }

  public setFilterType(type: 'AND' | 'OR') {
    this.filterType = type;
  }

  public convert(criteria: Criteria): TypeOrmQuery {
    return {
      filter: criteria.hasFilters() ? this.generateFilter(criteria.filters) : { query: '', parameters: {} },
      sort: criteria.order.hasOrder() ? this.generateSort(criteria.order) : '',
      offset: criteria.offset || 0,
      limit: criteria.limit || 0,
    };
  }

  public applyToQueryBuilder<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    criteria: Criteria,
  ): SelectQueryBuilder<T> {
    const query = this.convert(criteria);

    if (query.filter.query) {
      queryBuilder.andWhere(query.filter.query, query.filter.parameters);
    }

    if (criteria.order.hasOrder()) {
      const field = `${this.alias}.${criteria.order.orderBy.getValue()}`;
      const direction = criteria.order.orderType.isAsc() ? 'ASC' : 'DESC';
      queryBuilder.orderBy(field, direction);
    }

    if (query.limit > 0) {
      queryBuilder.take(query.limit);
    }

    if (query.offset > 0) {
      queryBuilder.skip(query.offset);
    }

    return queryBuilder;
  }

  protected generateFilter(filters: Filters): TypeOrmFilter {
    if (filters.filters.length === 0) {
      return { query: '', parameters: {} };
    }

    if (filters.filters.length === 1) {
      return this.transformFilter(filters.filters[0]);
    }

    return this.filterType === 'OR'
      ? this.combineFilters(filters.filters, 'OR')
      : this.combineFilters(filters.filters, 'AND');
  }

  protected generateSort(order: Order): TypeOrmSort {
    if (!order.hasOrder()) {
      return '';
    }
    const field = `${this.alias}.${order.orderBy.getValue()}`;
    const direction = order.orderType.isAsc() ? 'ASC' : 'DESC';
    return `${field} ${direction}`;
  }

  private transformFilter(filter: Filter): TypeOrmFilter {
    const operatorValue = filter.operator.getValue();
    const transformer = this.filterTransformers.get(operatorValue);

    if (!transformer) {
      throw new Error(`Unsupported filter operator: ${operatorValue}`);
    }

    return transformer(filter);
  }

  private equalFilter(filter: Filter): TypeOrmFilter {
    const field = `${this.alias}.${filter.field.getValue()}`;
    const paramName = `${filter.field.getValue()}Equal`;
    const value = this.parseValue(filter.value.getValue());

    return { query: `${field} = :${paramName}`, parameters: { [paramName]: value } };
  }

  private notEqualFilter(filter: Filter): TypeOrmFilter {
    const field = `${this.alias}.${filter.field.getValue()}`;
    const paramName = `${filter.field.getValue()}NotEqual`;
    const value = this.parseValue(filter.value.getValue());

    return { query: `${field} != :${paramName}`, parameters: { [paramName]: value } };
  }

  private greaterThanFilter(filter: Filter): TypeOrmFilter {
    const field = `${this.alias}.${filter.field.getValue()}`;
    const paramName = `${filter.field.getValue()}Gt`;
    const value = this.parseValue(filter.value.getValue());

    return { query: `${field} > :${paramName}`, parameters: { [paramName]: value } };
  }

  private lowerThanFilter(filter: Filter): TypeOrmFilter {
    const field = `${this.alias}.${filter.field.getValue()}`;
    const paramName = `${filter.field.getValue()}Lt`;
    const value = this.parseValue(filter.value.getValue());

    return { query: `${field} < :${paramName}`, parameters: { [paramName]: value } };
  }

  private containsFilter(filter: Filter): TypeOrmFilter {
    const field = `${this.alias}.${filter.field.getValue()}`;
    const paramName = `${filter.field.getValue()}Contains`;
    const value = `%${filter.value.getValue()}%`;

    return { query: `UPPER(${field}::text) LIKE UPPER(:${paramName})`, parameters: { [paramName]: value } };
  }

  private notContainsFilter(filter: Filter): TypeOrmFilter {
    const field = `${this.alias}.${filter.field.getValue()}`;
    const paramName = `${filter.field.getValue()}NotContains`;
    const value = `%${filter.value.getValue()}%`;

    return { query: `UPPER(${field}::text) NOT LIKE UPPER(:${paramName})`, parameters: { [paramName]: value } };
  }

  private inFilter(filter: Filter): TypeOrmFilter {
    const field = `${this.alias}.${filter.field.getValue()}`;
    const paramName = `${filter.field.getValue()}In`;
    const valueStr = filter.value.getValue();
    const values = Array.isArray(valueStr) ? valueStr : String(valueStr).split(',');

    return { query: `${field} IN (:...${paramName})`, parameters: { [paramName]: values } };
  }

  private notInFilter(filter: Filter): TypeOrmFilter {
    const field = `${this.alias}.${filter.field.getValue()}`;
    const paramName = `${filter.field.getValue()}NotIn`;
    const valueStr = filter.value.getValue();
    const values = Array.isArray(valueStr) ? valueStr : String(valueStr).split(',');

    return { query: `${field} NOT IN (:...${paramName})`, parameters: { [paramName]: values } };
  }

  private combineFilters(filters: Filter[], joiner: 'AND' | 'OR'): TypeOrmFilter {
    const result: TypeOrmFilter = { query: '', parameters: {} };

    const filterResults = filters.map((filter, index) => {
      const transformedFilter = this.transformFilter(filter);

      if (this.uniqueParameters || joiner === 'OR') {
        const uniqueParameters: Record<string, any> = {};
        Object.keys(transformedFilter.parameters).forEach((paramName) => {
          const uniqueParamName = `${paramName}_${index}`;
          uniqueParameters[uniqueParamName] = transformedFilter.parameters[paramName];
          transformedFilter.query = transformedFilter.query.replace(
            new RegExp(`:${paramName}\\b`, 'g'),
            `:${uniqueParamName}`,
          );
        });
        return { query: transformedFilter.query, parameters: uniqueParameters };
      }

      return transformedFilter;
    });

    result.query = `(${filterResults.map((f) => f.query).join(` ${joiner} `)})`;

    filterResults.forEach((filter) => {
      result.parameters = { ...result.parameters, ...filter.parameters };
    });

    return result;
  }

  private parseValue(value: any): any {
    if (value === null || value === undefined || value === 'null') {
      return null;
    }

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value);
    }

    if (typeof value === 'string' && !isNaN(Number(value)) && !isNaN(parseFloat(value))) {
      return Number(value);
    }

    if (value === 'true') return true;
    if (value === 'false') return false;

    return value;
  }
}
