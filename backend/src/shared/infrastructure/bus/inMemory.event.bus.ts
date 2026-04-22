import { ConsoleLogger, Injectable } from '@nestjs/common';

import { DomainEvent } from '../../domain/bus/event/domain.event';
import { EventBus } from '../../domain/bus/event/event.bus';

type Handler = (args: object) => Promise<void>;

@Injectable()
export class InMemoryEventBus implements EventBus {
  private readonly logger = new ConsoleLogger(InMemoryEventBus.name);
  private subscribers = new Map<string, Handler[]>();

  async publish(events: DomainEvent[]): Promise<void> {
    if (!events.length) return;

    await Promise.all(
      events.map(async (event) => {
        const payload = event.toPrimitives();
        this.logger.log(`Publishing event ${event.kind}`);
        const handlers = this.subscribers.get(event.kind) || [];
        await Promise.all(
          handlers.map(async (handler) => {
            try {
              await handler(payload);
            } catch (err) {
              this.logger.error(`Handler for ${event.kind} failed`, (err as Error).stack);
            }
          }),
        );
      }),
    );
  }

  async register(event: string, handler: Handler, _name?: string): Promise<void> {
    const existing = this.subscribers.get(event) || [];
    existing.push(handler);
    this.subscribers.set(event, existing);
    this.logger.log(`Registered handler for ${event}`);
  }
}
