import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "src/types/auth.type";
import http from "src/utils/http";

const authApiRequests = {
  login: (body: LoginRequest) => http.post<AuthResponse>("Auth/login", body),
  register: (body: RegisterRequest) =>
    http.post<AuthResponse>("Auth/register", body),
};

export default authApiRequests;
