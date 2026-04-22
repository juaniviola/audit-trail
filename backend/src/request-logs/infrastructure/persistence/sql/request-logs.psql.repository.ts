import { Inject, Injectable } from '@nestjs/common';
import { Criteria } from 'src/shared/domain/criteria/Criteria';
import { TypeOrmCriteriaConverter } from 'src/shared/infrastructure/persistence/typeorm/criteria.converter';
import { TypeOrmConnection } from 'src/shared/infrastructure/persistence/typeorm/typeorm.connection';

import { RequestLog } from '../../../domain/request.log';
import { RequestLogsRepository } from '../../../domain/request-logs.repository';
import { RequestLogsEntity } from './request-logs.entity';

@Injectable()
export class RequestLogsPsqlRepository implements RequestLogsRepository {
  constructor(@Inject('TYPEORM_CONNECTION') private readonly db: TypeOrmConnection) {}

  async save(requestLog: RequestLog): Promise<void> {
    await this.db.getRepository(RequestLogsEntity).save(requestLog.toPrimitives() as RequestLogsEntity);
  }

  async findById(id: string): Promise<RequestLog | null> {
    const row = await this.db.getRepository(RequestLogsEntity).findOne({ where: { id } });
    if (!row) return null;
    return RequestLog.fromPrimitives(this.toPrimitives(row));
  }

  async findByCorrelationId(correlationId: string): Promise<RequestLog[]> {
    const rows = await this.db.getRepository(RequestLogsEntity).find({
      where: { correlationId },
      order: { occurredAt: 'ASC' },
    });
    return rows.map((row) => RequestLog.fromPrimitives(this.toPrimitives(row)));
  }

  async findByCriteria(
    criteria: Criteria,
    filterType: 'AND' | 'OR' = 'AND',
  ): Promise<{ data: RequestLog[]; total: number }> {
    const repository = this.db.getRepository(RequestLogsEntity);
    const queryBuilder = repository.createQueryBuilder('request_log');

    const converter = new TypeOrmCriteriaConverter('request_log', true, filterType);
    converter.applyToQueryBuilder(queryBuilder, criteria);

    if (!criteria.order.hasOrder()) {
      queryBuilder.orderBy('request_log.occurred_at', 'DESC');
    }

    const [rows, total] = await queryBuilder.getManyAndCount();

    return {
      data: rows.map((row) => RequestLog.fromPrimitives(this.toPrimitives(row))),
      total,
    };
  }

  private toPrimitives(row: RequestLogsEntity) {
    return {
      id: row.id,
      sourceApp: row.sourceApp,
      sourceEnv: row.sourceEnv,
      method: row.method,
      path: row.path,
      route: row.route,
      status: row.status,
      durationMs: row.durationMs,
      actorType: row.actorType,
      actorId: row.actorId,
      actorLabel: row.actorLabel,
      organizationId: row.organizationId,
      requestId: row.requestId,
      correlationId: row.correlationId,
      ip: row.ip,
      userAgent: row.userAgent,
      referer: row.referer,
      origin: row.origin,
      requestBody: row.requestBody,
      responseBody: row.responseBody,
      query: row.query,
      errorCode: row.errorCode,
      errorMessage: row.errorMessage,
      occurredAt: row.occurredAt instanceof Date ? row.occurredAt : new Date(row.occurredAt),
      ingestedAt: row.ingestedAt instanceof Date ? row.ingestedAt : new Date(row.ingestedAt),
    };
  }
}
