import { logout } from "@/app/admin/actions";
import AdminNavLinks from "@/components/AdminNavLinks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-blue-950 px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 font-bold text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-800/60 text-sm ring-1 ring-blue-400/40">
                🦆
              </span>
              Lavadero El Pato
            </span>
            <AdminNavLinks />
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-100 hover:bg-blue-900/60 hover:text-white"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </nav>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
