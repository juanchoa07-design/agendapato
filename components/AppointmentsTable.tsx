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
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function AppointmentsTable({ appointments }: { appointments: Appointment[] }) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(id: string, status: AppointmentStatus) {
    startTransition(async () => {
      await updateAppointmentStatus(id, status);
    });
  }

  if (appointments.length === 0) {
    return <p className="text-gray-600">No hay turnos para este día.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Hora</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Cliente</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Teléfono</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Servicio</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Estado</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td className="px-4 py-2 font-medium text-gray-900">
                {appt.appointment_time.slice(0, 5)}
              </td>
              <td className="px-4 py-2 text-gray-700">{appt.customer_name}</td>
              <td className="px-4 py-2 text-gray-700">{appt.customer_phone}</td>
              <td className="px-4 py-2 text-gray-700">{appt.services?.name ?? "—"}</td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[appt.status]}`}
                >
                  {STATUS_LABEL[appt.status]}
                </span>
              </td>
              <td className="px-4 py-2">
                {appt.status === "confirmed" && (
                  <div className="flex gap-2">
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(appt.id, "completed")}
                      className="text-xs text-green-700 hover:underline disabled:opacity-50"
                    >
                      Completar
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusChange(appt.id, "cancelled")}
                      className="text-xs text-red-700 hover:underline disabled:opacity-50"
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
