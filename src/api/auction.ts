import {
  AuctionApiResponse,
  AuctionCreateRequest,
  AuctionListApiResponse,
} from "src/types/auction.type";
import http from "src/utils/http";

const auctionApiRequests = {
  postAuction: (body: AuctionCreateRequest) =>
    http.post<AuctionApiResponse>("auction", body),
  auctionList: (params?: { page?: number; pageSize?: number }) =>
    http.get<AuctionListApiResponse>("auction", { params }),
  myAuctions: (params?: { page?: number; pageSize?: number }) =>
    http.get<AuctionListApiResponse>("auction/my", { params }),
  auctionById: (id: number) => http.get<AuctionApiResponse>(`auction/${id}`),
};

export default auctionApiRequests;
