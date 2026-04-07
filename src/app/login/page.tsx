import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { SetupCard } from "@/components/setup-card";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="page-shell py-10 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="surface rounded-[2rem] border border-[var(--border)] p-8 sm:p-10">
          <p className="eyebrow">Welcome Back</p>
          <h1
            className="mt-5 text-4xl font-semibold sm:text-5xl"
            style={{ fontFamily: "var(--font-newsreader)" }}
          >
            Step into the relationship workspace.
          </h1>
          <p className="mt-5 text-sm leading-8 text-[var(--muted)] sm:text-base">
            This CRM keeps conversation context, follow-up dates, and recent
            touchpoints in one place so your next outreach feels informed and
            personal.
          </p>
          <div className="mt-8 grid gap-4">
            {[
              "Magic-link sign-in for the smoothest onboarding path",
              "Password login still works for existing users",
              "Private records per signed-in user",
              "Dashboard views for due follow-ups and recent activity",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-[var(--border)] bg-white/60 px-4 py-3 text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <AuthForm />
          {!isSupabaseConfigured() ? <SetupCard /> : null}
        </div>
      </section>
    </main>
  );
}
