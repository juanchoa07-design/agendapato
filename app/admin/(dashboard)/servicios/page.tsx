import { createClient } from "@/lib/supabase/server";
import ServicesManager from "@/components/ServicesManager";
import type { Service } from "@/lib/types";

export default async function ServiciosPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("created_at");

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-gray-900">Servicios</h1>
      <ServicesManager initialServices={(services ?? []) as Service[]} />
    </div>
  );
}
