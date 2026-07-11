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
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Lavadero — Agendá tu turno</h1>
        <p className="mt-1 text-sm text-gray-600">
          Elegí el servicio, la fecha y el horario que más te convenga.
        </p>
      </header>

      {!services || services.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay servicios disponibles por el momento. Volvé a intentarlo más tarde.
        </p>
      ) : (
        <BookingForm services={services as Service[]} />
      )}
    </main>
  );
}
