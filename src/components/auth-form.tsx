"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { authAction } from "@/app/login/actions";
import { SubmitButton } from "@/components/submit-button";
import type { FormState } from "@/lib/types";

const initialState: FormState = {};

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "magic">("magic");
  const [state, formAction] = useActionState(authAction, initialState);

  return (
    <form action={formAction} className="card w-full max-w-xl p-8 sm:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={`btn ${mode === "magic" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setMode("magic")}
        >
          Magic link
        </button>
        <button
          type="button"
          className={`btn ${mode === "login" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setMode("login")}
        >
          Password login
        </button>
      </div>

      <input type="hidden" name="mode" value={mode} />

      <div className="mt-8 grid gap-4">
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input
            className="field"
            type="email"
            name="email"
            placeholder="you@company.com"
            required
          />
        </label>
        {state.fieldErrors?.email ? (
          <p className="text-sm text-rose-700">{state.fieldErrors.email[0]}</p>
        ) : null}

        {mode === "login" ? (
          <>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input
                className="field"
                type="password"
                name="password"
                placeholder="At least 8 characters"
                required
              />
            </label>
            {state.fieldErrors?.password ? (
              <p className="text-sm text-rose-700">
                {state.fieldErrors.password[0]}
              </p>
            ) : null}
          </>
        ) : null}
      </div>

      {state.error ? (
        <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.success}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
          {mode === "login"
            ? "Use your existing password if you have already signed in before."
            : "New or returning users can use a one-click magic link without worrying about email confirmation landing pages."}
        </p>
        <SubmitButton pendingLabel={mode === "login" ? "Logging in..." : "Sending link..."}>
          {mode === "login" ? "Continue" : "Email me a link"}
        </SubmitButton>
      </div>

      <p className="mt-6 text-sm text-[var(--muted)]">
        Need a quick look around first? <Link href="/">Return to the overview</Link>.
      </p>
    </form>
  );
}
