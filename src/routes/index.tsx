import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { dashboardPathForRole, getCurrentUserRole } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    getCurrentUserRole().then((role) => {
      navigate({ to: role ? dashboardPathForRole(role) : "/login" });
    });
  }, [navigate]);
  return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
}
