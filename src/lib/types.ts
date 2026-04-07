import type { InteractionType, RelationshipStatus } from "./constants";

export type Contact = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  organization_name: string | null;
  source: string | null;
  relationship_status: RelationshipStatus;
  general_notes: string | null;
  next_follow_up_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Interaction = {
  id: string;
  contact_id: string;
  user_id: string;
  interaction_type: InteractionType;
  interaction_date: string;
  summary: string;
  next_step: string | null;
  created_at: string;
};

export type ContactWithInteractions = Contact & {
  interactions: Interaction[];
};

export type FormState = {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};
