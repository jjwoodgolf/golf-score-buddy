import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-5 border-b border-border">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold">
            F
          </span>
          <span className="font-semibold tracking-tight text-lg">FairwayIQ</span>
        </Link>
      </header>
      <main className="flex-1 grid place-items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
