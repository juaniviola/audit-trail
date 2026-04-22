import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRequestContextToAuditEvents1700000000001 implements MigrationInterface {
  name = 'AddRequestContextToAuditEvents1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'audit_events',
      new TableColumn({
        name: 'request_context',
        type: 'jsonb',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('audit_events', 'request_context');
  }
}
