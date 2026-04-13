import Link from "next/link";
import type { CarListItem } from "@carsensor/shared";
import { ImageWithFallback } from "./image-with-fallback";
import { formatMileage, formatPrice, formatValue } from "../lib/image-utils";
import { normalizeBrand, normalizeLocation, normalizeModel } from "../lib/normalize-display";

export function CarCard({ car }: { car: CarListItem }) {
  const primaryImage = car.previewImageUrl ?? car.mainImageUrl ?? null;
  const displayBrand = normalizeBrand(car.brand);
  const displayModel = normalizeModel(car.model);
  const displayLocation = normalizeLocation(car.location);
  const primaryTitle = [displayBrand, displayModel].filter(Boolean).join(" ");
  return (
    <Link
      href={`/cars/${car.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm shadow-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-52 bg-slate-100">
        <ImageWithFallback
          src={primaryImage}
          alt={primaryTitle || car.title}
          className="h-52 w-full object-cover transition group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-700">{displayBrand ?? "Unknown brand"}</p>
          <div className="space-y-1">
            <h2 className="line-clamp-2 text-xl font-semibold text-slate-900">
              {primaryTitle || "Unknown model"}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">{formatValue(car.year)}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{formatMileage(car.mileageKm)}</span>
            {car.fuelType ? (
              <span className="rounded-full bg-slate-100 px-3 py-1">{car.fuelType}</span>
            ) : null}
            {car.transmission ? (
              <span className="rounded-full bg-slate-100 px-3 py-1">{car.transmission}</span>
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Base price</p>
            <p className="text-lg font-semibold text-slate-900">{formatPrice(car.priceJpy)}</p>
            <p className="text-xs text-slate-400">Location: {displayLocation ?? "N/A"}</p>
          </div>
          <span className="text-sm font-medium text-amber-700">View details</span>
        </div>
      </div>
    </Link>
  );
}
