"use client";

import { useState, useTransition } from "react";
import { createService, deleteService, updateService } from "@/app/admin/actions";
import type { Service } from "@/lib/types";

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createService(formData);
      if (!result.ok) {
        setFormError(result.error);
      } else {
        form.reset();
      }
    });
  }

  function toggleActive(service: Service) {
    startTransition(async () => {
      await updateService(service.id, { active: !service.active });
    });
  }

  function handleDelete(service: Service) {
    if (!confirm(`¿Borrar el servicio "${service.name}"?`)) return;
    startTransition(async () => {
      const result = await deleteService(service.id);
      if (!result.ok) alert(result.error);
    });
  }

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-blue-950">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Nombre</th>
              <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Duración</th>
              <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Precio</th>
              <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Estado</th>
              <th className="px-4 py-2.5 text-left font-semibold text-blue-100">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialServices.map((service) => (
              <tr key={service.id} className="hover:bg-blue-50/50">
                <td className="px-4 py-2.5 font-medium text-blue-950">{service.name}</td>
                <td className="px-4 py-2.5 text-slate-700">{service.duration_minutes} min</td>
                <td className="px-4 py-2.5 text-slate-700">
                  {service.price != null ? `$${service.price}` : "—"}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      service.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {service.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-3">
                    <button
                      disabled={isPending}
                      onClick={() => toggleActive(service)}
                      className="text-xs font-medium text-blue-800 hover:underline disabled:opacity-50"
                    >
                      {service.active ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleDelete(service)}
                      className="text-xs font-medium text-red-700 hover:underline disabled:opacity-50"
                    >
                      Borrar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {initialServices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-slate-500">
                  Todavía no cargaste ningún servicio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-blue-950">Agregar servicio</h2>
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-4 sm:items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600">Nombre</label>
            <input
              required
              name="name"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Duración (min)</label>
            <input
              required
              type="number"
              min={5}
              step={5}
              name="duration_minutes"
              defaultValue={30}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Precio</label>
            <input
              type="number"
              min={0}
              step="0.01"
              name="price"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
            />
          </div>
          <div className="sm:col-span-4">
            {formError && <p className="mb-2 text-sm text-red-600">{formError}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-950 disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
