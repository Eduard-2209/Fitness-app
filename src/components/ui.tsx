import { cn } from "@/lib/cn";

/* Wiederverwendbare UI-Bausteine im Stil der Design-Richtung (docs/decisions.md). */

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-stein-200 bg-stein-50 shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  titel,
  beschreibung,
  aktion,
}: {
  titel: string;
  beschreibung?: string;
  aktion?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-tinte-900 sm:text-4xl">
          {titel}
        </h1>
        {beschreibung ? (
          <p className="mt-2 max-w-2xl text-tinte-500">{beschreibung}</p>
        ) : null}
      </div>
      {aktion}
    </div>
  );
}

type BadgeFarbe = "aktiv" | "pausiert" | "geplant" | "neutral";

const badgeStile: Record<BadgeFarbe, string> = {
  aktiv: "bg-aktiv-50 text-aktiv-700 ring-aktiv-500/25",
  pausiert: "bg-stein-200 text-tinte-700 ring-tinte-300/40",
  geplant: "bg-akzent-50 text-akzent-700 ring-akzent-500/30",
  neutral: "bg-akzent-50 text-akzent-700 ring-akzent-500/25",
};

export function Badge({
  farbe = "neutral",
  children,
}: {
  farbe?: BadgeFarbe;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        badgeStile[farbe],
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const stile = {
    primary:
      "bg-akzent-500 text-white hover:bg-akzent-600 focus-visible:outline-akzent-600",
    secondary:
      "bg-stein-200 text-tinte-900 hover:bg-stein-300 focus-visible:outline-tinte-500",
    ghost:
      "bg-transparent text-tinte-700 hover:bg-stein-200 focus-visible:outline-tinte-500",
  } as const;
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        stile[variant],
        className,
      )}
      {...props}
    />
  );
}

export function LeererZustand({
  titel,
  beschreibung,
  aktion,
  icon,
}: {
  titel: string;
  beschreibung: string;
  aktion?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-stein-300 bg-stein-50/60 px-6 py-16 text-center">
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-akzent-50 text-akzent-600">
          {icon}
        </div>
      ) : null}
      <h2 className="text-lg font-semibold text-tinte-900">{titel}</h2>
      <p className="max-w-md text-sm text-tinte-500">{beschreibung}</p>
      {aktion ? <div className="mt-2">{aktion}</div> : null}
    </div>
  );
}
