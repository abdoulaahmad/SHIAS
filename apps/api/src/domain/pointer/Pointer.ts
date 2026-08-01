import { randomUUID } from 'crypto';
import { PointerStatus } from './Enums';
import { PointerMetadata } from './ValueObjects';
import { InvalidPointerStateError, ClinicalPayloadError } from './Errors';

export interface PointerProps {
  id: string;
  patientId: string;
  providerId: string;
  metadata: PointerMetadata;
  status: PointerStatus;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
  deletedAt: Date | null;
}

export class Pointer {
  private props: PointerProps;

  private constructor(props: PointerProps) {
    this.props = props;
    this.validateNoClinicalPayload();
  }

  private validateNoClinicalPayload(): void {
    // Domain Invariant: No clinical payload may ever be stored in a Pointer.
    // The Pointer domain explicitly avoids taking arbitrary JSON payloads, storing only the specific metadata required to locate a record.
    const keys = Object.keys(this.props);
    const forbiddenKeywords = ['clinicalData', 'payload', 'observation', 'patientData', 'encounters'];
    for (const key of keys) {
      if (forbiddenKeywords.includes(key)) {
        throw new ClinicalPayloadError();
      }
    }
  }

  public static create(data: {
    patientId: string;
    providerId: string;
    metadata: PointerMetadata;
  }): Pointer {
    return new Pointer({
      id: randomUUID(),
      patientId: data.patientId,
      providerId: data.providerId,
      metadata: data.metadata,
      status: PointerStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      archivedAt: null,
      deletedAt: null,
    });
  }

  public static reconstruct(props: PointerProps): Pointer {
    return new Pointer(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get patientId(): string {
    return this.props.patientId;
  }

  public get providerId(): string {
    return this.props.providerId;
  }

  public get metadata(): PointerMetadata {
    return this.props.metadata;
  }

  public get status(): PointerStatus {
    return this.props.status;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get archivedAt(): Date | null {
    return this.props.archivedAt;
  }

  public get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  public archive(): void {
    if (this.props.status === PointerStatus.ARCHIVED) {
      throw new InvalidPointerStateError('Pointer is already archived.');
    }
    if (this.props.status === PointerStatus.REVOKED) {
      throw new InvalidPointerStateError('Cannot archive a revoked pointer.');
    }

    this.props.status = PointerStatus.ARCHIVED;
    this.props.archivedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public revoke(): void {
    if (this.props.status === PointerStatus.REVOKED) {
      throw new InvalidPointerStateError('Pointer is already revoked.');
    }

    this.props.status = PointerStatus.REVOKED;
    this.props.updatedAt = new Date();
  }
}
