"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/types";
import { contactSchema, interactionSchema } from "@/lib/validation";

export async function saveContactAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase is not configured yet." };
  }

  const contactId = String(formData.get("contact_id") ?? "").trim();
  const parsed = contactSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    title: formData.get("title"),
    organization_name: formData.get("organization_name"),
    source: formData.get("source"),
    relationship_status: formData.get("relationship_status"),
    general_notes: formData.get("general_notes"),
    next_follow_up_date: formData.get("next_follow_up_date"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the form and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = {
    ...parsed.data,
    user_id: user.id,
  };

  if (contactId) {
    const { error } = await supabase
      .from("contacts")
      .update(payload)
      .eq("id", contactId)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/contacts");
    revalidatePath(`/contacts/${contactId}`);
    redirect(`/contacts/${contactId}?message=Contact%20updated`);
  }

  const { data, error } = await supabase
    .from("contacts")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Unable to create contact." };
  }

  revalidatePath("/contacts");
  revalidatePath("/dashboard");
  redirect(`/contacts/${data.id}?message=Contact%20created`);
}

export async function deleteContactAction(formData: FormData) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const contactId = String(formData.get("contact_id") ?? "");

  if (supabase && contactId) {
    await supabase
      .from("contacts")
      .delete()
      .eq("id", contactId)
      .eq("user_id", user.id);
  }

  revalidatePath("/contacts");
  revalidatePath("/dashboard");
  redirect("/contacts?message=Contact%20deleted");
}

export async function createInteractionAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase is not configured yet." };
  }

  const parsed = interactionSchema.safeParse({
    contact_id: formData.get("contact_id"),
    interaction_type: formData.get("interaction_type"),
    interaction_date: formData.get("interaction_date"),
    summary: formData.get("summary"),
    next_step: formData.get("next_step"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the interaction form and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { contact_id, ...data } = parsed.data;
  const { error } = await supabase.from("interactions").insert({
    ...data,
    contact_id,
    user_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/contacts/${contact_id}`);
  revalidatePath("/dashboard");
  redirect(`/contacts/${contact_id}?message=Interaction%20saved`);
}
