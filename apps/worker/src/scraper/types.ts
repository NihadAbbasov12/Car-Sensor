export interface RawListingCar {
  sourceId: string;
  sourceUrl: string;
  title: string;
  brandRaw: string | null;
  modelRaw: string | null;
  priceRaw: string | null;
  totalPriceRaw: string | null;
  yearRaw: string | null;
  mileageRaw: string | null;
  engineCcRaw: string | null;
  transmissionRaw: string | null;
  imageUrls: string[];
}

export interface RawDetailCar extends RawListingCar {
  detailTitle: string | null;
  colorRaw: string | null;
  bodyTypeRaw: string | null;
  driveRaw: string | null;
  fuelTypeRaw: string | null;
  locationRaw: string | null;
  attributes: Record<string, string>;
}

export interface NormalizedCarRecord {
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
  images: string[];
  rawData: Record<string, unknown>;
}
