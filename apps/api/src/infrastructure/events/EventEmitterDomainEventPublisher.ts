import { EventEmitter } from 'events';
import { IDomainEvent, IDomainEventPublisher } from '../../domain/events/IDomainEventPublisher';
import { getCorrelationId } from '../logging/CorrelationContext';
import { Logger } from '@shias/observability';

export class EventEmitterDomainEventPublisher implements IDomainEventPublisher {
  private readonly emitter = new EventEmitter();

  constructor(private readonly logger: Logger) {}

  async publish(event: IDomainEvent, correlationId?: string): Promise<void> {
    const id = correlationId || getCorrelationId();
    this.logger.debug(`Publishing event ${event.eventName}`, { eventName: event.eventName, correlationId: id });
    
    // We emit synchronously but the handlers can be async. 
    // We don't await handlers to decouple them from the main flow.
    this.emitter.emit(event.eventName, event, id);
  }

  subscribe<T extends IDomainEvent>(eventName: string, handler: (event: T, correlationId?: string) => Promise<void>): void {
    this.emitter.on(eventName, async (event: T, correlationId?: string) => {
      try {
        await handler(event, correlationId);
      } catch (error: any) {
        // We log the error, but we do NOT crash or break the workflow.
        this.logger.error(`Error in event subscriber for ${eventName}`, {
          error: error.message,
          eventName,
          correlationId,
        });
      }
    });
  }
}
