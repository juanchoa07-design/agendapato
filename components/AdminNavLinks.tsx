"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/servicios", label: "Servicios" },
];

export default function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {LINKS.map((link) => {
        const active = pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-900/60 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
