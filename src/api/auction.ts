import { AuctionCreateRequest, AuctionResponse } from "src/types/auction.type";
import http from "src/utils/http";

const auctionApiRequests = {
  postAuction: (body: AuctionCreateRequest) =>
    http.post<AuctionResponse>("auction", body),
  auctionList: () => http.get<AuctionResponse[]>("auction"),
  myAuctions: () => http.get<AuctionResponse[]>("auction/my"),
};

export default auctionApiRequests;
