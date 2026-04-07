import Link from "next/link";

import { signOutAction } from "@/app/login/actions";

type AppShellProps = {
  children: React.ReactNode;
  userEmail?: string;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contacts", label: "Contacts" },
  { href: "/contacts/new", label: "Add Contact" },
];

export function AppShell({ children, userEmail }: AppShellProps) {
  return (
    <div className="min-h-screen pb-16">
      <div className="page-shell pt-8">
        <header className="surface rounded-[2rem] border border-[var(--border)] px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">NetworkOS</p>
              <h1
                className="mt-4 text-3xl font-semibold text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-newsreader)" }}
              >
                Keep relationship context close.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                Capture the people you meet, remember the details that matter,
                and make thoughtful follow-up easier.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="btn btn-secondary">
                  {item.label}
                </Link>
              ))}
              {userEmail ? (
                <form action={signOutAction}>
                  <button type="submit" className="btn btn-secondary">
                    Sign out
                  </button>
                </form>
              ) : null}
            </div>
          </div>

          {userEmail ? (
            <p className="mt-4 text-sm text-[var(--muted)]">Signed in as {userEmail}</p>
          ) : null}
        </header>
      </div>

      <main className="page-shell mt-8">{children}</main>
    </div>
  );
}
