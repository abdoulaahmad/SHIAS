import { api } from "@/services/api";
import { LoginDto, RegisterPatientDto, RegisterProviderDto, AuthResponse } from "./types";

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    return api.post("/auth/login", data);
  },
  registerPatient: async (data: RegisterPatientDto): Promise<AuthResponse> => {
    return api.post("/auth/register/patient", data);
  },
  registerProvider: async (data: RegisterProviderDto): Promise<AuthResponse> => {
    return api.post("/auth/register/provider", data);
  },
  fetchCurrentUser: async (): Promise<{ id: string; email: string; role: "PATIENT" | "PROVIDER_STAFF" | "ADMIN" }> => {
    // MOCK: Backend does not have /auth/me yet.
    // We will parse the JWT manually from the Zustand store.
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch user on server");
    }
    
    const token = localStorage.getItem("auth-storage");
    if (!token) throw new Error("No token found");

    try {
      const parsed = JSON.parse(token);
      const jwt = parsed.state.token;
      
      if (!jwt) throw new Error("No token in state");
      
      const payloadBase64 = jwt.split('.')[1];
      const payloadDecoded = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadDecoded);
      
      // Simulate network delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: payload.userId || payload.sub || "unknown-id",
            email: payload.email || "user@example.com",
            role: payload.role || "PATIENT", 
          });
        }, 300);
      });
    } catch (err) {
      throw new Error("Invalid token format");
    }
  }
};
