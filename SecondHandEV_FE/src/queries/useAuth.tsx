import { useMutation } from "@tanstack/react-query";
import authApiRequests from "src/api/auth";
import { RegisterRequest } from "src/types/auth.type";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequests.login,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (body: RegisterRequest) => authApiRequests.register(body),
  });
};
