export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export interface CarListItem {
  id: string;
  sourceId: string;
  sourceUrl: string;
  title: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  mileageKm: number | null;
  priceJpy: number | null;
  totalPriceJpy: number | null;
  bodyType: string | null;
  fuelType: string | null;
  transmission: string | null;
  drive: string | null;
  engineCc: number | null;
  color: string | null;
  location: string | null;
  mainImageUrl: string | null;
  previewImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CarDetails extends CarListItem {
  rawData: Record<string, unknown>;
  images: Array<{
    id: string;
    url: string;
    sortOrder: number;
  }>;
}

export interface CarListMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CarListResponse {
  items: CarListItem[];
  meta: CarListMeta;
}

export interface CarsQuery {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "priceJpy" | "year" | "mileageKm" | "brand" | "model";
  sortOrder?: "asc" | "desc";
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
}
