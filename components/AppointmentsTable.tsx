"use client";

import { useTransition } from "react";
import { updateAppointmentStatus } from "@/app/admin/actions";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  confirmed: "Confirmado",
  completed: "Completado",
  cancelled: "Cancelado",
};

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  confirmed: "bg-blue-100 text-blue-900",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-slate-100 text-slate-500",
};

export default function AppointmentsTable({ appointments }: { appointments: Appointment[] }) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(id: string, status: AppointmentStatus) {
    startTransition(async () => {
      await updateAppointmentStatus(id, status);
    });
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        No hay turnos para este día.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-blue-950">
          <tr>
            <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Hora</th>
            <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Cliente</th>
            <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Teléfono</th>
            <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Servicio</th>
            <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Estado</th>
            <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {appointments.map((appt) => (
            <tr key={appt.id} className="hover:bg-blue-50/50">
              <td className="px-4 py-2.5 font-semibold text-blue-950">
                {appt.appointment_time.slice(0, 5)}
              </td>
              <td className="px-4 py-2.5 text-slate-700">{appt.customer_name}</td>
              <td className="px-4 py-2.5 text-slate-700">{appt.customer_phone}</td>
              <td className="px-4 py-2.5 text-slate-700">{appt.services?.name ?? "—"}</td>
              <td className="px-4 py-2.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[appt.status]}`}
                >
                  {STATUS_LABEL[appt.status]}
                </span>
              </td>
              <td className="px-4 py-2.5">
                {appt.status === "confirmed" && (
                  <div className="flex gap-3">
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(appt.id, "completed")}
                      className="text-xs font-medium text-emerald-700 hover:underline disabled:opacity-50"
                    >
                      Completar
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(appt.id, "cancelled")}
                      className="text-xs font-medium text-red-700 hover:underline disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
