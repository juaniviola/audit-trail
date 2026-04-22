import { Inject, Injectable } from '@nestjs/common';
import { Criteria } from 'src/shared/domain/criteria/Criteria';
import { FilterType } from 'src/shared/domain/criteria/Filter';
import { Filters } from 'src/shared/domain/criteria/Filters';
import { Order } from 'src/shared/domain/criteria/Order';
import { parseFilters } from 'src/shared/infrastructure/utils/parseFilters';

import { AuditEventListResponse } from '../../domain/audit.event';
import { AuditEventsRepository } from '../../domain/audit-events.repository';

export type FindAuditEventsInput = {
  filters?: FilterType[];
  filterType?: 'AND' | 'OR';
  orderBy?: string;
  orderType?: 'ASC' | 'DESC';
  offset?: number;
  limit?: number;
};

export type FindAuditEventsResult = {
  data: AuditEventListResponse[];
  total: number;
};

@Injectable()
export class FindAuditEventsService {
  constructor(@Inject('IAuditEventsRepository') private readonly repository: AuditEventsRepository) {}

  public async execute(input: FindAuditEventsInput = {}): Promise<FindAuditEventsResult> {
    const filters = Filters.fromValues(parseFilters(input.filters || []));
    const orderTypeValue = (input.orderType ?? 'DESC').toLowerCase();
    const order = input.orderBy ? Order.fromValues(input.orderBy, orderTypeValue) : Order.desc('occurredAt');
    const criteria = new Criteria(filters, order, input.limit ?? 50, input.offset ?? 0);
    const filterType = input.filterType ?? 'AND';

    const { data, total } = await this.repository.findByCriteria(criteria, filterType);

    return {
      data: data.map((event) => event.toResponseList()),
      total,
    };
  }
}
