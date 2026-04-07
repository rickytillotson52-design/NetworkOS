import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { FeedbackBanner } from "@/components/feedback-banner";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/data/dashboard";
import { formatDate, isPastDue } from "@/lib/utils";

type DashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await requireUser();
  const params = (await searchParams) ?? {};
  const dashboard = await getDashboardData(user.id);
  const message = typeof params.message === "string" ? params.message : null;

  return (
    <div className="grid gap-6">
      {message ? <FeedbackBanner message={message} /> : null}
      {dashboard.error ? (
        <FeedbackBanner message={dashboard.error} tone="error" />
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total contacts" value={String(dashboard.totalContacts)} />
        <StatCard
          label="Follow-ups due"
          value={String(dashboard.dueFollowUps.length)}
        />
        <StatCard
          label="Warm or active"
          value={String(dashboard.activeRelationships)}
        />
        <StatCard
          label="Strategic relationships"
          value={String(dashboard.strategicRelationships)}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Follow-Ups Due</p>
              <h2 className="mt-3 text-2xl font-semibold">
                Who needs your attention next?
              </h2>
            </div>
            <Link href="/contacts/new" className="btn btn-primary">
              Add contact
            </Link>
          </div>

          {dashboard.dueFollowUps.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No follow-ups due"
                description="When a contact gets a follow-up date, it will show up here so you can prepare before reaching out."
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              {dashboard.dueFollowUps.map((contact) => (
                <Link
                  key={contact.id}
                  href={`/contacts/${contact.id}`}
                  className="rounded-3xl border border-[var(--border)] bg-white/70 px-5 py-4 transition hover:-translate-y-0.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {contact.first_name} {contact.last_name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {contact.organization_name || "Independent"} ·{" "}
                        {contact.title || "No title recorded"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="status-pill">{contact.relationship_status}</span>
                      <p
                        className={`mt-2 text-sm font-medium ${
                          isPastDue(contact.next_follow_up_date)
                            ? "text-rose-700"
                            : "text-[var(--muted)]"
                        }`}
                      >
                        {formatDate(contact.next_follow_up_date)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <p className="eyebrow">Recent Contacts</p>
          <h2 className="mt-3 text-2xl font-semibold">
            Fresh context added recently
          </h2>

          {dashboard.recentContacts.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No contacts yet"
                description="Create your first contact to start building a usable relationship history."
                action={
                  <Link href="/contacts/new" className="btn btn-primary">
                    Create first contact
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              {dashboard.recentContacts.map((contact) => (
                <Link
                  key={contact.id}
                  href={`/contacts/${contact.id}`}
                  className="rounded-3xl border border-[var(--border)] bg-white/70 px-5 py-4 transition hover:-translate-y-0.5"
                >
                  <p className="font-semibold">
                    {contact.first_name} {contact.last_name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {contact.organization_name || "No organization"} ·{" "}
                    {contact.source || "Source not recorded"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="card p-6">
      <p className="eyebrow">{label}</p>
      <p className="mt-4 text-4xl font-semibold">{value}</p>
    </article>
  );
}
