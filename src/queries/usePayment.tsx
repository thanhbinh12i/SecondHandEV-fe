import { useMutation } from "@tanstack/react-query";
import paymentApiRequests from "src/api/payment";

export const useCreatePaymentMutation = () => {
  return useMutation({
    mutationFn: paymentApiRequests.createPayment,
  });
};

export const useCreatePayOSMutation = () => {
  return useMutation({
    mutationFn: paymentApiRequests.createPayOS,
  });
};
