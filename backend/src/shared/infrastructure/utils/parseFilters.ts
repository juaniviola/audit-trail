import { FilterType } from '../../domain/criteria/Filter';

export function parseFilters(filters: FilterType[]): Map<string, string>[] {
  if (!filters) {
    return [];
  }

  return filters.map((filter) => {
    return new Map([
      ['field', filter.field],
      ['operator', filter.operator],
      ['value', filter.value],
    ]);
  });
}
