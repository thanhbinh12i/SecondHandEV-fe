import { useMutation, useQuery } from "@tanstack/react-query";
import listingApiRequests from "src/api/listing";
import { ListingSearchRequest } from "src/types/listing.type";

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
