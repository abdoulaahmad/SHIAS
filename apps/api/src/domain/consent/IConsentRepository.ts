import { Consent } from './Consent';

export interface IConsentRepository {
  save(consent: Consent): Promise<void>;
  findById(id: string): Promise<Consent | null>;
  findActiveConsent(patientId: string, providerId: string): Promise<Consent | null>;
  findPatientConsents(patientId: string): Promise<Consent[]>;
  findProviderConsents(providerId: string): Promise<Consent[]>;
}
