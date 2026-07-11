import Image from "next/image";
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
      <header className="bg-gradient-to-b from-slate-950 via-blue-950 to-blue-900 px-4 pb-14 pt-8 text-center text-white">
        <h1 className="sr-only">Lavadero El Pato</h1>
        <div className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl shadow-xl shadow-blue-950/30 sm:max-w-sm">
          <Image
            src="/lavadero-el-pato-hero.png"
            alt="Lavadero El Pato — pato de goma sobre un auto cubierto de espuma"
            width={1080}
            height={1350}
            priority
            className="h-auto w-full"
          />
        </div>
        <p className="mx-auto mt-4 max-w-lg text-sm text-blue-200">
          Elegí el servicio, la fecha y el horario que más te convenga.
        </p>
      </header>

      <div className="mx-auto -mt-8 w-full max-w-lg flex-1 px-4 pb-12">
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
