"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users } from "lucide-react";
import { cn } from "@/lib/cn";

const navigation = [{ href: "/mitglieder", label: "Mitglieder", icon: Users }];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {navigation.map((eintrag) => {
        const aktiv =
          pathname === eintrag.href ||
          pathname.startsWith(`${eintrag.href}/`);
        const Icon = eintrag.icon;
        return (
          <Link
            key={eintrag.href}
            href={eintrag.href}
            aria-current={aktiv ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              aktiv
                ? "bg-akzent-500 text-white"
                : "text-tinte-700 hover:bg-stein-200",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {eintrag.label}
          </Link>
        );
      })}
    </nav>
  );
}
