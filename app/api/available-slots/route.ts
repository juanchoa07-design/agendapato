import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_booked_times", {
    p_date: date,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const bookedTimes = (data ?? []).map(
    (row: { appointment_time: string }) => row.appointment_time,
  );

  return NextResponse.json({
    slots: getAvailableSlots(date, bookedTimes),
  });
}
