import { AccessGrantId } from './ValueObjects';
import { AccessStatus } from './Enums';
import { AccessStateTransitionError, AccessGrantExpiredError } from './Errors';
import { ConsentPurpose } from '../consent';

export interface AccessGrantProps {
  id: AccessGrantId;
  requestId: string;
  patientId: string;
  providerId: string;
  consentId: string;
  pointerIds: string[];
  purpose: ConsentPurpose;
  status: AccessStatus;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
}

export class AccessGrant {
  constructor(private props: AccessGrantProps) {}

  get id(): AccessGrantId { return this.props.id; }
  get requestId(): string { return this.props.requestId; }
  get patientId(): string { return this.props.patientId; }
  get providerId(): string { return this.props.providerId; }
  get consentId(): string { return this.props.consentId; }
  get pointerIds(): string[] { return this.props.pointerIds; }
  get purpose(): ConsentPurpose { return this.props.purpose; }
  get status(): AccessStatus { return this.props.status; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get createdAt(): Date { return this.props.createdAt; }
  get revokedAt(): Date | null { return this.props.revokedAt; }

  isExpired(at: Date = new Date()): boolean {
    return at >= this.props.expiresAt;
  }

  revoke(): void {
    if (this.props.status !== AccessStatus.ACTIVE) {
      throw new AccessStateTransitionError(this.props.status, AccessStatus.REVOKED);
    }
    this.props.status = AccessStatus.REVOKED;
    this.props.revokedAt = new Date();
  }

  expire(): void {
    if (this.props.status !== AccessStatus.ACTIVE) {
      throw new AccessStateTransitionError(this.props.status, AccessStatus.EXPIRED);
    }
    this.props.status = AccessStatus.EXPIRED;
  }
}
