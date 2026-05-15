import {
  CheckFavoriteResponse,
  FavoriteResponseDto,
} from "src/types/favorite.type";
import http from "src/utils/http";

const favoriteApiRequests = {
  favorite: (id: number) =>
    http.post<{ favoriteId: number }>(`Favorites`, { listingId: id }),
  myFavorite: (params?: { page?: number; pageSize?: number }) =>
    http.get<FavoriteResponseDto>("Favorites/my", { params }),
  checkFavorite: (id: number) =>
    http.get<CheckFavoriteResponse>(`Favorites/check/${id}`),
  deleteFavorite: (id: number) => http.delete(`Favorites/${id}`),
};

export default favoriteApiRequests;
