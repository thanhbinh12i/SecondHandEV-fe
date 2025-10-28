import { ListingCreateRequest } from "src/types/listing.type";
import http from "src/utils/http";

const listingApiRequests = {
  postListing: (body: ListingCreateRequest) =>
    http.post<{ listingId: number }>("Listings", body),
};

export default listingApiRequests;
