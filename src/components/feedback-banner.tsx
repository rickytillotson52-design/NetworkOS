import { cn } from "@/lib/utils";

type FeedbackBannerProps = {
  message: string;
  tone?: "success" | "error";
};

export function FeedbackBanner({
  message,
  tone = "success",
}: FeedbackBannerProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border px-4 py-3 text-sm font-medium",
        tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-800",
      )}
    >
      {message}
    </div>
  );
}
