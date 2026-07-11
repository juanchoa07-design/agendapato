import { createClient } from "@/lib/supabase/server";
import BookingForm from "@/components/BookingForm";
import type { Service } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("name");

  return (
    <main className="flex min-h-screen flex-col">
      <header className="bg-gradient-to-b from-slate-950 via-blue-950 to-blue-900 px-4 pb-16 pt-14 text-center text-white">
        <div className="mx-auto flex max-w-lg flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-800/60 text-2xl ring-1 ring-blue-400/40">
            🦆
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Lavadero El Pato</h1>
          <p className="mt-2 text-sm text-blue-200">
            Elegí el servicio, la fecha y el horario que más te convenga.
          </p>
        </div>
      </header>

      <div className="mx-auto -mt-10 w-full max-w-lg flex-1 px-4 pb-12">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-950/10">
          {!services || services.length === 0 ? (
            <p className="text-center text-gray-600">
              No hay servicios disponibles por el momento. Volvé a intentarlo más tarde.
            </p>
          ) : (
            <BookingForm services={services as Service[]} />
          )}
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          ¿Necesitás cancelar tu turno? Llamá al <strong className="text-blue-900">092 973 365</strong>.
        </p>
      </div>
    </main>
  );
}
