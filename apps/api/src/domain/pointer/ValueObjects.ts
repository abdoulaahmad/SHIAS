import { InvalidStorageLocationError } from './Errors';
import { RecordType } from './Enums';

export class StorageLocation {
  public readonly value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new InvalidStorageLocationError('Storage location is required.');
    }

    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') {
        throw new InvalidStorageLocationError('Storage location must use HTTPS protocol.');
      }
    } catch (error) {
      if (error instanceof InvalidStorageLocationError) {
        throw error;
      }
      throw new InvalidStorageLocationError('Invalid URI format.');
    }

    this.value = value;
  }
}

export interface PointerMetadataProps {
  externalSystemId: string;
  externalRecordId: string;
  externalUri: StorageLocation;
  recordType: RecordType;
  recordCreatedAt: Date;
}

export class PointerMetadata {
  public readonly externalSystemId: string;
  public readonly externalRecordId: string;
  public readonly externalUri: StorageLocation;
  public readonly recordType: RecordType;
  public readonly recordCreatedAt: Date;

  constructor(props: PointerMetadataProps) {
    if (!props.externalSystemId) throw new Error('externalSystemId is required');
    if (!props.externalRecordId) throw new Error('externalRecordId is required');
    if (!props.recordType) throw new Error('recordType is required');
    if (!props.recordCreatedAt) throw new Error('recordCreatedAt is required');

    this.externalSystemId = props.externalSystemId;
    this.externalRecordId = props.externalRecordId;
    this.externalUri = props.externalUri;
    this.recordType = props.recordType;
    this.recordCreatedAt = props.recordCreatedAt;
  }
}
