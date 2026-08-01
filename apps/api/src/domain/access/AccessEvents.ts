import { IDomainEvent } from '../events/IDomainEventPublisher';
import { ConsentPurpose } from '../consent';

export class AccessRequestedEvent implements IDomainEvent {
  readonly eventName = 'AccessRequested';
  readonly occurredOn = new Date();
  readonly timestamp = new Date();

  constructor(
    public readonly requestId: string,
    public readonly patientId: string,
    public readonly providerId: string,
    public readonly purpose: ConsentPurpose
  ) {}
}

export class AccessGrantedEvent implements IDomainEvent {
  readonly eventName = 'AccessGranted';
  readonly occurredOn = new Date();
  readonly timestamp = new Date();

  constructor(
    public readonly grantId: string,
    public readonly requestId: string,
    public readonly patientId: string,
    public readonly providerId: string
  ) {}
}

export class AccessDeniedEvent implements IDomainEvent {
  readonly eventName = 'AccessDenied';
  readonly occurredOn = new Date();
  readonly timestamp = new Date();

  constructor(
    public readonly patientId: string,
    public readonly providerId: string,
    public readonly reason: string
  ) {}
}
