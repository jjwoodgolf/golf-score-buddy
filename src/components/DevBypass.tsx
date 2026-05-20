import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { dashboardPathForRole, getCurrentUserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function DevBypass() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  async function bypass(role: "student" | "coach") {
    const email = `dev-${role}@fairwayiq.com`;
    const password = "devpassword123";
    const fullName = `Dev ${role.charAt(0).toUpperCase() + role.slice(1)}`;

    setLoading(role);

    // Try sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    // If user doesn't exist, sign them up then sign in
    if (signInError?.message?.toLowerCase().includes("invalid login credentials")) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      });
      if (signUpError) {
        setLoading(null);
        return;
      }
      if (data.user) {
        await supabase
          .from("profiles")
          .upsert(
            { id: data.user.id, email, full_name: fullName, role },
            { onConflict: "id" },
          );
      }
      const { error: retryError } = await supabase.auth.signInWithPassword({ email, password });
      if (retryError) {
        setLoading(null);
        return;
      }
    } else if (signInError) {
      setLoading(null);
      return;
    }

    const currentRole = await getCurrentUserRole();
    navigate({ to: dashboardPathForRole(currentRole) });
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
    </div>
  );
}
