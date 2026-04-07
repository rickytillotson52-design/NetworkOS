import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { FeedbackBanner } from "@/components/feedback-banner";
import { relationshipStatuses } from "@/lib/constants";
import { requireUser } from "@/lib/auth";
import { listContacts } from "@/lib/data/contacts";
import { formatDate } from "@/lib/utils";

type ContactsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const user = await requireUser();
  const params = (await searchParams) ?? {};
  const query = typeof params.q === "string" ? params.q : "";
  const status = typeof params.status === "string" ? params.status : "";
  const message = typeof params.message === "string" ? params.message : null;

  const { contacts, error } = await listContacts(user.id, {
    query,
    relationshipStatus: status,
  });

  return (
    <div className="grid gap-6">
      {message ? <FeedbackBanner message={message} /> : null}
      {error ? <FeedbackBanner message={error} tone="error" /> : null}

      <section className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Contacts</p>
            <h2 className="mt-3 text-3xl font-semibold">Relationship directory</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Search by person, organization, or relationship stage before you reach out.
            </p>
          </div>
          <Link href="/contacts/new" className="btn btn-primary">
            Add contact
          </Link>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-[1fr_220px_auto]">
          <input
            className="field"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by person or organization"
          />
          <select className="field" name="status" defaultValue={status}>
            <option value="">All statuses</option>
            {relationshipStatuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <button className="btn btn-secondary" type="submit">
            Apply filters
          </button>
        </form>
      </section>

      {contacts.length === 0 ? (
        <EmptyState
          title="No contacts match that search"
          description="Try a broader search, clear the status filter, or add your first contact."
          action={
            <Link href="/contacts/new" className="btn btn-primary">
              Create contact
            </Link>
          }
        />
      ) : (
        <section className="grid gap-4">
          {contacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/contacts/${contact.id}`}
              className="card p-6 transition hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    <span className="status-pill">{contact.relationship_status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {contact.title || "No title"} ·{" "}
                    {contact.organization_name || "No organization"}
                  </p>
                  <p className="mt-1 text-sm leading-7 text-[var(--muted)]">
                    Source: {contact.source || "Not recorded"}
                  </p>
                </div>

                <div className="text-left lg:text-right">
                  <p className="text-sm font-medium">Next follow-up</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {formatDate(contact.next_follow_up_date)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
