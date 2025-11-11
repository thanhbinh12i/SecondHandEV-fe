import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import bidApiRequests from "src/api/bid";

export const usePostBidMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bidApiRequests.postBid,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bid", variables.auctionId] });
    },
  });
};

export const useGetBidList = ({
  id,
  enabled,
  refetchInterval,
  refetchIntervalInBackground,
}: {
  id: number;
  enabled: boolean;
  refetchInterval?: number | false;
  refetchIntervalInBackground?: boolean;
}) => {
  return useQuery({
    queryKey: ["bid", id],
    queryFn: () => bidApiRequests.bidList(id),
    enabled,
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: refetchIntervalInBackground ?? false,
    staleTime: 0,
  });
};

export const useGetHighestBid = () => {
  return useQuery({
    queryKey: ["highest-bid"],
    queryFn: () => bidApiRequests.highestBid,
  });
};
