import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import listingApiRequests from "src/api/listing";
import {
  ListingSearchRequest,
  ListingUpdateRequest,
  UpdateListingStatusRequest,
} from "src/types/listing.type";

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
    queryKey: ["my-listings"],
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

export const useUpdateListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ListingUpdateRequest }) =>
      listingApiRequests.updateListing(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
};

export const useConvertToSaleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listingApiRequests.convertToSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
};
