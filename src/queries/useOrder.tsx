import { useMutation } from "@tanstack/react-query";
import paymentApiRequests from "src/api/order";

export const useCreatePayOSMutation = () => {
  return useMutation({
    mutationFn: paymentApiRequests.createPayOS,
  });
};
