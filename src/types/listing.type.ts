export interface ListingCreateRequest {
  categoryId: number; // 1 = Battery, 2 = E-Bike
  title: string;
  description?: string;
  year?: number;
  price: number;
  listingType?: string; // "fixed" or "buy_now"
  listingStatus?: string; // "active", "draft", etc.
  primaryImageUrl?: string;
  imageUrls?: string[];
  brand?: string;
  model?: string;
}

export interface ListingUpdateRequest {
  title?: string;
  description?: string;
  year?: number;
  price: number;
  listingType?: string;
  listingStatus?: string;
  primaryImageUrl?: string;
  imageUrls?: string[];
  brand?: string;
  model?: string;
}

export interface BatteryDetailDto {
  brand?: string;
  model?: string;
  voltage?: number;
  capacityWh?: number;
  weightKg?: number;
  condition?: string;
  ageYears?: number;
}

export interface EbikeDetailDto {
  brand?: string;
  model?: string;
  motorPowerW?: number;
  batteryVoltage?: number;
  rangeKm?: number;
  frameSize?: string;
  condition?: string;
  mileageKm?: number;
  weightKg?: number;
  yearOfManufacture?: number;
}

// ListingDtos.ts
export interface ListingDto {
  listingId: number;
  memberId: number;
  categoryId: number;
  categoryName?: string;
  title: string;
  description?: string;
  year?: number;
  price?: number;
  listingType?: string; // "fixed", "buy_now", etc.
  listingStatus?: string; // "active", "draft", etc.
  createdAt?: string; // ISO date string
  sellerDisplayName?: string;
  sellerEmail?: string;
  primaryImageUrl?: string;
  imageUrls: string[];
  brand?: string;
  model?: string;
  battery?: BatteryDetailDto;
  ebike?: EbikeDetailDto;
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
  page?: number; // default: 1, min: 1
  pageSize?: number; // default: 12, min: 1, max: 200
  sortBy?: string; // "createdAt" | "price" | "year" | "title"
  sortDir?: string; // "asc" | "desc"
}

// MyListingAndCreateDtos.ts
export interface MyListingSearchRequest {
  status?: string; // "draft" | "active" | "rejected", etc.
  page?: number; // default: 1, min: 1
  pageSize?: number; // default: 12, min: 1, max: 200
  sortBy?: string; // default: "createdAt"
  sortDir?: string; // default: "desc"
}

export interface CreateBatteryListingRequest {
  title: string;
  description?: string;
  year?: number;
  price: number;
  listingType?: string; // default: "buy_now"
  listingStatus?: string; // default: "pending"
  primaryImageUrl?: string;
  imageUrls?: string[];
  brand?: string;
  model?: string;
  voltage?: number;
  capacityWh?: number;
  weightKg?: number;
  condition?: string;
  ageYears?: number;
}

export interface CreateEbikeListingRequest {
  title: string;
  description?: string;
  year?: number;
  price: number;
  listingType?: string; // default: "buy_now"
  listingStatus?: string; // default: "pending"
  primaryImageUrl?: string;
  imageUrls?: string[];
  brand?: string;
  model?: string;
  motorPowerW?: number;
  batteryVoltage?: number;
  rangeKm?: number;
  frameSize?: string;
  condition?: string;
  mileageKm?: number;
  weightKg?: number;
  yearOfManufacture?: number;
}

export interface UpdateListingStatusRequest {
  status: string;
  reason?: string;
}
