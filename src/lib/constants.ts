export const relationshipStatuses = [
  "New",
  "Met Once",
  "Warm",
  "Active",
  "Strategic",
  "Dormant",
] as const;

export const interactionTypes = [
  "Intro",
  "Email",
  "Call",
  "Meeting",
  "Event",
  "Follow-Up",
  "Partnership Discussion",
] as const;

export type RelationshipStatus = (typeof relationshipStatuses)[number];
export type InteractionType = (typeof interactionTypes)[number];
