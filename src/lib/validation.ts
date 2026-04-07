import { z } from "zod";

import { interactionTypes, relationshipStatuses } from "@/lib/constants";

export const authSchema = z.object({
  mode: z.enum(["login", "signup"]),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters long."),
});

export const contactSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required."),
  last_name: z.string().trim().min(1, "Last name is required."),
  email: z
    .union([z.email("Enter a valid email address."), z.literal("")])
    .transform((value) => value || null),
  phone: z.string().trim().max(50).optional().transform(blankToNull),
  title: z.string().trim().max(120).optional().transform(blankToNull),
  organization_name: z
    .string()
    .trim()
    .max(160)
    .optional()
    .transform(blankToNull),
  source: z.string().trim().max(160).optional().transform(blankToNull),
  relationship_status: z.enum(relationshipStatuses),
  general_notes: z.string().trim().max(3000).optional().transform(blankToNull),
  next_follow_up_date: z
    .string()
    .optional()
    .transform((value) => value?.trim() || null),
});

export const interactionSchema = z.object({
  contact_id: z.string().uuid("Contact id is invalid."),
  interaction_type: z.enum(interactionTypes),
  interaction_date: z.string().min(1, "Choose an interaction date."),
  summary: z.string().trim().min(1, "Summary is required.").max(2000),
  next_step: z.string().trim().max(1000).optional().transform(blankToNull),
});

function blankToNull(value?: string) {
  return value?.trim() ? value.trim() : null;
}
