export interface Member {
  memberId: number;
  displayName: string;
  email: string;
  phone: string;
}

export interface Listing {
  listingId: number;
  title: string;
  description: string;
  price: number;
  listingType: string;
}

export interface Order {
  orderId: number;
  listing: Listing;
  buyer: Member;
  seller: Member;
  orderAmount: number;
  orderStatus: "Pending" | "Paid" | "Cancelled" | "Completed";
  createdAt: string;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Orders {
  success: boolean;
  message: string;
  data: Order;
}

export interface OrderQueryParams {
  sortBy?: string;
  sortDir?: string;
  page?: number;
  pageSize?: number;
}
export interface UpdateOrder {
  orderStatus: string;
}
