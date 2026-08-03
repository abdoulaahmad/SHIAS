import { api } from '@/services/api';
import { AccessGrant, AccessRequest, RequestAccessDto, RequestAccessResponse, ValidateAccessResponse } from '../types';

export const accessApi = {
  requestAccess: async (data: RequestAccessDto): Promise<RequestAccessResponse> => {
    return api.post('/access/request', data);
  },

  getAccessGrant: async (grantId: string): Promise<AccessGrant> => {
    return api.get(`/access/grants/${grantId}`);
  },

  listProviderGrants: async (providerId: string): Promise<AccessGrant[]> => {
    return api.get(`/providers/${providerId}/grants`);
  },

  listProviderAccessRequests: async (providerId: string): Promise<AccessRequest[]> => {
    return api.get(`/providers/${providerId}/access-requests`);
  },

  revokeAccessGrant: async (grantId: string): Promise<AccessGrant> => {
    return api.post(`/access/grants/${grantId}/revoke`);
  },

  validateAccess: async (token: string): Promise<ValidateAccessResponse> => {
    return api.post('/access/validate', { token });
  }
};
