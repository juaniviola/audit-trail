import { Inject, Injectable } from '@nestjs/common';
import { Criteria } from 'src/shared/domain/criteria/Criteria';
import { TypeOrmCriteriaConverter } from 'src/shared/infrastructure/persistence/typeorm/criteria.converter';
import { TypeOrmConnection } from 'src/shared/infrastructure/persistence/typeorm/typeorm.connection';

import { AuditEvent } from '../../../domain/audit.event';
import { AuditEventsRepository } from '../../../domain/audit-events.repository';
import { AuditEventsEntity } from './audit-events.entity';

@Injectable()
export class AuditEventsPsqlRepository implements AuditEventsRepository {
  constructor(@Inject('TYPEORM_CONNECTION') private readonly db: TypeOrmConnection) {}

  async save(auditEvent: AuditEvent): Promise<void> {
    await this.db.getRepository(AuditEventsEntity).save(auditEvent.toPrimitives() as AuditEventsEntity);
  }

  async findById(id: string): Promise<AuditEvent | null> {
    const row = await this.db.getRepository(AuditEventsEntity).findOne({ where: { id } });
    if (!row) return null;
    return AuditEvent.fromPrimitives(this.toPrimitives(row));
  }

  async findByCorrelationId(correlationId: string): Promise<AuditEvent[]> {
    const rows = await this.db.getRepository(AuditEventsEntity).find({
      where: { correlationId },
      order: { occurredAt: 'ASC' },
    });
    return rows.map((row) => AuditEvent.fromPrimitives(this.toPrimitives(row)));
  }

  async findByCriteria(
    criteria: Criteria,
    filterType: 'AND' | 'OR' = 'AND',
  ): Promise<{ data: AuditEvent[]; total: number }> {
    const repository = this.db.getRepository(AuditEventsEntity);
    const queryBuilder = repository.createQueryBuilder('audit_event');

    const converter = new TypeOrmCriteriaConverter('audit_event', true, filterType);
    converter.applyToQueryBuilder(queryBuilder, criteria);

    if (!criteria.order.hasOrder()) {
      queryBuilder.orderBy('audit_event.occurred_at', 'DESC');
    }

    const [rows, total] = await queryBuilder.getManyAndCount();

    return {
      data: rows.map((row) => AuditEvent.fromPrimitives(this.toPrimitives(row))),
      total,
    };
  }

  private toPrimitives(row: AuditEventsEntity) {
    return {
      id: row.id,
      sourceApp: row.sourceApp,
      sourceEnv: row.sourceEnv,
      eventName: row.eventName,
      action: row.action,
      resourceType: row.resourceType,
      resourceId: row.resourceId,
      organizationId: row.organizationId,
      actorType: row.actorType,
      actorId: row.actorId,
      actorLabel: row.actorLabel,
      requestId: row.requestId,
      correlationId: row.correlationId,
      causationId: row.causationId,
      occurredAt: row.occurredAt instanceof Date ? row.occurredAt : new Date(row.occurredAt),
      ingestedAt: row.ingestedAt instanceof Date ? row.ingestedAt : new Date(row.ingestedAt),
      before: row.before,
      after: row.after,
      changes: row.changes,
      metadata: row.metadata,
    };
  }
}
