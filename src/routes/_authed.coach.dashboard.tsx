import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authed/coach/dashboard")({
  head: () => ({ meta: [{ title: "Coach Dashboard — FairwayIQ" }] }),
  component: CoachDashboard,
});

function CoachDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold">F</span>
          <span className="font-semibold">FairwayIQ</span>
        </div>
        <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
          Sign out
        </Button>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Coach Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your students and courses here.</p>
      </main>
    </div>
  );
}
