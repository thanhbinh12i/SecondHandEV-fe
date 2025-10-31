import { OrderCreateRequest, OrderResponse } from "src/types/order.type";
import http from "src/utils/http";

const orderApiRequests = {
  createOrder: (body: OrderCreateRequest) =>
    http.post<OrderResponse>("Payment", body),
};

export default orderApiRequests;
