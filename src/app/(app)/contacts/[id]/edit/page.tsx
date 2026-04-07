import { ContactForm } from "@/components/contact-form";
import { requireUser } from "@/lib/auth";
import { getContact } from "@/lib/data/contacts";

type EditContactPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditContactPage({ params }: EditContactPageProps) {
  const { id } = await params;
  const user = await requireUser();
  const { contact } = await getContact(user.id, id);

  return (
    <div className="grid gap-6">
      <section className="surface rounded-[2rem] border border-[var(--border)] p-8">
        <p className="eyebrow">Edit Contact</p>
        <h2
          className="mt-4 text-4xl font-semibold"
          style={{ fontFamily: "var(--font-newsreader)" }}
        >
          Update context without losing the thread.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Refine the details you know now so the next conversation starts from a better place.
        </p>
      </section>

      <ContactForm contact={contact} />
    </div>
  );
}
