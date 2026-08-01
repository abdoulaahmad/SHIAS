export interface IDomainEvent {
  eventName: string;
  occurredOn: Date;
}

export interface IDomainEventPublisher {
  publish(event: IDomainEvent, correlationId?: string): Promise<void>;
  subscribe<T extends IDomainEvent>(eventName: string, handler: (event: T, correlationId?: string) => Promise<void>): void;
}