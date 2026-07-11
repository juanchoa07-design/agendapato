"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { login } from "@/app/admin/actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await login(formData);
      if (result && !result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-blue-950 to-blue-900 px-4">
      <div className="w-40 overflow-hidden rounded-2xl shadow-xl shadow-blue-950/30">
        <Image
          src="/lavadero-el-pato-hero.png"
          alt="Lavadero El Pato"
          width={1080}
          height={1350}
          priority
          className="h-auto w-full"
        />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-white">Lavadero El Pato</h1>
      <p className="mt-1 text-sm text-blue-200">Panel del dueño</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-sm space-y-4 rounded-2xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-950/20"
      >
        <div>
          <label className="block text-sm font-semibold text-slate-800">Email</label>
          <input
            required
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-800">Contraseña</label>
          <input
            required
            name="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-900 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-950 disabled:opacity-50"
        >
          {isPending ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
