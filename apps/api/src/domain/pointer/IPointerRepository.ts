import { Pointer } from './Pointer';

export interface IPointerRepository {
  save(pointer: Pointer): Promise<void>;
  findById(id: string): Promise<Pointer | null>;
  findByPatient(patientId: string): Promise<Pointer[]>;
  findByProvider(providerId: string): Promise<Pointer[]>;
  findByExternalReference(providerId: string, externalSystemId: string, externalRecordId: string): Promise<Pointer | null>;
  archive(id: string): Promise<void>;
}
