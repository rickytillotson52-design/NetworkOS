import Link from "next/link";

import { deleteContactAction } from "@/app/(app)/contacts/actions";
import { FeedbackBanner } from "@/components/feedback-banner";
import { InteractionForm } from "@/components/interaction-form";
import { requireUser } from "@/lib/auth";
import { getContact } from "@/lib/data/contacts";
import { formatDate } from "@/lib/utils";

type ContactDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactDetailPage({
  params,
  searchParams,
}: ContactDetailPageProps) {
  const { id } = await params;
  const user = await requireUser();
  const state = (await searchParams) ?? {};
  const message = typeof state.message === "string" ? state.message : null;
  const { contact } = await getContact(user.id, id);

  return (
    <div className="grid gap-6">
      {message ? <FeedbackBanner message={message} /> : null}

      <section className="surface rounded-[2rem] border border-[var(--border)] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow">Contact Detail</p>
              <span className="status-pill">{contact.relationship_status}</span>
            </div>
            <h1
              className="mt-4 text-4xl font-semibold"
              style={{ fontFamily: "var(--font-newsreader)" }}
            >
              {contact.first_name} {contact.last_name}
            </h1>
            <p className="mt-3 text-base text-[var(--muted)]">
              {contact.title || "No title"} · {contact.organization_name || "No organization"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/contacts/${contact.id}/edit`} className="btn btn-primary">
              Edit contact
            </Link>
            <form action={deleteContactAction}>
              <input type="hidden" name="contact_id" value={contact.id} />
              <button type="submit" className="btn btn-danger">
                Delete
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailCard label="Email" value={contact.email || "Not recorded"} />
          <DetailCard label="Phone" value={contact.phone || "Not recorded"} />
          <DetailCard label="Source" value={contact.source || "Not recorded"} />
          <DetailCard
            label="Next follow-up"
            value={formatDate(contact.next_follow_up_date)}
          />
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Relationship notes
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-8 text-[var(--foreground)]">
            {contact.general_notes || "No notes yet."}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card p-6">
          <p className="eyebrow">Interaction History</p>
          <h2 className="mt-3 text-2xl font-semibold">
            Review past conversations quickly
          </h2>

          {contact.interactions.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-[var(--border)] bg-white/60 p-6 text-sm leading-7 text-[var(--muted)]">
              No interactions logged yet. Add the first touchpoint to preserve
              what you discussed and what should happen next.
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {contact.interactions.map((interaction) => (
                <article
                  key={interaction.id}
                  className="rounded-3xl border border-[var(--border)] bg-white/70 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="status-pill">{interaction.interaction_type}</span>
                    <p className="text-sm text-[var(--muted)]">
                      {formatDate(interaction.interaction_date)}
                    </p>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">
                    {interaction.summary}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                    Next step: {interaction.next_step || "No next step captured."}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <InteractionForm contactId={contact.id} />
          <div className="card p-6">
            <p className="eyebrow">Outreach Prep</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Before you reach out again, scan the latest interaction summary,
              confirm the next step, and check whether there is a follow-up date
              you already committed to.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.5rem] border border-[var(--border)] bg-white/72 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-3 text-sm leading-7">{value}</p>
    </article>
  );
}
