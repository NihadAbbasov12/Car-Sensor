import type { NormalizedCarRecord, RawDetailCar } from "./types";

const fieldLabelMap: Record<string, string> = {
  "\u5e74\u5f0f": "year",
  "\u8d70\u884c\u8ddd\u96e2": "mileage",
  "\u8eca\u4e21\u672c\u4f53\u4fa1\u683c": "price",
  "\u4fa1\u683c": "price",
  "\u652f\u6255\u7dcf\u984d": "totalPrice",
  "\u6392\u6c17\u91cf": "engineCc",
  "\u71c3\u6599": "fuelType",
  "\u30a8\u30f3\u30b8\u30f3\u7a2e\u5225": "fuelType",
  "\u99c6\u52d5\u65b9\u5f0f": "drive",
  "\u30df\u30c3\u30b7\u30e7\u30f3": "transmission",
  "\u8272": "color",
  "\u30dc\u30c7\u30a3\u30bf\u30a4\u30d7": "bodyType",
  "\u5730\u57df": "location",
};

const fuelTypeMap: Record<string, string> = {
  "\u30ac\u30bd\u30ea\u30f3": "petrol",
  "\u30ec\u30ae\u30e5\u30e9\u30fc": "petrol",
  "\u30cf\u30a4\u30aa\u30af": "petrol",
  "\u30c7\u30a3\u30fc\u30bc\u30eb": "diesel",
  "\u8efd\u6cb9": "diesel",
  "\u30cf\u30a4\u30d6\u30ea\u30c3\u30c9": "hybrid",
  PHV: "plug_in_hybrid",
  PHEV: "plug_in_hybrid",
  "\u96fb\u6c17": "electric",
  EV: "electric",
  LPG: "lpg",
};

const transmissionMap: Record<string, string> = {
  AT: "automatic",
  "\u30aa\u30fc\u30c8\u30de": "automatic",
  MT: "manual",
  CVT: "cvt",
  "\u30a4\u30f3\u30d1\u30cdCVT": "cvt",
  "\u30d5\u30ed\u30a2CVT": "cvt",
};

const driveMap: Record<string, string> = {
  "2WD": "2wd",
  "4WD": "4wd",
  FF: "2wd",
  FR: "2wd",
  AWD: "4wd",
};

const colorMap: Record<string, string> = {
  "\u9ed2": "black",
  "\u9ed2\uff2d": "black",
  "\u30d6\u30e9\u30c3\u30af": "black",
  "\u767d": "white",
  "\u30d1\u30fc\u30eb": "white",
  "\u30b7\u30eb\u30d0\u30fc": "silver",
  "\u7070": "gray",
  "\u30b0\u30ec\u30fc": "gray",
  "\u8d64": "red",
  "\u30ec\u30c3\u30c9": "red",
  "\u9752": "blue",
  "\u30d6\u30eb\u30fc": "blue",
};

export function mapFieldLabel(label: string) {
  return fieldLabelMap[label] ?? label;
}

export function extractInteger(rawValue: string | null | undefined) {
  if (!rawValue) {
    return null;
  }

  const normalized = rawValue.replace(/[^\d.]/g, "");
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

export function parsePriceToJpy(rawValue: string | null | undefined) {
  if (!rawValue) {
    return null;
  }

  const normalized = rawValue.replace(/[,\s]/g, "");

  if (normalized.includes("\u4e07\u5186")) {
    const match = normalized.match(/(\d+(?:\.\d+)?)/);
    if (!match) {
      return null;
    }

    return Math.round(Number.parseFloat(match[1]) * 10000);
  }

  const digits = normalized.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : null;
}

export function parseMileageKm(rawValue: string | null | undefined) {
  if (!rawValue) {
    return null;
  }

  const normalized = rawValue.replace(/[,\s]/g, "");
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }

  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value)) {
    return null;
  }

  if (normalized.includes("\u4e07km")) {
    return Math.round(value * 10000);
  }

  return Math.round(value);
}

export function parseYear(rawValue: string | null | undefined) {
  if (!rawValue) {
    return null;
  }

  const match = rawValue.match(/(19|20)\d{2}/);
  return match ? Number.parseInt(match[0], 10) : null;
}

export function normalizeMappedValue(
  rawValue: string | null | undefined,
  dictionary: Record<string, string>,
) {
  if (!rawValue) {
    return null;
  }

  const direct = dictionary[rawValue];
  if (direct) {
    return direct;
  }

  const entry = Object.entries(dictionary).find(([key]) => rawValue.includes(key));
  return entry?.[1] ?? null;
}

export function normalizeCar(raw: RawDetailCar): NormalizedCarRecord {
  const attributes = Object.fromEntries(
    Object.entries(raw.attributes).map(([label, value]) => [mapFieldLabel(label), value]),
  );

  const fuelTypeRaw =
    raw.fuelTypeRaw ??
    raw.attributes["\u71c3\u6599"] ??
    raw.attributes["\u30a8\u30f3\u30b8\u30f3\u7a2e\u5225"] ??
    null;

  return {
    sourceId: raw.sourceId,
    sourceUrl: raw.sourceUrl,
    title: raw.detailTitle ?? raw.title,
    brand: raw.brandRaw ? raw.brandRaw.trim() : null,
    model: raw.modelRaw ? raw.modelRaw.trim() : null,
    year: parseYear(raw.attributes["\u5e74\u5f0f"] ?? raw.yearRaw),
    mileageKm: parseMileageKm(raw.attributes["\u8d70\u884c\u8ddd\u96e2"] ?? raw.mileageRaw),
    priceJpy: parsePriceToJpy(raw.attributes["\u8eca\u4e21\u672c\u4f53\u4fa1\u683c"] ?? raw.priceRaw),
    totalPriceJpy: parsePriceToJpy(raw.attributes["\u652f\u6255\u7dcf\u984d"] ?? raw.totalPriceRaw),
    bodyType: raw.bodyTypeRaw,
    fuelType: normalizeMappedValue(fuelTypeRaw, fuelTypeMap),
    transmission: normalizeMappedValue(raw.transmissionRaw, transmissionMap),
    drive: normalizeMappedValue(raw.driveRaw, driveMap),
    engineCc: extractInteger(raw.attributes["\u6392\u6c17\u91cf"] ?? raw.engineCcRaw),
    color: normalizeMappedValue(raw.colorRaw, colorMap) ?? raw.colorRaw,
    location: raw.locationRaw,
    images: raw.imageUrls,
    rawData: {
      rawAttributes: raw.attributes,
      mappedAttributes: attributes,
      rawValues: {
        title: raw.title,
        detailTitle: raw.detailTitle,
        brand: raw.brandRaw,
        model: raw.modelRaw,
        year: raw.yearRaw,
        mileage: raw.mileageRaw,
        price: raw.priceRaw,
        totalPrice: raw.totalPriceRaw,
        engineCc: raw.engineCcRaw,
        transmission: raw.transmissionRaw,
        fuelType: fuelTypeRaw,
        drive: raw.driveRaw,
        color: raw.colorRaw,
        bodyType: raw.bodyTypeRaw,
        location: raw.locationRaw,
      },
    },
  };
}
