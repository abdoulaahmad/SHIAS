import { api } from "@/services/api";
import { Pointer, RegisterPointerDto, UpdatePointerDto } from "../types";

export interface MockPatient {
  id: string;
  name: string;
  email: string;
}

export const pointerApi = {
  getProviderPointers: async (providerId: string): Promise<Pointer[]> => {
    return api.get(`/providers/${providerId}/pointers`);
  },

  registerPointer: async (data: RegisterPointerDto): Promise<Pointer> => {
    return api.post("/pointers", data);
  },

  updatePointerStatus: async (pointerId: string, data: UpdatePointerDto): Promise<Pointer> => {
    return api.patch(`/pointers/${pointerId}`, data);
  },

  archivePointer: async (pointerId: string): Promise<void> => {
    return api.delete(`/pointers/${pointerId}`);
  },

  // Documented requirement: Backend needs to implement GET /patients?search=...
  searchPatients: async (query: string): Promise<MockPatient[]> => {
    return api.get(`/patients?search=${encodeURIComponent(query)}`);
  }
};
