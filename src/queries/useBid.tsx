import { useMutation, useQuery } from "@tanstack/react-query";
import bidApiRequests from "src/api/bid";

export const usePostBidMutation = () => {
  return useMutation({
    mutationFn: bidApiRequests.postBid,
  });
};

export const useGetBidList = () => {
  return useQuery({
    queryKey: ["bid"],
    queryFn: () => bidApiRequests.bidList,
  });
};

export const useGetHighestBid = () => {
  return useQuery({
    queryKey: ["highest-bid"],
    queryFn: () => bidApiRequests.highestBid,
  });
};
