"use client";

import { useRouter } from "next/navigation";

export default function AgendaDatePicker({ date }: { date: string }) {
  const router = useRouter();

  return (
    <input
      type="date"
      defaultValue={date}
      onChange={(e) => router.push(`/admin/agenda?date=${e.target.value}`)}
      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
    />
  );
}
