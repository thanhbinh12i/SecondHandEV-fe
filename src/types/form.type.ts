import { BatteryDetailDto, EbikeDetailDto } from "./listing.type";

export type PostListingFormData = {
  categoryId: number;
  title: string;
  description: string;
  year: number;
  price: number;
  listingType: string;
  listingStatus: string;
  primaryImageUrl: string;
  imageUrls: string[];
  brand: string;
  model: string;
} & BatteryDetailDto &
  EbikeDetailDto;
