import { Module } from '@nestjs/common';

import { InMemoryEventBus } from './infrastructure/bus/inMemory.event.bus';
import { TypeOrmDatabaseModule } from './infrastructure/persistence/typeorm/typeorm.module';

@Module({
  imports: [TypeOrmDatabaseModule],
  providers: [
    InMemoryEventBus,
    {
      provide: 'IEventBus',
      useExisting: InMemoryEventBus,
    },
  ],
  exports: [TypeOrmDatabaseModule, InMemoryEventBus, 'IEventBus'],
})
export class SharedModule {}
