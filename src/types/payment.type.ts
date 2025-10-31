export interface PaymentCreateRequest {
  orderId: number;
  amount: number;
  provider?: string;
}

export interface PaymentUpdateRequest {
  status?: string;
  providerRef?: string;
}

export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  amount: number;
  provider: string;
  status?: string;
  createdAt?: string;
}
export interface CreatePayOSPaymentRequest {
  orderId: number;
  totalAmount: number;
  description?: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  items?: PaymentItem[];
}

export interface PaymentItem {
  name: string;
  price: number;
}

export interface CancelPaymentRequest {
  cancellationReason: string;
}

export interface ConfirmWebhookRequest {
  webhookUrl: string;
}
