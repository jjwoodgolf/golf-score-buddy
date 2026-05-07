import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserRole, type Role } from "@/lib/auth";

export const Route = createFileRoute("/_authed")({
  component: AuthedLayout,
});

function AuthedLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/login" });
        return;
      }
      const r = await getCurrentUserRole();
      if (!active) return;
      setRole(r);
      setReady(true);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e: string, session: unknown) => {
      if (!session) navigate({ to: "/login" });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (!ready) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  // Path-based role gate
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  if (path.startsWith("/coach") && role !== "coach") {
    navigate({ to: "/dashboard" });
    return null;
  }
  if ((path === "/dashboard" || path.startsWith("/round")) && role !== "student") {
    navigate({ to: "/coach/dashboard" });
    return null;
  }

  return <Outlet />;
}
