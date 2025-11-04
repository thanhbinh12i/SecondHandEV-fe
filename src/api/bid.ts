import { BidCreateRequest, BidResponse } from "src/types/bid.type";
import http from "src/utils/http";

const bidApiRequests = {
  postBid: (body: BidCreateRequest) =>
    http.post<BidResponse>(`auction/${body.auctionId}/bids`, body),
  bidList: (id: number) => http.get<BidResponse[]>(`auction/${id}/bids`),
  highestBid: (id: number) =>
    http.get<BidResponse[]>(`auction/${id}/bids/highest`),
};

export default bidApiRequests;
