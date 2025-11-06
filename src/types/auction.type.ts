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
export interface AuctionResponse {
  id: number;
  listing: ListingInfoDto;
  startingPrice: number;
  startDate: string;
  endDate: string;
  status?: string;
  seller: MemberInfoDto;
}
export interface ListingInfoDto {
  listingId: number;
  title?: string;
  description?: string;
  price: number;
  listingType?: string;
}

export interface MemberInfoDto {
  memberId: number;
  displayName?: string;
  email?: string;
  phone?: string;
}
