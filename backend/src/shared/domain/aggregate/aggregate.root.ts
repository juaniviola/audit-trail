import { ConsoleLogger } from '@nestjs/common';

import { DomainEvent } from '../bus/event/domain.event';

export abstract class AggregateRoot {
  private readonly logger = new ConsoleLogger(AggregateRoot.name);
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  abstract toPrimitives(): object;

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
    this.logDomainEventAdded(domainEvent);
  }

  public pullDomainEvents(): DomainEvent[] {
    const domainEvents: DomainEvent[] = [...this._domainEvents];
    this.clearEvents();
    return domainEvents;
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  private logDomainEventAdded(domainEvent: DomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    this.logger.log(`[Domain Event Created]:`, thisClass?.constructor.name, '==>', domainEventClass?.constructor.name);
  }
}
