import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import listingApiRequests from "src/api/listing";
import {
  ListingSearchRequest,
  UpdateListingStatusRequest,
} from "src/types/listing.type";

export const usePostListingMutation = () => {
  return useMutation({
    mutationFn: listingApiRequests.postListing,
  });
};

export const useGetListing = (params?: ListingSearchRequest) => {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => listingApiRequests.listing(params),
  });
};

export const usePostBatteryMutation = () => {
  return useMutation({
    mutationFn: listingApiRequests.postBattery,
  });
};

export const usePostEbikeMutation = () => {
  return useMutation({
    mutationFn: listingApiRequests.postEbike,
  });
};

export const useGetMyListing = () => {
  return useQuery({
    queryKey: ["listings"],
    queryFn: listingApiRequests.myListing,
  });
};

export const useGetListingById = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["listings", id],
    queryFn: () => listingApiRequests.listingById(id),
    enabled,
  });
};

export const useUpdateStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: UpdateListingStatusRequest;
    }) => listingApiRequests.updateStatus(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};
