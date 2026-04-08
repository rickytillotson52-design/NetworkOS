"use server";

import { redirect } from "next/navigation";

import { getAppUrl } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/types";
import { authSchema } from "@/lib/validation";

export async function authAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  const passwordValue = formData.get("password");

  if (!supabase) {
    return {
      error:
        "Supabase is not configured yet. Add your environment variables before signing in.",
    };
  }

  const parsed = authSchema.safeParse({
    mode: formData.get("mode"),
    email: formData.get("email"),
    password: typeof passwordValue === "string" ? passwordValue : undefined,
  });

  if (!parsed.success) {
    return {
      error: "Please fix the form and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { mode, email, password } = parsed.data;

  if (mode === "magic") {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${getAppUrl()}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {
      success:
        "Magic link sent. Open the email on the same device and you will be signed in automatically.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: password!,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
