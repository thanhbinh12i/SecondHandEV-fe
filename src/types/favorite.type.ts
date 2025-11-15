import { ListingDto } from "./listing.type";

export interface FavoriteDto extends ListingDto {
  favoriteId: number;
  isFavorited: boolean;
}

export interface FavoriteResponseDto {
  items: FavoriteDto[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CheckFavoriteResponse {
  favoriteId: number;
  isFavorited: boolean;
}
