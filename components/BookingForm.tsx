"use client";

import { useEffect, useState, useTransition } from "react";
import { createAppointment } from "@/app/actions";
import { nextOpenDateStr, todayStr } from "@/lib/slots";
import type { Service } from "@/lib/types";

function formatPrice(price: number | null) {
  if (price == null) return "";
  return price.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

export default function BookingForm({ services }: { services: Service[] }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState(nextOpenDateStr());
  const [time, setTime] = useState("");

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDateChange(newDate: string) {
    setDate(newDate);
    setTime("");
  }

  useEffect(() => {
    let cancelled = false;
    // Standard fetch-on-effect loading pattern (React docs: "Fetching data").
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlotsLoading(true);
    setSlotsError(null);

    fetch(`/api/available-slots?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setSlotsError(data.error);
          setSlots([]);
        } else {
          setSlots(data.slots ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setSlotsError("No se pudieron cargar los horarios.");
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!time) {
      setSubmitError("Elegí un horario disponible.");
      return;
    }

    const formData = new FormData();
    formData.set("customer_name", customerName);
    formData.set("customer_phone", customerPhone);
    formData.set("customer_email", customerEmail);
    formData.set("service_id", serviceId);
    formData.set("appointment_date", date);
    formData.set("appointment_time", time);

    startTransition(async () => {
      const result = await createAppointment(formData);
      if (result.ok) {
        setSuccess(true);
      } else {
        setSubmitError(result.error);
      }
    });
  }

  if (success) {
    const service = services.find((s) => s.id === serviceId);
    return (
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-xl text-white">
          ✓
        </div>
        <h2 className="mt-3 text-xl font-semibold text-blue-950">¡Turno confirmado!</h2>
        <p className="mt-2 text-blue-900">
          {service?.name} el {date} a las {time} hs.
        </p>
        <p className="mt-1 text-sm text-blue-800">
          Te esperamos, {customerName}. Guardá este horario.
        </p>
        <button
          className="mt-4 rounded-md bg-blue-900 px-4 py-2 text-white hover:bg-blue-950"
          onClick={() => {
            setSuccess(false);
            setCustomerName("");
            setCustomerPhone("");
            setCustomerEmail("");
            setTime("");
          }}
        >
          Agendar otro turno
        </button>
      </div>
    );
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
        {slotsLoading && <p className="mt-2 text-sm text-gray-500">Cargando horarios…</p>}
        {slotsError && <p className="mt-2 text-sm text-red-600">{slotsError}</p>}
        {!slotsLoading && !slotsError && slots.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">No hay horarios disponibles ese día.</p>
        )}
        {!slotsLoading && slots.length > 0 && (
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
        disabled={isPending || services.length === 0}
        className="w-full rounded-lg bg-blue-900 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-950 disabled:opacity-50"
      >
        {isPending ? "Agendando…" : "Confirmar turno"}
      </button>
    </form>
  );
}
