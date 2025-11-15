import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import favoriteApiRequests from "src/api/favorite";

export const useFavoriteMutation = () => {
  return useMutation({
    mutationFn: favoriteApiRequests.favorite,
  });
};

export const useCheckFavorite = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["favorite", id],
    queryFn: () => favoriteApiRequests.checkFavorite(id),
    enabled,
  });
};

export const useGetMyFavorite = (params?: {
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ["my-favorites", params],
    queryFn: () => favoriteApiRequests.myFavorite(params),
  });
};

export const useDeleteFavoriteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoriteApiRequests.deleteFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-favorites"],
      });
    },
  });
};
