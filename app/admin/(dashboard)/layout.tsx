import Link from "next/link";
import { logout } from "@/app/admin/actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-900">Lavadero — Admin</span>
            <Link href="/admin/agenda" className="text-sm text-gray-600 hover:text-blue-600">
              Agenda
            </Link>
            <Link href="/admin/servicios" className="text-sm text-gray-600 hover:text-blue-600">
              Servicios
            </Link>
          </div>
          <form action={logout}>
            <button type="submit" className="text-sm text-gray-600 hover:text-red-600">
              Cerrar sesión
            </button>
          </form>
        </div>
      </nav>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
