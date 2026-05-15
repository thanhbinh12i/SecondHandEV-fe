export interface BidCreateRequest {
  auctionId: number;
  bidderId: number;
  amount: number;
}

export interface BidResponse {
  bidId: number;
  auctionId: number;
  bidderId: number;
  bidderName: string;
  amount: number;
  createdAt: string;
}
