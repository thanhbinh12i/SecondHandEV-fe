import { useMutation } from "@tanstack/react-query";
import listingApiRequests from "src/api/listing";

export const usePostListingMutation = () => {
  return useMutation({
    mutationFn: listingApiRequests.postListing,
  });
};
