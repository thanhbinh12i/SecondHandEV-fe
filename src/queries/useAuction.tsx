import { useMutation, useQuery } from "@tanstack/react-query";
import auctionApiRequests from "src/api/auction";

export const useCreateAuctionMutation = () => {
  return useMutation({
    mutationFn: auctionApiRequests.postAuction,
  });
};

export const useGetAuctionList = () => {
  return useQuery({
    queryKey: ["auctions"],
    queryFn: () => auctionApiRequests.auctionList,
  });
};

export const useGetMyAuctions = () => {
  return useQuery({
    queryKey: ["my-auctions"],
    queryFn: () => auctionApiRequests.myAuctions,
  });
};
