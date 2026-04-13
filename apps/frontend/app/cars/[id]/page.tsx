import Link from "next/link";
import { ImageGallery } from "../../../components/image-gallery";
import { getCar } from "../../../lib/api";
import { formatMileage, formatPrice, formatValue, preferSecondImage } from "../../../lib/image-utils";
import {
  normalizeBodyType,
  normalizeBrand,
  normalizeColor,
  normalizeLocation,
  normalizeModel,
} from "../../../lib/normalize-display";

const detailFields: Array<[label: string, key: string]> = [
  ["Brand", "brand"],
  ["Model", "model"],
  ["Year", "year"],
  ["Mileage", "mileageKm"],
  ["Base price", "priceJpy"],
  ["Total price", "totalPriceJpy"],
  ["Body type", "bodyType"],
  ["Fuel type", "fuelType"],
  ["Transmission", "transmission"],
  ["Drive", "drive"],
  ["Engine", "engineCc"],
  ["Color", "color"],
  ["Location", "location"],
];

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await getCar(id);
  const rawImages = car.images.map((image) => image.url).filter((url) => Boolean(url));
  const fallbackImages = rawImages.length > 0 ? rawImages : car.mainImageUrl ? [car.mainImageUrl] : [];
  const imageUrls = preferSecondImage(fallbackImages).slice(0, 8);

  const displayBrand = normalizeBrand(car.brand);
  const displayModel = normalizeModel(car.model);
  const displayLocation = normalizeLocation(car.location);
  const displayBodyType = normalizeBodyType(car.bodyType);
  const displayColor = normalizeColor(car.color);
  const primaryTitle = [displayBrand, displayModel].filter(Boolean).join(" ");

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/cars" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Back to listings
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ImageGallery images={imageUrls} title={car.title} />

          <div className="space-y-5 rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-700">
                {displayBrand ?? "Unknown brand"}
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">{primaryTitle || "Unknown model"}</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-3xl bg-slate-50 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Base price</p>
                <p className="text-lg font-semibold">{formatPrice(car.priceJpy)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Total price</p>
                <p className="text-lg font-semibold">{formatPrice(car.totalPriceJpy)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Year</p>
                <p>{formatValue(car.year)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Mileage</p>
                <p>{formatMileage(car.mileageKm)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Fuel</p>
                <p>{formatValue(car.fuelType)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Transmission</p>
                <p>{formatValue(car.transmission)}</p>
              </div>
            </div>

            <div className="grid gap-3">
              {detailFields.map(([label, key]) => {
                const value = car[key as keyof typeof car];
                const normalizedValue =
                  key === "brand"
                    ? displayBrand
                    : key === "model"
                      ? displayModel
                      : key === "location"
                        ? displayLocation
                        : key === "bodyType"
                          ? displayBodyType
                          : key === "color"
                            ? displayColor
                            : value;

                const display =
                  key === "priceJpy" || key === "totalPriceJpy"
                    ? formatPrice(value as number | null)
                    : key === "mileageKm"
                      ? formatMileage(value as number | null)
                      : key === "engineCc"
                        ? `${formatValue(normalizedValue as number | null)} cc`
                        : formatValue(normalizedValue as string | number | null);

                return (
                  <div key={key} className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-right font-medium text-slate-900">{display}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Source details</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Raw title</p>
              <p className="text-sm text-slate-700">{car.title}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Source link</p>
              <a href={car.sourceUrl} target="_blank" rel="noreferrer" className="text-sm text-amber-700 underline">
                {car.sourceUrl}
              </a>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Source ID</p>
              <p className="text-sm text-slate-700">{car.sourceId}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last updated</p>
              <p className="text-sm text-slate-700">{new Date(car.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Raw extracted attributes</h2>
            <pre className="mt-4 max-h-[420px] overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
              {JSON.stringify(car.rawData, null, 2)}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
