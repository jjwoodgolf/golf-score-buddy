import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type Role = "student" | "coach";

export const ensureDevUser = createServerFn({ method: "POST" })
  .inputValidator((input: { role: Role }) => {
    if (input.role !== "student" && input.role !== "coach") {
      throw new Error("Invalid role");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const { role } = data;
    const email = `dev-${role}@fairwayiq.com`;
    const password = "devpassword123";
    const fullName = `Dev ${role.charAt(0).toUpperCase() + role.slice(1)}`;

    // Find existing user by listing (paginate-safe enough for dev)
    let userId: string | null = null;
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) throw new Error(listErr.message);
    const existing = list.users.find((u) => u.email === email);

    if (existing) {
      userId = existing.id;
      // Ensure password is known and email is confirmed
      await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role },
      });
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role },
      });
      if (createErr) throw new Error(createErr.message);
      userId = created.user?.id ?? null;
    }

    if (!userId) throw new Error("Failed to provision dev user");

    // Upsert profile with the right role
    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .upsert(
        { id: userId, email, full_name: fullName, role },
        { onConflict: "id" },
      );
    if (profileErr) throw new Error(profileErr.message);

    return { email, password };
  });
