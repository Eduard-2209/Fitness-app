import { Suspense } from "react";
import Link from "next/link";
import { NavLinks } from "@/components/nav-links";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-stein-200/80 bg-stein-100/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-8 px-6">
          <Link href="/mitglieder" className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold tracking-tight text-tinte-900">
              FitZone
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-tinte-500">
              Berlin
            </span>
          </Link>

          <Suspense fallback={<div className="h-9 w-32" aria-hidden />}>
            <NavLinks />
          </Suspense>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
