import { ConsentPurpose } from '../consent';

export interface AccessRequestProps {
  id: string;
  patientId: string;
  providerId: string;
  purpose: ConsentPurpose;
  pointerIds: string[];
  createdAt: Date;
}

export class AccessRequest {
  constructor(private props: AccessRequestProps) {}

  get id(): string { return this.props.id; }
  get patientId(): string { return this.props.patientId; }
  get providerId(): string { return this.props.providerId; }
  get purpose(): ConsentPurpose { return this.props.purpose; }
  get pointerIds(): string[] { return this.props.pointerIds; }
  get createdAt(): Date { return this.props.createdAt; }
}
