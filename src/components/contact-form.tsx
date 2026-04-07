"use client";

import { useActionState } from "react";

import { saveContactAction } from "@/app/(app)/contacts/actions";
import { SubmitButton } from "@/components/submit-button";
import { relationshipStatuses } from "@/lib/constants";
import type { Contact, FormState } from "@/lib/types";

const initialState: FormState = {};

type ContactFormProps = {
  contact?: Contact;
};

export function ContactForm({ contact }: ContactFormProps) {
  const [state, formAction] = useActionState(saveContactAction, initialState);

  return (
    <form action={formAction} className="card p-8">
      <input type="hidden" name="contact_id" value={contact?.id ?? ""} />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="First name" name="first_name" defaultValue={contact?.first_name} required />
        <Field label="Last name" name="last_name" defaultValue={contact?.last_name} required />
        <Field label="Email" name="email" type="email" defaultValue={contact?.email ?? ""} />
        <Field label="Phone" name="phone" defaultValue={contact?.phone ?? ""} />
        <Field label="Title" name="title" defaultValue={contact?.title ?? ""} />
        <Field
          label="Organization"
          name="organization_name"
          defaultValue={contact?.organization_name ?? ""}
        />
        <Field label="Source" name="source" defaultValue={contact?.source ?? ""} />

        <label className="grid gap-2 text-sm font-medium">
          Relationship status
          <select
            name="relationship_status"
            className="field"
            defaultValue={contact?.relationship_status ?? relationshipStatuses[0]}
          >
            {relationshipStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <Field
          label="Next follow-up date"
          name="next_follow_up_date"
          type="date"
          defaultValue={contact?.next_follow_up_date ?? ""}
        />
      </div>

      <label className="mt-5 grid gap-2 text-sm font-medium">
        Notes
        <textarea
          name="general_notes"
          defaultValue={contact?.general_notes ?? ""}
          className="field min-h-40"
          placeholder="Where you met, what stood out, and what would be helpful to remember later."
        />
      </label>

      {state.error ? (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      {state.fieldErrors ? (
        <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Please review the highlighted fields and try again.
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
          Keep this lightweight. A little context now makes the next outreach much easier later.
        </p>
        <SubmitButton pendingLabel={contact ? "Updating..." : "Creating..."}>
          {contact ? "Save changes" : "Create contact"}
        </SubmitButton>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        className="field"
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
      />
    </label>
  );
}
