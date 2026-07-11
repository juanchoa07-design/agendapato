export type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price: number | null;
  active: boolean;
  created_at: string;
};

export type AppointmentStatus = "confirmed" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service_id: string | null;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  created_at: string;
  services: Pick<Service, "id" | "name" | "price"> | null;
};
