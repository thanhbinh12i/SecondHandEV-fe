import {
  CreateBatteryListingRequest,
  CreateEbikeListingRequest,
  ListingCreateRequest,
  ListingDto,
  ListingSearchRequest,
} from "src/types/listing.type";
import http from "src/utils/http";

const listingApiRequests = {
  postListing: (body: ListingCreateRequest) =>
    http.post<{ listingId: number }>("Listings", body),
  listing: (params?: ListingSearchRequest) => {
    return http.get<ListingDto[]>("Listings/search", { params });
  },
  postBattery: (body: CreateBatteryListingRequest) => {
    return http.post<{ listingId: number }>("Listings/battery", body);
  },
  postEbike: (body: CreateEbikeListingRequest) => {
    return http.post<{ listingId: number }>("Listings/ebike", body);
  },
  myListing: () => http.get<ListingDto[]>("Listings/my"),
};

export default listingApiRequests;
