export type PointerStatus = 'ACTIVE' | 'REVOKED' | 'ARCHIVED';

export type RecordType = 'ENCOUNTER' | 'LAB_RESULT' | 'PRESCRIPTION' | 'DOCUMENT';

export interface PointerMetadata {
  externalSystemId: string;
  externalRecordId: string;
  externalUri: string;
  recordType: RecordType;
  recordCreatedAt: string;
}

export interface Pointer {
  id: string;
  patientId: string;
  providerId: string;
  status: PointerStatus;
  metadata: PointerMetadata;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface RegisterPointerDto {
  patientId: string;
  providerId: string;
  externalSystemId: string;
  externalRecordId: string;
  externalUri: string;
  recordType: RecordType;
  recordCreatedAt: string;
}

export interface UpdatePointerDto {
  status: 'REVOKED' | 'ARCHIVED';
}
