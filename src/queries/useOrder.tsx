import { useMutation } from "@tanstack/react-query";
import orderApiRequests from "src/api/order";

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: orderApiRequests.createOrder,
  });
};
