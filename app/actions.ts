"use server";

import { createClient } from "@/lib/supabase/server";
import { getAllSlotsForDate, todayStr } from "@/lib/slots";

export type BookingResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createAppointment(formData: FormData): Promise<BookingResult> {
  const customer_name = String(formData.get("customer_name") ?? "").trim();
  const customer_phone = String(formData.get("customer_phone") ?? "").trim();
  const customer_email = String(formData.get("customer_email") ?? "").trim();
  const service_id = String(formData.get("service_id") ?? "").trim();
  const appointment_date = String(formData.get("appointment_date") ?? "").trim();
  const appointment_time = String(formData.get("appointment_time") ?? "").trim();

  if (
    !customer_name ||
    !customer_phone ||
    !customer_email ||
    !service_id ||
    !appointment_date ||
    !appointment_time
  ) {
    return { ok: false, error: "Completá todos los campos." };
  }

  if (appointment_date < todayStr()) {
    return { ok: false, error: "Elegí una fecha futura." };
  }

  const validSlots = getAllSlotsForDate(appointment_date);
  if (!validSlots.includes(appointment_time)) {
    return { ok: false, error: "Ese horario no está disponible." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert({
    customer_name,
    customer_phone,
    customer_email,
    service_id,
    appointment_date,
    appointment_time,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Ese horario ya fue reservado por otra persona. Elegí otro." };
    }
    return { ok: false, error: "No se pudo crear el turno. Intentá de nuevo." };
  }

  return { ok: true };
}
