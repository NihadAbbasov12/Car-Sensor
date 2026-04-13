import type { CarsQuery } from "@carsensor/shared";

interface CarFiltersProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function getValue(searchParams: CarFiltersProps["searchParams"], key: keyof CarsQuery) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value ?? "";
}

export function CarFilters({ searchParams }: CarFiltersProps) {
  return (
    <form className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm shadow-slate-200 md:grid-cols-2 xl:grid-cols-4">
      <input name="brand" placeholder="Brand" defaultValue={getValue(searchParams, "brand")} />
      <input name="model" placeholder="Model" defaultValue={getValue(searchParams, "model")} />
      <input name="minPrice" placeholder="Min price (JPY)" defaultValue={getValue(searchParams, "minPrice")} />
      <input name="maxPrice" placeholder="Max price (JPY)" defaultValue={getValue(searchParams, "maxPrice")} />
      <input name="minYear" placeholder="Min year" defaultValue={getValue(searchParams, "minYear")} />
      <input name="maxYear" placeholder="Max year" defaultValue={getValue(searchParams, "maxYear")} />
      <input
        name="minMileage"
        placeholder="Min mileage (km)"
        defaultValue={getValue(searchParams, "minMileage")}
      />
      <input
        name="maxMileage"
        placeholder="Max mileage (km)"
        defaultValue={getValue(searchParams, "maxMileage")}
      />
      <select name="sortBy" defaultValue={getValue(searchParams, "sortBy") || "createdAt"}>
        <option value="createdAt">Newest scraped</option>
        <option value="updatedAt">Recently updated</option>
        <option value="priceJpy">Price</option>
        <option value="year">Year</option>
        <option value="mileageKm">Mileage</option>
        <option value="brand">Brand</option>
        <option value="model">Model</option>
      </select>
      <select name="sortOrder" defaultValue={getValue(searchParams, "sortOrder") || "desc"}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
      <select name="limit" defaultValue={getValue(searchParams, "limit") || "20"}>
        <option value="12">12 per page</option>
        <option value="20">20 per page</option>
        <option value="40">40 per page</option>
      </select>
      <div className="flex items-center gap-3">
        <button className="rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Apply filters
        </button>
        <a href="/cars" className="text-sm text-slate-500 underline-offset-4 hover:underline">
          Reset
        </a>
      </div>
    </form>
  );
}
