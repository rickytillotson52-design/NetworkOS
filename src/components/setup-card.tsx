export function SetupCard() {
  return (
    <section className="card p-8">
      <p className="eyebrow">Supabase Setup</p>
      <h2
        className="mt-4 text-3xl font-semibold"
        style={{ fontFamily: "var(--font-newsreader)" }}
      >
        Connect your project before using live CRM data.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to
        your local environment and Vercel project settings, then apply the SQL
        migration in `supabase/migrations` to create the CRM schema.
      </p>
      <div className="mt-6 rounded-3xl border border-[var(--border)] bg-white/70 p-5 text-sm text-[var(--muted)]">
        <p>Required next steps:</p>
        <p className="mt-3 font-mono text-xs text-[var(--foreground)]">
          1. Copy `.env.example` to `.env.local`
          <br />
          2. Add your Supabase project URL and anon key
          <br />
          3. Run the SQL migration in your Supabase project
        </p>
      </div>
    </section>
  );
}
