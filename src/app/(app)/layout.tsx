import { AppShell } from "@/components/app-shell";
import { SetupCard } from "@/components/setup-card";
import { requireUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return (
      <AppShell>
        <SetupCard />
      </AppShell>
    );
  }

  const user = await requireUser();

  return <AppShell userEmail={user.email}>{children}</AppShell>;
}
