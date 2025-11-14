import {
  OrderQueryParams,
  Orders,
  OrdersResponse,
  UpdateOrder,
} from "src/types/order.type";
import http from "src/utils/http";

const paymentApiRequests = {
  createPayOS: (id: number) =>
    http.post(`payos/create-payment-link`, "Thanh toán", {
      params: { listingId: id },
    }),
  getSellerOrders: (sellerId: number, params?: OrderQueryParams) =>
    http.get<OrdersResponse>(`/order/seller/${sellerId}`, { params }),

  getBuyerOrders: (buyerId: number, params?: OrderQueryParams) =>
    http.get<OrdersResponse>(`/order/buyer/${buyerId}`, { params }),

  updateOrder: (id: number, body: UpdateOrder) =>
    http.put<OrdersResponse>(`order/${id}`, body),

  getOrderById: (id: number) => http.get<Orders>(`order/${id}`),
};

export default paymentApiRequests;
