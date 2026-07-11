"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function login(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Completá email y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, error: "Email o contraseña incorrectos." };
  }

  redirect("/admin/agenda");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);

  if (error) {
    return { ok: false, error: "No se pudo actualizar el turno." };
  }

  revalidatePath("/admin/agenda");
  return { ok: true };
}

export async function createService(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const duration_minutes = Number(formData.get("duration_minutes"));
  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = priceRaw ? Number(priceRaw) : null;

  if (!name || !duration_minutes || duration_minutes <= 0) {
    return { ok: false, error: "Completá nombre y duración válidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .insert({ name, duration_minutes, price });

  if (error) {
    return { ok: false, error: "No se pudo crear el servicio." };
  }

  revalidatePath("/admin/servicios");
  return { ok: true };
}

export async function updateService(
  id: string,
  updates: { name?: string; duration_minutes?: number; price?: number | null; active?: boolean },
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("services").update(updates).eq("id", id);

  if (error) {
    return { ok: false, error: "No se pudo actualizar el servicio." };
  }

  revalidatePath("/admin/servicios");
  return { ok: true };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    return {
      ok: false,
      error: "No se pudo borrar el servicio (puede tener turnos asociados). Podés desactivarlo en su lugar.",
    };
  }

  revalidatePath("/admin/servicios");
  return { ok: true };
}
