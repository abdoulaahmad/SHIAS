import { api } from "@/services/api";
import { Consent } from "../types";

export const consentApi = {
  getPatientConsents: async (patientId: string): Promise<Consent[]> => {
    return api.get(`/patients/${patientId}/consents`);
  },
  
  getConsent: async (consentId: string): Promise<Consent> => {
    return api.get(`/consents/${consentId}`);
  },

  approveConsent: async (consentId: string): Promise<Consent> => {
    return api.post(`/consents/${consentId}/approve`);
  },

  rejectConsent: async (consentId: string): Promise<Consent> => {
    return api.post(`/consents/${consentId}/reject`);
  },

  revokeConsent: async (consentId: string): Promise<Consent> => {
    return api.post(`/consents/${consentId}/revoke`);
  },
};
