import { api } from '@/lib/api';
import { AccessGrant, AccessRequest, RequestAccessDto, RequestAccessResponse, ValidateAccessResponse } from '../types';

export const accessApi = {
  requestAccess: async (data: RequestAccessDto): Promise<RequestAccessResponse> => {
    const response = await api.post<RequestAccessResponse>('/access/request', data);
    return response.data;
  },

  getAccessGrant: async (grantId: string): Promise<AccessGrant> => {
    const response = await api.get<AccessGrant>(`/access/grants/${grantId}`);
    return response.data;
  },

  listProviderGrants: async (providerId: string): Promise<AccessGrant[]> => {
    const response = await api.get<AccessGrant[]>(`/providers/${providerId}/grants`);
    return response.data;
  },

  listProviderAccessRequests: async (providerId: string): Promise<AccessRequest[]> => {
    const response = await api.get<AccessRequest[]>(`/providers/${providerId}/access-requests`);
    return response.data;
  },

  revokeAccessGrant: async (grantId: string): Promise<AccessGrant> => {
    const response = await api.post<AccessGrant>(`/access/grants/${grantId}/revoke`);
    return response.data;
  },

  validateAccess: async (token: string): Promise<ValidateAccessResponse> => {
    const response = await api.post<ValidateAccessResponse>('/access/validate', { token });
    return response.data;
  }
};
