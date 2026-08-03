import { api } from "@/services/api";
import { LoginDto, RegisterPatientDto, RegisterProviderDto, AuthResponse } from "./types";

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const res: any = await api.post("/auth/login", data);
    return {
      success: true,
      message: "Login successful",
      data: {
        token: res.tokens.accessToken,
        user: {
          id: res.user.id,
          email: data.email,
          role: res.user.role,
          providerId: res.user.providerId
        }
      }
    };
  },
  registerPatient: async (data: RegisterPatientDto): Promise<AuthResponse> => {
    return api.post("/auth/register/patient", {
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`.trim(),
      healthId: `HID-${Math.random().toString(36).substr(2, 9).toUpperCase()}` // Generate a random health ID for now
    });
  },
  registerProvider: async (data: RegisterProviderDto): Promise<AuthResponse> => {
    return api.post("/auth/register/provider", data);
  },
  fetchCurrentUser: async (): Promise<{ id: string; email: string; role: "PATIENT" | "PROVIDER" | "SYSTEM_ADMIN" }> => {
    // MOCK: Backend does not have /auth/me yet.
    // We will parse the JWT manually from the Zustand store.
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch user on server");
    }
    
    const token = localStorage.getItem("auth-storage");
    if (!token) throw new Error("No token found");

    try {
      const parsed = JSON.parse(token);
      
      // Since we now persist the full user object, return it directly if available
      if (parsed.state.user) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(parsed.state.user);
          }, 300);
        });
      }

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
            providerId: payload.providerId || undefined,
          });
        }, 300);
      });
    } catch (err) {
      throw new Error("Invalid token format");
    }
  }
};
