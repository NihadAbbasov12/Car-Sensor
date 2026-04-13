import { CarCard } from "../../components/car-card";
import { CarFilters } from "../../components/car-filters";
import { LogoutButton } from "../../components/logout-button";
import { Pagination } from "../../components/pagination";
import { getCars } from "../../lib/api";

interface CarsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(Array.isArray(resolvedSearchParams.page) ? resolvedSearchParams.page[0] : resolvedSearchParams.page) || 1;
  const limit =
    Number(Array.isArray(resolvedSearchParams.limit) ? resolvedSearchParams.limit[0] : resolvedSearchParams.limit) || 20;

  const cars = await getCars({
    page,
    limit,
    sortBy: (Array.isArray(resolvedSearchParams.sortBy) ? resolvedSearchParams.sortBy[0] : resolvedSearchParams.sortBy) as
      | "createdAt"
      | "updatedAt"
      | "priceJpy"
      | "year"
      | "mileageKm"
      | "brand"
      | "model"
      | undefined,
    sortOrder: (Array.isArray(resolvedSearchParams.sortOrder) ? resolvedSearchParams.sortOrder[0] : resolvedSearchParams.sortOrder) as
      | "asc"
      | "desc"
      | undefined,
    brand: Array.isArray(resolvedSearchParams.brand) ? resolvedSearchParams.brand[0] : resolvedSearchParams.brand,
    model: Array.isArray(resolvedSearchParams.model) ? resolvedSearchParams.model[0] : resolvedSearchParams.model,
    minPrice: Number(Array.isArray(resolvedSearchParams.minPrice) ? resolvedSearchParams.minPrice[0] : resolvedSearchParams.minPrice) || undefined,
    maxPrice: Number(Array.isArray(resolvedSearchParams.maxPrice) ? resolvedSearchParams.maxPrice[0] : resolvedSearchParams.maxPrice) || undefined,
    minYear: Number(Array.isArray(resolvedSearchParams.minYear) ? resolvedSearchParams.minYear[0] : resolvedSearchParams.minYear) || undefined,
    maxYear: Number(Array.isArray(resolvedSearchParams.maxYear) ? resolvedSearchParams.maxYear[0] : resolvedSearchParams.maxYear) || undefined,
    minMileage:
      Number(Array.isArray(resolvedSearchParams.minMileage) ? resolvedSearchParams.minMileage[0] : resolvedSearchParams.minMileage) || undefined,
    maxMileage:
      Number(Array.isArray(resolvedSearchParams.maxMileage) ? resolvedSearchParams.maxMileage[0] : resolvedSearchParams.maxMileage) || undefined,
  });

  const baseQuery = new URLSearchParams();
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value) {
      baseQuery.set(key, Array.isArray(value) ? value[0] : value);
    }
  });

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-4 rounded-[2rem] bg-[linear-gradient(135deg,_#10212b,_#1f3a48_60%,_#d97706_160%)] px-6 py-8 text-white md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-200">Protected Inventory</p>
            <h1 className="text-4xl font-semibold">Imported Car Listings</h1>
            <p className="max-w-2xl text-sm text-slate-200">
              Browse normalized records scraped from CarSensor with server-side filtering, sorting, and pagination.
            </p>
          </div>
          <LogoutButton />
        </section>

        <CarFilters searchParams={resolvedSearchParams} />

        <section className="flex items-center justify-between">
          <p className="text-sm text-slate-500">{cars.meta.total.toLocaleString()} cars available</p>
        </section>

        {cars.items.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm shadow-slate-200">
            No cars matched the current filters.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cars.items.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        <Pagination page={cars.meta.page} pages={cars.meta.pages} baseQuery={baseQuery} />
      </div>
    </main>
  );
}
