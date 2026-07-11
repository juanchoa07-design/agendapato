"use client";

import { useRouter } from "next/navigation";

export default function AgendaDatePicker({ date }: { date: string }) {
  const router = useRouter();

  return (
    <input
      type="date"
      defaultValue={date}
      onChange={(e) => router.push(`/admin/agenda?date=${e.target.value}`)}
      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
    />
  );
}
