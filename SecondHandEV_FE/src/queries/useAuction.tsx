import { useMutation, useQuery } from "@tanstack/react-query";
import auctionApiRequests from "src/api/auction";

export const useCreateAuctionMutation = () => {
  return useMutation({
    mutationFn: auctionApiRequests.postAuction,
  });
};

export const useGetAuctionList = (params?: {
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ["auction", params],
    queryFn: () => auctionApiRequests.auctionList(params),
  });
};

export const useGetMyAuctions = (params?: {
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ["my-auction", params],
    queryFn: () => auctionApiRequests.myAuctions(params),
  });
};

export const useGetAuctionById = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: () => auctionApiRequests.auctionById(id),
    enabled,
  });
};

export const useGetAuctionByListingId = ({
  listingId,
  enabled = true,
}: {
  listingId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["auction-by-listing", listingId],
    queryFn: () => auctionApiRequests.getAuctionByListingId(listingId),
    enabled,
  });
};
