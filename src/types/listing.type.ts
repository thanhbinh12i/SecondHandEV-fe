export interface ListingCreateRequest {
  categoryId: number;
  title: string;
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
export interface ListingResponseDto {
  items: ListingDto[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ListingDto {
  listingId: number;
  memberId: number;
  categoryId: number;
  categoryName?: string;
  title: string;
  description?: string;
  year?: number;
  price?: number;
  listingType?: string;
  listingStatus?: string;
  createdAt?: string;
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
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface MyListingSearchRequest {
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface CreateBatteryListingRequest {
  title: string;
  description?: string;
  year?: number;
  price: number;
  listingType?: string;
  listingStatus?: string;
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
  listingType?: string;
  listingStatus?: string;
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

export interface ListingAIInfo {
  categoryId: number;
  title: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  condition: string;
  voltage?: number;
  weightKg?: number;
  capacityWh?: number;
  ageYears?: number;
  motorPowerW?: number;
  batteryVoltage?: number;
  rangeKm?: number;
  mileageKm?: number;
  frameSize?: string;
}
