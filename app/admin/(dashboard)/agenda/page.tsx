import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { todayStr } from "@/lib/slots";
import AppointmentsTable from "@/components/AppointmentsTable";
import AgendaDatePicker from "@/components/AgendaDatePicker";
import type { Appointment } from "@/lib/types";

function shiftDate(dateStr: string, days: number) {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : todayStr();

  const supabase = await createClient();
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, services(id, name, price)")
    .eq("appointment_date", date)
    .order("appointment_time");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-900">Agenda del día</h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/agenda?date=${shiftDate(date, -1)}`}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
          >
            ← Anterior
          </Link>
          <AgendaDatePicker date={date} />
          <Link
            href={`/admin/agenda?date=${shiftDate(date, 1)}`}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
          >
            Siguiente →
          </Link>
        </div>
      </div>

      <AppointmentsTable appointments={(appointments ?? []) as Appointment[]} />
    </div>
  );
}
