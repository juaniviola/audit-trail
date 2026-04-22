import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRequestLogsTable1700000000002 implements MigrationInterface {
  name = 'CreateRequestLogsTable1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'request_logs',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'source_app', type: 'varchar', length: '255', isNullable: false },
          { name: 'source_env', type: 'varchar', length: '64', isNullable: false },
          { name: 'method', type: 'varchar', length: '16', isNullable: false },
          { name: 'path', type: 'varchar', length: '1024', isNullable: false },
          { name: 'route', type: 'varchar', length: '1024', isNullable: true },
          { name: 'status', type: 'int', isNullable: false },
          { name: 'duration_ms', type: 'int', isNullable: false },
          { name: 'actor_type', type: 'varchar', length: '32', isNullable: true },
          { name: 'actor_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'actor_label', type: 'varchar', length: '512', isNullable: true },
          { name: 'organization_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'request_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'correlation_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'ip', type: 'varchar', length: '64', isNullable: true },
          { name: 'user_agent', type: 'varchar', length: '1024', isNullable: true },
          { name: 'referer', type: 'varchar', length: '1024', isNullable: true },
          { name: 'origin', type: 'varchar', length: '1024', isNullable: true },
          { name: 'request_body', type: 'jsonb', isNullable: true },
          { name: 'response_body', type: 'jsonb', isNullable: true },
          { name: 'query', type: 'jsonb', isNullable: true },
          { name: 'error_code', type: 'varchar', length: '128', isNullable: true },
          { name: 'error_message', type: 'text', isNullable: true },
          { name: 'occurred_at', type: 'timestamptz', isNullable: false },
          { name: 'ingested_at', type: 'timestamptz', isNullable: false },
        ],
      }),
      true,
    );

    await queryRunner.createIndices('request_logs', [
      new TableIndex({ name: 'idx_request_logs_correlation', columnNames: ['correlation_id'] }),
      new TableIndex({ name: 'idx_request_logs_occurred_at', columnNames: ['occurred_at'] }),
      new TableIndex({ name: 'idx_request_logs_status', columnNames: ['status'] }),
      new TableIndex({ name: 'idx_request_logs_path', columnNames: ['path'] }),
      new TableIndex({ name: 'idx_request_logs_actor', columnNames: ['actor_type', 'actor_id'] }),
      new TableIndex({ name: 'idx_request_logs_organization', columnNames: ['organization_id'] }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('request_logs', true);
  }
}
