export interface OrderCreateRequest {
  listingId: number;
  buyerId: number;
  sellerId: number;
  orderAmount: number;
}

export interface OrderUpdateRequest {
  orderStatus?: string;
}

export interface OrderResponse {
  orderId: number;
  listingId: number;
  buyerId: number;
  sellerId: number;
  orderAmount: number;
  orderStatus?: string;
  createdAt?: string;
}
