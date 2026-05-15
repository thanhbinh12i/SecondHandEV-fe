import { MemberDto } from "./user.type";

//interface
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
  fullName?: string;
  address?: string;
  dateOfBirth?: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  member?: MemberDto;
}
