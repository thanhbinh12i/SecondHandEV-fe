import { useMutation, useQuery } from "@tanstack/react-query";
import bidApiRequests from "src/api/bid";

export const usePostBidMutation = () => {
  return useMutation({
    mutationFn: bidApiRequests.postBid,
  });
};

export const useGetBidList = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["bid", id],
    queryFn: () => bidApiRequests.bidList(id),
    enabled,
  });
};

export const useGetHighestBid = () => {
  return useQuery({
    queryKey: ["highest-bid"],
    queryFn: () => bidApiRequests.highestBid,
  });
};
