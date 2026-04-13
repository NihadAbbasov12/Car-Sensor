interface PaginationProps {
  page: number;
  pages: number;
  baseQuery: URLSearchParams;
}

function buildHref(baseQuery: URLSearchParams, page: number) {
  const params = new URLSearchParams(baseQuery);
  params.set("page", String(page));
  return `/cars?${params.toString()}`;
}

export function Pagination({ page, pages, baseQuery }: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm shadow-slate-200">
      <p className="text-sm text-slate-500">
        Page {page} of {pages}
      </p>
      <div className="flex items-center gap-2">
        <a
          href={page > 1 ? buildHref(baseQuery, page - 1) : "#"}
          className={`rounded-full px-4 py-2 text-sm ${page > 1 ? "bg-ink text-white" : "bg-slate-100 text-slate-400"}`}
        >
          Previous
        </a>
        <a
          href={page < pages ? buildHref(baseQuery, page + 1) : "#"}
          className={`rounded-full px-4 py-2 text-sm ${page < pages ? "bg-ink text-white" : "bg-slate-100 text-slate-400"}`}
        >
          Next
        </a>
      </div>
    </div>
  );
}
