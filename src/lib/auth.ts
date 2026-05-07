import { supabase } from "@/integrations/supabase/client";

export type Role = "coach" | "student";

export async function getCurrentUserRole(): Promise<Role | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return (data?.role as Role) ?? null;
}

export function dashboardPathForRole(role: Role | null): string {
  if (role === "coach") return "/coach/dashboard";
  return "/dashboard";
}
