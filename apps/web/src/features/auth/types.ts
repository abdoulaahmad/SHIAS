import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export const RegisterPatientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export type RegisterPatientDto = z.infer<typeof RegisterPatientSchema>;

export const RegisterProviderSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1, "Provider organization name is required"),
});

export type RegisterProviderDto = z.infer<typeof RegisterProviderSchema>;

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      role: "PATIENT" | "PROVIDER";
    };
  };
}
