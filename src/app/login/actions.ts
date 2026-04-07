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

  if (!supabase) {
    return {
      error:
        "Supabase is not configured yet. Add your environment variables before signing in.",
    };
  }

  const parsed = authSchema.safeParse({
    mode: formData.get("mode"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the form and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { mode, email, password } = parsed.data;

  if (mode === "signup") {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getAppUrl()}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {
      success:
        "Account created. If your project requires email confirmation, check your inbox before logging in.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

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
