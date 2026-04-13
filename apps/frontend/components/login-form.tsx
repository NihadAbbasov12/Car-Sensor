"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ message: "Login failed" }));
      setError(body.message ?? "Login failed");
      setLoading(false);
      return;
    }

    router.push("/cars");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">CarSensor MVP</p>
        <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Use the seeded admin account to access the protected car inventory.</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Username</label>
          <input value={username} onChange={(event) => setUsername(event.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
      </div>

      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
