import Link from "next/link";
import { redirect } from "next/navigation";

import { SetupCard } from "@/components/setup-card";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const configured = isSupabaseConfigured();

  return (
    <main className="page-shell py-10 sm:py-16">
      <section className="surface rounded-[2rem] border border-[var(--border)] px-6 py-8 sm:px-10 sm:py-12">
        <p className="eyebrow">Networking CRM</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h1
              className="max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl"
              style={{ fontFamily: "var(--font-newsreader)" }}
            >
              Remember people well enough to follow up thoughtfully.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              NetworkOS is a calm CRM for people building real relationships.
              Store contact context, preserve interaction history, and keep the
              next step visible before a warm connection goes cold.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="btn btn-primary">
                Open the workspace
              </Link>
              <a href="#mvp" className="btn btn-secondary">
                See the core workflow
              </a>
            </div>
          </div>

          <div className="card p-6">
            <p className="eyebrow">MVP Focus</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
              <li>Capture who someone is and where you met them.</li>
              <li>Log each touchpoint so context stays easy to review.</li>
              <li>Track next follow-up dates and relationship status.</li>
              <li>Find the right person fast before you reach back out.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="mvp" className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Contacts",
            description:
              "Create, edit, review, and remove contacts with organization details, notes, and follow-up timing.",
          },
          {
            title: "Interaction history",
            description:
              "Add short interaction notes so every future conversation starts with context instead of guesswork.",
          },
          {
            title: "Search and dashboard",
            description:
              "Surface due follow-ups, recent contacts, and filters by name, company, or relationship status.",
          },
        ].map((item) => (
          <article key={item.title} className="card p-6">
            <p className="eyebrow">{item.title}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      {!configured ? (
        <div className="mt-8">
          <SetupCard />
        </div>
      ) : null}
    </main>
  );
}
