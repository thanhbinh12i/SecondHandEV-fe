import {
  ConvertToSaleRequest,
  CreateBatteryListingRequest,
  CreateEbikeListingRequest,
  ListingCreateRequest,
  ListingDto,
  ListingResponseDto,
  ListingSearchRequest,
  ListingUpdateRequest,
  UpdateListingStatusRequest,
} from "src/types/listing.type";
import http from "src/utils/http";

const listingApiRequests = {
  postListing: (body: ListingCreateRequest) =>
    http.post<{ listingId: number }>("Listings", body),
  listing: (params?: ListingSearchRequest) => {
    return http.get<ListingResponseDto>("Listings/search", { params });
  },
  postBattery: (body: CreateBatteryListingRequest) => {
    return http.post<{ listingId: number }>("Listings/battery", body);
  },
  postEbike: (body: CreateEbikeListingRequest) => {
    return http.post<{ listingId: number }>("Listings/ebike", body);
  },
  myListing: () => http.get<ListingResponseDto>("Listings/my"),
  listingById: (id: number) => http.get<ListingDto>(`Listings/${id}`),
  updateStatus: (id: number, body: UpdateListingStatusRequest) =>
    http.put(`Listings/${id}/status`, body),
  updateListing: (id: number, body: ListingUpdateRequest) =>
    http.put(`Listings/${id}`, body),
  convertToSale: (body: ConvertToSaleRequest) =>
    http.put(`/listings/${body.listingId}`, {
      listingType: "sale",
      price: body.price,
      auctionStartingPrice: null,
      auctionStartDate: null,
      auctionEndDate: null,
    }),
};

export default listingApiRequests;
