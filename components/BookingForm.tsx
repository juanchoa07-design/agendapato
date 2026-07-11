"use client";

import { useMemo, useState } from "react";
import { getAllSlotsForDate, nextOpenDateStr, todayStr } from "@/lib/slots";
import type { Service } from "@/lib/types";

const WHATSAPP_NUMBER = "59892973365"; // 092 973 365 (Uruguay, +598)

function formatPrice(price: number | null) {
  if (price == null) return "";
  return price.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function formatDateEs(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export default function BookingForm({ services }: { services: Service[] }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState(nextOpenDateStr());
  const [time, setTime] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const slots = useMemo(() => getAllSlotsForDate(date), [date]);

  function handleDateChange(newDate: string) {
    setDate(newDate);
    setTime("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!time) {
      setSubmitError("Elegí un horario disponible.");
      return;
    }

    const service = services.find((s) => s.id === serviceId);
    const message = [
      "Hola! Quiero agendar un turno en Lavadero El Pato.",
      `Servicio: ${service?.name ?? ""}`,
      `Fecha: ${formatDateEs(date)} (sábado)`,
      `Horario: ${time} hs`,
      `Nombre: ${customerName}`,
      `Teléfono: ${customerPhone}`,
      customerEmail ? `Email: ${customerEmail}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-800">Nombre</label>
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-800">Teléfono</label>
          <input
            required
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
            placeholder="011 1234 5678"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-800">Email</label>
        <input
          required
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-800">Servicio</label>
        <select
          required
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
              {service.price != null ? ` — ${formatPrice(service.price)}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-800">Fecha</label>
        <input
          required
          type="date"
          min={todayStr()}
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
        />
        <p className="mt-1 text-xs text-gray-500">Atendemos solo los sábados, de 8:00 a 15:00.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-800">Horario</label>
        {slots.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">Ese día no atendemos, elegí un sábado.</p>
        )}
        {slots.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {slots.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => setTime(slot)}
                className={`rounded-lg border px-2 py-1.5 text-sm font-medium ${
                  time === slot
                    ? "border-blue-900 bg-blue-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-blue-700 hover:text-blue-900"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <button
        type="submit"
        disabled={services.length === 0}
        className="w-full rounded-lg bg-blue-900 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-950 disabled:opacity-50"
      >
        Confirmar turno
      </button>
      <p className="text-center text-xs text-slate-500">
        Te vamos a llevar a WhatsApp para enviar la solicitud.
      </p>
    </form>
  );
}
