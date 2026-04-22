import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { TypeOrmCriteriaConverter } from './criteria.converter';
import { TypeOrmConnection } from './typeorm.connection';

@Module({
  providers: [
    {
      provide: 'TYPEORM_CONNECTION',
      useFactory: () => TypeOrmConnection.getInstance(),
    },
    {
      provide: TypeOrmCriteriaConverter,
      useFactory: () => new TypeOrmCriteriaConverter(),
    },
  ],
  exports: ['TYPEORM_CONNECTION', TypeOrmCriteriaConverter],
})
export class TypeOrmDatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('TYPEORM_CONNECTION') private readonly connection: TypeOrmConnection) {}

  async onModuleInit() {
    await this.connection.connect();
  }

  async onModuleDestroy() {
    await this.connection.disconnect();
  }
}
