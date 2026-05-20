import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthLayout";
import { DevBypass } from "@/components/DevBypass";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dashboardPathForRole, getCurrentUserRole } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — FairwayIQ" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUserRole().then((role) => {
      if (role) navigate({ to: dashboardPathForRole(role) });
    });
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    const role = await getCurrentUserRole();
    navigate({ to: dashboardPathForRole(role) });
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your FairwayIQ account"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <DevBypass />
    </AuthLayout>
  );
}
