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
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Nombre</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Duración</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Precio</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Estado</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialServices.map((service) => (
              <tr key={service.id}>
                <td className="px-4 py-2 text-gray-900">{service.name}</td>
                <td className="px-4 py-2 text-gray-700">{service.duration_minutes} min</td>
                <td className="px-4 py-2 text-gray-700">
                  {service.price != null ? `$${service.price}` : "—"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      service.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {service.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-3">
                    <button
                      disabled={isPending}
                      onClick={() => toggleActive(service)}
                      className="text-xs text-blue-700 hover:underline disabled:opacity-50"
                    >
                      {service.active ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleDelete(service)}
                      className="text-xs text-red-700 hover:underline disabled:opacity-50"
                    >
                      Borrar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {initialServices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  Todavía no cargaste ningún servicio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 font-semibold text-gray-900">Agregar servicio</h2>
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-4 sm:items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600">Nombre</label>
            <input
              required
              name="name"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Duración (min)</label>
            <input
              required
              type="number"
              min={5}
              step={5}
              name="duration_minutes"
              defaultValue={30}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Precio</label>
            <input
              type="number"
              min={0}
              step="0.01"
              name="price"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-4">
            {formError && <p className="mb-2 text-sm text-red-600">{formError}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
