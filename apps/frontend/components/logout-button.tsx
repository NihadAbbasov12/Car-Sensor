"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900"
    >
      Logout
    </button>
  );
}
