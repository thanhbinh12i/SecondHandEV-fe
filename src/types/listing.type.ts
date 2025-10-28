export interface ListingDto {
  listingId: number;
  memberId: number;
  categoryId: number;
  categoryName?: string;
  title: string;
  description?: string;
  year?: number;
  price?: number;
  listingType?: string; // fixed / buy_now ...
  listingStatus?: string; // active / draft ...
  createdAt?: string;
  sellerDisplayName?: string;
  sellerEmail?: string;
  primaryImageUrl?: string;
  imageUrls: string[];
  brand?: string;
  model?: string;
}

export interface ListingSearchRequest {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  listingType?: string;
  listingStatus?: string;
  yearFrom?: number;
  yearTo?: number;
  page: number; // default 1
  pageSize: number; // default 12
  sortBy?: string; // createdAt|price|year|title
  sortDir?: string; // asc|desc
}

export interface ListingCreateRequest {
  categoryId: number;
  title: string;
  description?: string;
  year?: number;
  price?: number;
  listingType?: string; // default "fixed"
  listingStatus?: string; // default "active"
  primaryImageUrl?: string;
  imageUrls?: string[];
  brand?: string;
  model?: string;
}

export interface ListingUpdateRequest {
  title?: string;
  description?: string;
  year?: number;
  price?: number;
  listingType?: string;
  listingStatus?: string;
  primaryImageUrl?: string;
  imageUrls?: string[];
  brand?: string;
  model?: string;
}
