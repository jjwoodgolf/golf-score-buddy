import { supabase } from "@/integrations/supabase/client";
import { getMyRoleServer } from "@/lib/role.functions";

export type Role = "coach" | "student";

// Server-validated role lookup. Uses a TanStack server function so the role
// check cannot be tampered with by a malicious client.
export async function getCurrentUserRole(): Promise<Role | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  try {
    const { role } = await getMyRoleServer();
    return role;
  } catch {
    return null;
  }
}

export function dashboardPathForRole(role: Role | null): string {
  if (role === "coach") return "/coach/dashboard";
  return "/dashboard";
}
