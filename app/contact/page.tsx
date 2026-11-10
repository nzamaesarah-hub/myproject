import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Kontak — Portfolio Nahza" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="font-display text-6xl font-extrabold"><span className="gradient-text">Kontak</span></h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-mist/60">Kirim pesan melalui formulir ini. Pesan akan tersimpan dan bisa dibaca di halaman Admin.</p>
      <ContactForm />
    </div>
  );
}
