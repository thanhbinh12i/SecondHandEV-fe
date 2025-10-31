import {
  PaymentCreateRequest,
  PaymentResponse,
  CreatePayOSPaymentRequest,
} from "src/types/payment.type";
import http from "src/utils/http";

const paymentApiRequests = {
  createPayment: (body: PaymentCreateRequest) =>
    http.post<PaymentResponse>("Payment", body),
  createPayOS: (body: CreatePayOSPaymentRequest) =>
    http.post("payos/create-payment-link", body),
};

export default paymentApiRequests;
