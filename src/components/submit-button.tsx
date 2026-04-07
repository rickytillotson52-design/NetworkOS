"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  className,
  pendingLabel = "Saving...",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={cn("btn btn-primary", className)}
      disabled={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
