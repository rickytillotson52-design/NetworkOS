# NetworkOS

NetworkOS is a networking and partnership CRM built with Next.js, Supabase, GitHub, and Vercel. The MVP helps a solo operator capture people they meet, preserve conversation context, log interactions over time, and keep follow-up commitments visible.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth + Postgres
- Vercel-ready deployment

## MVP Capabilities

- Email/password sign up and log in with Supabase Auth
- Protected dashboard
- Contact create, list, detail, edit, and delete flows
- Interaction logging on each contact
- Search by name or organization
- Filter by relationship status
- Due follow-ups and recent contacts on the dashboard

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment variables:

```bash
copy .env.example .env.local
```

3. Add these values to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Apply the SQL migration in `supabase/migrations/20260406213000_initial_crm_schema.sql` to your Supabase project.

5. Start the dev server:

```bash
npm run dev
```

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Deployment Notes

- Add the same environment variables to Vercel.
- Connect the GitHub repository to Vercel for preview and production deployments.
- Keep Supabase anon keys client-safe and never expose service-role credentials in the browser.
