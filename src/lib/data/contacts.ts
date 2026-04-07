import type { PostgrestError } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Contact, ContactWithInteractions } from "@/lib/types";

type ContactFilters = {
  query?: string;
  relationshipStatus?: string;
};

export async function listContacts(
  userId: string,
  filters: ContactFilters = {},
): Promise<{ contacts: Contact[]; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { contacts: [], error: null };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { contacts: [], error: "Supabase is not configured yet." };
  }

  let query = supabase
    .from("contacts")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (filters.query) {
    query = query.or(
      `first_name.ilike.%${filters.query}%,last_name.ilike.%${filters.query}%,organization_name.ilike.%${filters.query}%`,
    );
  }

  if (filters.relationshipStatus) {
    query = query.eq("relationship_status", filters.relationshipStatus);
  }

  const { data, error } = await query;

  return { contacts: (data ?? []) as Contact[], error: toMessage(error) };
}

export async function getContact(
  userId: string,
  contactId: string,
): Promise<{ contact: ContactWithInteractions; error: string | null }> {
  if (!isSupabaseConfigured()) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    notFound();
  }

  const { data, error } = await supabase
    .from("contacts")
    .select("*, interactions(*)")
    .eq("user_id", userId)
    .eq("id", contactId)
    .order("interaction_date", {
      foreignTable: "interactions",
      ascending: false,
    })
    .single();

  if (error || !data) {
    notFound();
  }

  return { contact: data as ContactWithInteractions, error: null };
}

function toMessage(error: PostgrestError | null) {
  return error?.message ?? null;
}
