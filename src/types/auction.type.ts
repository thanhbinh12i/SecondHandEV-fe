export interface AuctionResponse {
  id: number;
  listingId: number;
  title: string;
  description: string;
  startingPrice: number;
  listingType: string;
  startDate: string;
  endDate: string;
  sellerId: number;
}

export interface AuctionCreateRequest {
  listingId: number;
  startingPrice: number;
  startDate: string;
  endDate: string;
}

export interface AuctionUpdateRequest {
  id: number;
  startingPrice: number;
  startDate: string;
  endDate: string;
}
