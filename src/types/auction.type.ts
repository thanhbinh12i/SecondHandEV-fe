import { ApiResponse } from "./api.type";

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
  totalBids?: number;
  currentPrice?: number;
  endDate: string;
  status?: string;
  seller: MemberInfoDto;
}
export interface ListingInfoDto {
  listingId: number;
  title?: string;
  primaryImageURL?: string;
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

export type AuctionApiResponse = ApiResponse<AuctionResponse>;

export type AuctionListApiResponse = ApiResponse<AuctionResponse[]>;
