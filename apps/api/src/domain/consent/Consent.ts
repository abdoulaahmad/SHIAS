import { ConsentId, ConsentScope, ConsentDuration } from './ValueObjects';
import { ConsentStatus, ConsentPurpose } from './Enums';
import { ConsentStateTransitionError, ConsentExpiredError } from './Errors';

export interface ConsentProps {
  id: ConsentId;
  patientId: string;
  providerId: string;
  status: ConsentStatus;
  scope: ConsentScope;
  purpose: ConsentPurpose;
  duration: ConsentDuration;
  createdAt: Date;
  updatedAt: Date;
  revokedAt: Date | null;
  archivedAt: Date | null;
}

export class Consent {
  constructor(private props: ConsentProps) {}

  get id(): ConsentId { return this.props.id; }
  get patientId(): string { return this.props.patientId; }
  get providerId(): string { return this.props.providerId; }
  get status(): ConsentStatus { return this.props.status; }
  get scope(): ConsentScope { return this.props.scope; }
  get purpose(): ConsentPurpose { return this.props.purpose; }
  get duration(): ConsentDuration { return this.props.duration; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
  get revokedAt(): Date | null { return this.props.revokedAt; }
  get archivedAt(): Date | null { return this.props.archivedAt; }

  approve(): void {
    if (this.props.status !== ConsentStatus.PENDING) {
      throw new ConsentStateTransitionError(this.props.status, ConsentStatus.APPROVED);
    }
    if (this.props.duration.isExpired()) {
      throw new ConsentExpiredError();
    }
    this.props.status = ConsentStatus.APPROVED;
    this.props.updatedAt = new Date();
  }

  reject(): void {
    if (this.props.status !== ConsentStatus.PENDING) {
      throw new ConsentStateTransitionError(this.props.status, ConsentStatus.REJECTED);
    }
    this.props.status = ConsentStatus.REJECTED;
    this.props.updatedAt = new Date();
  }

  revoke(): void {
    if (this.props.status !== ConsentStatus.APPROVED) {
      throw new ConsentStateTransitionError(this.props.status, ConsentStatus.REVOKED);
    }
    this.props.status = ConsentStatus.REVOKED;
    this.props.revokedAt = new Date();
    this.props.updatedAt = new Date();
  }

  archive(): void {
    if (this.props.status === ConsentStatus.ARCHIVED) {
      throw new ConsentStateTransitionError(this.props.status, ConsentStatus.ARCHIVED);
    }
    this.props.status = ConsentStatus.ARCHIVED;
    this.props.archivedAt = new Date();
    this.props.updatedAt = new Date();
  }

  expire(): void {
    if (this.props.status !== ConsentStatus.APPROVED && this.props.status !== ConsentStatus.PENDING) {
      throw new ConsentStateTransitionError(this.props.status, ConsentStatus.EXPIRED);
    }
    this.props.status = ConsentStatus.EXPIRED;
    this.props.updatedAt = new Date();
  }
}
