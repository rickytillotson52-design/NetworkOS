type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-start gap-4 p-8">
      <p className="eyebrow">Empty State</p>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
