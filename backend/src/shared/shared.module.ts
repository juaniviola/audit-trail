import { Module } from '@nestjs/common';

import { InMemoryEventBus } from './infrastructure/bus/inMemory.event.bus';
import { TypeOrmDatabaseModule } from './infrastructure/persistence/typeorm/typeorm.module';
import { ApiKeyGuard } from './infrastructure/security/api-key.guard';

@Module({
  imports: [TypeOrmDatabaseModule],
  providers: [
    InMemoryEventBus,
    {
      provide: 'IEventBus',
      useExisting: InMemoryEventBus,
    },
    ApiKeyGuard,
  ],
  exports: [TypeOrmDatabaseModule, InMemoryEventBus, 'IEventBus', ApiKeyGuard],
})
export class SharedModule {}
