// Configuración del horario comercial del lavadero.
// 0 = domingo ... 6 = sábado. Editar acá si cambian los horarios/días de atención.
export const BUSINESS_HOURS: Record<number, { open: string; close: string } | null> = {
  0: null, // domingo cerrado
  1: null, // lunes cerrado
  2: null, // martes cerrado
  3: null, // miércoles cerrado
  4: null, // jueves cerrado
  5: null, // viernes cerrado
  6: { open: "08:00", close: "15:00" }, // sábado, único día que se agenda
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

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Fecha de hoy en formato YYYY-MM-DD (zona horaria local). */
export function todayStr(): string {
  return formatDate(new Date());
}

/** Próxima fecha (hoy inclusive) en la que el lavadero atiende, según BUSINESS_HOURS. */
export function nextOpenDateStr(): string {
  const date = new Date();
  for (let i = 0; i < 14; i++) {
    if (BUSINESS_HOURS[date.getDay()]) return formatDate(date);
    date.setDate(date.getDate() + 1);
  }
  return todayStr();
}
