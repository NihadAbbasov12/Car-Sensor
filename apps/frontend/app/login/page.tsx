import { LoginForm } from "../../components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.25),_transparent_35%),linear-gradient(135deg,_#f8f3ea,_#fffaf2)] px-4 py-12">
      <div className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Test Assignment MVP</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight text-slate-900">
            Searchable Japanese used-car inventory with real scraping and normalized data.
          </h1>
          <p className="max-w-xl text-base text-slate-600">
            This frontend sits on top of a JWT-protected API backed by PostgreSQL, Prisma, and an hourly CarSensor
            scraper worker.
          </p>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}
