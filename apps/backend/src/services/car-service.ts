import type { Prisma } from "@prisma/client";
import type { CarDetails, CarListItem, CarListResponse, CarsQuery } from "@carsensor/shared";
import { prisma } from "../lib/prisma";
import { HttpError } from "../utils/http";

const sortableFields: Record<NonNullable<CarsQuery["sortBy"]>, Prisma.CarOrderByWithRelationInput> = {
  createdAt: { createdAt: "desc" },
  updatedAt: { updatedAt: "desc" },
  priceJpy: { priceJpy: "desc" },
  year: { year: "desc" },
  mileageKm: { mileageKm: "asc" },
  brand: { brand: "asc" },
  model: { model: "asc" },
};

type CarWithFirstImage = Awaited<ReturnType<typeof prisma.car.findMany>>[number] & {
  images: Array<{ url: string }>;
};

const brandMap: Record<string, string> = {
  Toyota: "\u30c8\u30e8\u30bf",
  Nissan: "\u65e5\u7523",
  Honda: "\u30db\u30f3\u30c0",
  Suzuki: "\u30b9\u30ba\u30ad",
  Mazda: "\u30de\u30c4\u30c0",
  Subaru: "\u30b9\u30d0\u30eb",
  Daihatsu: "\u30c0\u30a4\u30cf\u30c4",
  Mitsubishi: "\u4e09\u83f1",
  Lexus: "\u30ec\u30af\u30b5\u30b9",
  Isuzu: "\u30a4\u30b9\u30ba",
  Hino: "\u65e5\u91ce",
};

const modelMap: Record<string, string> = {
  Corolla: "\u30ab\u30ed\u30fc\u30e9",
  "Corolla Touring": "\u30ab\u30ed\u30fc\u30e9\u30c4\u30fc\u30ea\u30f3\u30b0",
  "Corolla Cross": "\u30ab\u30ed\u30fc\u30e9\u30af\u30ed\u30b9",
  Prius: "\u30d7\u30ea\u30a6\u30b9",
  Aqua: "\u30a2\u30af\u30a2",
  Roomy: "\u30eb\u30fc\u30df\u30fc",
  Estima: "\u30a8\u30b9\u30c6\u30a3\u30de",
  "Crown Royal": "\u30af\u30e9\u30a6\u30f3\u30ed\u30a4\u30e4\u30eb",
  Raize: "\u30e9\u30a4\u30ba",
  Harrier: "\u30cf\u30ea\u30a2\u30fc",
  Sienta: "\u30b7\u30a8\u30f3\u30bf",
  Voxy: "\u30f4\u30a9\u30af\u30b7\u30fc",
  "HiAce Van": "\u30cf\u30a4\u30a8\u30fc\u30b9\u30d0\u30f3",
  Spade: "\u30b9\u30da\u30a4\u30c9",
  "C-HR": "C-HR",
  SAI: "SAI",
  "86": "86",
  Note: "\u30ce\u30fc\u30c8",
  Fit: "\u30d5\u30a3\u30c3\u30c8",
};

function buildBrandCandidates(input: string) {
  const normalized = input.trim();
  if (!normalized) {
    return [];
  }

  const candidates = new Set<string>([normalized]);
  const direct = brandMap[normalized];
  if (direct) {
    candidates.add(direct);
  }

  const reverse = Object.entries(brandMap).find(([, jp]) => jp === normalized)?.[0];
  if (reverse) {
    candidates.add(reverse);
  }

  return Array.from(candidates);
}

function stripLeadingBrand(input: string) {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return normalized;
  }

  const brandNames = [
    ...Object.keys(brandMap),
    ...Object.values(brandMap),
  ];

  for (const brand of brandNames) {
    if (normalized.toLowerCase().startsWith(brand.toLowerCase() + " ")) {
      return normalized.slice(brand.length).trim();
    }
  }

  return normalized;
}

