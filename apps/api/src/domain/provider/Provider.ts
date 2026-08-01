import { ProviderStatus } from './ProviderStatus';
import { ProviderType } from './ProviderType';
import { InvalidProviderStateTransitionError } from './ProviderError';

export class Provider {
  constructor(
    public readonly id: string,
    public readonly npi: string,
    public name: string,
    public type: ProviderType,
    public status: ProviderStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {}

  static create(props: { id: string; npi: string; name: string; type: string }): Provider {
    const now = new Date();
    return new Provider(
      props.id,
      props.npi,
      props.name,
      new ProviderType(props.type),
      ProviderStatus.ACTIVE,
      now,
      now,
      null
    );
  }

  suspend(): void {
    if (this.status === ProviderStatus.SUSPENDED) {
      throw new InvalidProviderStateTransitionError(this.status, ProviderStatus.SUSPENDED);
    }
    this.status = ProviderStatus.SUSPENDED;
    this.updatedAt = new Date();
  }

  reactivate(): void {
    if (this.status === ProviderStatus.ACTIVE) {
      throw new InvalidProviderStateTransitionError(this.status, ProviderStatus.ACTIVE);
    }
    this.status = ProviderStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  delete(): void {
    if (this.deletedAt !== null) {
      throw new InvalidProviderStateTransitionError('DELETED', 'DELETED');
    }
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }
}
