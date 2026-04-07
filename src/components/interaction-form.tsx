"use client";

import { useActionState } from "react";

import { createInteractionAction } from "@/app/(app)/contacts/actions";
import { SubmitButton } from "@/components/submit-button";
import { interactionTypes } from "@/lib/constants";
import type { FormState } from "@/lib/types";

const initialState: FormState = {};

type InteractionFormProps = {
  contactId: string;
};

export function InteractionForm({ contactId }: InteractionFormProps) {
  const [state, formAction] = useActionState(createInteractionAction, initialState);

  return (
    <form action={formAction} className="card p-8">
      <input type="hidden" name="contact_id" value={contactId} />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Interaction type
          <select name="interaction_type" className="field" defaultValue={interactionTypes[0]}>
            {interactionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Date
          <input
            className="field"
            type="date"
            name="interaction_date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
          />
        </label>
      </div>

      <label className="mt-5 grid gap-2 text-sm font-medium">
        Summary
        <textarea
          name="summary"
          className="field min-h-32"
          placeholder="What did you talk about? What context matters next time?"
          required
        />
      </label>

      <label className="mt-5 grid gap-2 text-sm font-medium">
        Next step
        <textarea
          name="next_step"
          className="field min-h-24"
          placeholder="Optional: a concrete follow-up idea or commitment."
        />
      </label>

      {state.error ? (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm leading-7 text-[var(--muted)]">
          A short note is enough. The goal is preserving useful context, not writing a transcript.
        </p>
        <SubmitButton pendingLabel="Saving interaction...">Log interaction</SubmitButton>
      </div>
    </form>
  );
}