function buildModelCandidates(input: string) {
  const normalized = stripLeadingBrand(input);
  if (!normalized) {
    return [];
  }

  const candidates = new Set<string>([normalized]);
  const direct = modelMap[normalized];
  if (direct) {
    candidates.add(direct);
  }

  const reverse = Object.entries(modelMap).find(([, jp]) => jp === normalized)?.[0];
  if (reverse) {
    candidates.add(reverse);
  }

  return Array.from(candidates);
}

function mapCarListItem(car: CarWithFirstImage): CarListItem {
  return {
    id: car.id,
    sourceId: car.sourceId,
    sourceUrl: car.sourceUrl,
    title: car.title,
    brand: car.brand,
    model: car.model,
    year: car.year,
    mileageKm: car.mileageKm,
    priceJpy: car.priceJpy,
    totalPriceJpy: car.totalPriceJpy,
    bodyType: car.bodyType,
    fuelType: car.fuelType,
    transmission: car.transmission,
    drive: car.drive,
    engineCc: car.engineCc,
    color: car.color,
    location: car.location,
    mainImageUrl: car.images[0]?.url ?? null,
    previewImageUrl: car.images[1]?.url ?? car.images[0]?.url ?? null,
    createdAt: car.createdAt.toISOString(),
    updatedAt: car.updatedAt.toISOString(),
  };
}

export async function listCars(
  query: CarsQuery & {
    page: number;
    limit: number;
    sortBy: NonNullable<CarsQuery["sortBy"]>;
    sortOrder: NonNullable<CarsQuery["sortOrder"]>;
  },
): Promise<CarListResponse> {
  const page = query.page;
  const limit = query.limit;
  const skip = (page - 1) * limit;

  const brandCandidates = query.brand ? buildBrandCandidates(query.brand) : [];
  const brandFilter =
    brandCandidates.length > 0
      ? {
          OR: brandCandidates.map((value) => ({
            brand: { contains: value, mode: "insensitive" },
          })),
        }
      : undefined;

  const modelCandidates = query.model ? buildModelCandidates(query.model) : [];
  const modelFilter =
    modelCandidates.length > 0
      ? {
          OR: modelCandidates.map((value) => ({
            model: { contains: value, mode: "insensitive" },
          })),
        }
      : undefined;
  const priceFilter =
    query.minPrice !== undefined || query.maxPrice !== undefined
      ? { priceJpy: { gte: query.minPrice, lte: query.maxPrice } }
      : undefined;
  const yearFilter =
    query.minYear !== undefined || query.maxYear !== undefined
      ? { year: { gte: query.minYear, lte: query.maxYear } }
      : undefined;
  const mileageFilter =
    query.minMileage !== undefined || query.maxMileage !== undefined
      ? { mileageKm: { gte: query.minMileage, lte: query.maxMileage } }
      : undefined;

  const where: Prisma.CarWhereInput = {
    AND: [brandFilter, modelFilter, priceFilter, yearFilter, mileageFilter].filter(
      Boolean,
    ) as Prisma.CarWhereInput[],
  };

  const sortField = query.sortBy;
  const orderBy = {
    [sortField]: query.sortOrder,
  } as Prisma.CarOrderByWithRelationInput;

  const [total, cars] = await Promise.all([
    prisma.car.count({ where }),
    prisma.car.findMany({
      where,
      skip,
      take: limit,
      orderBy: sortField in sortableFields ? orderBy : sortableFields.createdAt,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 2,
          select: { url: true },
        },
      },
    }),
  ]);

  return {
    items: cars.map(mapCarListItem),
    meta: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getCarById(id: string): Promise<CarDetails> {
  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!car) {
    throw new HttpError(404, "Car not found");
  }

  return {
    ...mapCarListItem({
      ...car,
      images: car.images.map((image) => ({ url: image.url })),
    }),
    rawData: car.rawData as Record<string, unknown>,
    images: car.images.map((image) => ({
      id: image.id,
      url: image.url,
      sortOrder: image.sortOrder,
    })),
  };
}
