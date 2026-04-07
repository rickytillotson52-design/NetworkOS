import { ContactForm } from "@/components/contact-form";

export default function NewContactPage() {
  return (
    <div className="grid gap-6">
      <section className="surface rounded-[2rem] border border-[var(--border)] p-8">
        <p className="eyebrow">New Contact</p>
        <h2
          className="mt-4 text-4xl font-semibold"
          style={{ fontFamily: "var(--font-newsreader)" }}
        >
          Capture the essentials while the conversation is still fresh.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Keep this quick: who they are, where you met, what matters, and when
          you want to follow up.
        </p>
      </section>

      <ContactForm />
    </div>
  );
}
