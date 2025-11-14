import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import paymentApiRequests from "src/api/order";
import { OrderQueryParams, UpdateOrder } from "src/types/order.type";

export const useCreatePayOSMutation = () => {
  return useMutation({
    mutationFn: paymentApiRequests.createPayOS,
  });
};

export const useSellerOrders = (
  sellerId: number,
  params?: OrderQueryParams
) => {
  return useQuery({
    queryKey: ["sellerOrders", sellerId, params],
    queryFn: () => paymentApiRequests.getSellerOrders(sellerId, params),
    enabled: !!sellerId,
  });
};

export const useBuyerOrders = (buyerId: number, params?: OrderQueryParams) => {
  return useQuery({
    queryKey: ["buyerOrders", buyerId, params],
    queryFn: () => paymentApiRequests.getBuyerOrders(buyerId, params),
    enabled: !!buyerId,
  });
};

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateOrder }) =>
      paymentApiRequests.updateOrder(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyerOrders"] });
    },
  });
};

export const useGetOrderById = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["buyerOrders", id],
    queryFn: () => paymentApiRequests.getOrderById(id),
    enabled,
  });
};
