import { useQuery, useMutation } from "@tanstack/react-query";
import { authApi } from "./api";
import { useAuthStore } from "./store";
import { LoginDto, RegisterPatientDto, RegisterProviderDto } from "./types";

export const useCurrentUser = () => {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const user = await authApi.fetchCurrentUser();
        setUser(user);
        return user;
      } catch (error) {
        clearAuth();
        throw error;
      }
    },
    enabled: !!token,
    retry: false,
  });
};

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (data) => {
      if (data.success && data.data) {
        setAuth(data.data.token, data.data.user);
      }
    },
  });
};

export const useLogoutMutation = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  return useMutation({
    mutationFn: async () => {
      // In a real app we might call POST /auth/logout
      // await api.post("/auth/logout");
      return Promise.resolve();
    },
    onSuccess: () => {
      clearAuth();
    },
  });
};

export const useRegisterPatientMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterPatientDto) => authApi.registerPatient(data),
    onSuccess: (data) => {
      if (data.success && data.data) {
        setAuth(data.data.token, data.data.user);
      }
    },
  });
};
