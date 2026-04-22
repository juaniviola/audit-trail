import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAuditEventsTable1700000000000 implements MigrationInterface {
  name = 'CreateAuditEventsTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_events',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'source_app', type: 'varchar', length: '255', isNullable: false },
          { name: 'source_env', type: 'varchar', length: '64', isNullable: false },
          { name: 'event_name', type: 'varchar', length: '255', isNullable: false },
          { name: 'action', type: 'varchar', length: '64', isNullable: false },
          { name: 'resource_type', type: 'varchar', length: '128', isNullable: false },
          { name: 'resource_id', type: 'varchar', length: '255', isNullable: false },
          { name: 'organization_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'actor_type', type: 'varchar', length: '32', isNullable: false },
          { name: 'actor_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'actor_label', type: 'varchar', length: '512', isNullable: true },
          { name: 'request_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'correlation_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'causation_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'occurred_at', type: 'timestamptz', isNullable: false },
          { name: 'ingested_at', type: 'timestamptz', isNullable: false },
          { name: 'before', type: 'jsonb', isNullable: true },
          { name: 'after', type: 'jsonb', isNullable: true },
          { name: 'changes', type: 'jsonb', isNullable: true },
          { name: 'metadata', type: 'jsonb', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createIndices('audit_events', [
      new TableIndex({ name: 'idx_audit_events_resource', columnNames: ['resource_type', 'resource_id'] }),
      new TableIndex({ name: 'idx_audit_events_organization', columnNames: ['organization_id'] }),
      new TableIndex({ name: 'idx_audit_events_correlation', columnNames: ['correlation_id'] }),
      new TableIndex({ name: 'idx_audit_events_occurred_at', columnNames: ['occurred_at'] }),
      new TableIndex({ name: 'idx_audit_events_event_name', columnNames: ['event_name'] }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_events', true);
  }
}
