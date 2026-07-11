// Configuración del horario comercial del lavadero.
// 0 = domingo ... 6 = sábado. Editar acá si cambian los horarios/días de atención.
export const BUSINESS_HOURS: Record<number, { open: string; close: string } | null> = {
  0: null, // domingo cerrado
  1: { open: "08:00", close: "18:00" },
  2: { open: "08:00", close: "18:00" },
  3: { open: "08:00", close: "18:00" },
  4: { open: "08:00", close: "18:00" },
  5: { open: "08:00", close: "18:00" },
  6: { open: "08:00", close: "13:00" },
};

export const SLOT_MINUTES = 30;

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Todos los horarios posibles (HH:MM) para una fecha dada, según el horario comercial. */
export function getAllSlotsForDate(dateStr: string): string[] {
  const date = new Date(`${dateStr}T00:00:00`);
  const hours = BUSINESS_HOURS[date.getDay()];
  if (!hours) return [];

  const start = timeToMinutes(hours.open);
  const end = timeToMinutes(hours.close);
  const slots: string[] = [];
  for (let m = start; m < end; m += SLOT_MINUTES) {
    slots.push(minutesToTime(m));
  }
  return slots;
}

/** Horarios libres para una fecha, dados los horarios ya ocupados (formato HH:MM o HH:MM:SS). */
export function getAvailableSlots(dateStr: string, bookedTimes: string[]): string[] {
  const booked = new Set(bookedTimes.map((t) => t.slice(0, 5)));
  return getAllSlotsForDate(dateStr).filter((slot) => !booked.has(slot));
}

/** Fecha de hoy en formato YYYY-MM-DD (zona horaria local). */
export function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const d = now.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}
