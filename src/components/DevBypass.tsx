import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { dashboardPathForRole, getCurrentUserRole } from "@/lib/auth";
import { ensureDevUser } from "@/lib/dev-bypass.functions";
import { Button } from "@/components/ui/button";

export function DevBypass() {
  const navigate = useNavigate();
  const ensure = useServerFn(ensureDevUser);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function bypass(role: "student" | "coach") {
    setLoading(role);
    setError(null);
    try {
      const { email, password } = await ensure({ data: { role } });
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      const currentRole = (await getCurrentUserRole()) ?? role;
      navigate({ to: dashboardPathForRole(currentRole) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dev login failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <p className="text-xs text-muted-foreground text-center mb-3">Dev bypass</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => bypass("student")}
          disabled={!!loading}
        >
          {loading === "student" ? "Signing in…" : "Student"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => bypass("coach")}
          disabled={!!loading}
        >
          {loading === "coach" ? "Signing in…" : "Coach"}
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive text-center">{error}</p>}
    </div>
  );
}
