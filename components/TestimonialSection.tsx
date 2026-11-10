"use client";

import { useState } from "react";

type Testimonial = { id: number; name: string; role: string; text: string };

export default function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setStatus("");
    const form = new FormData(formElement);
    const response = await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), role: form.get("role"), text: form.get("text") }) });
    const result = await response.json();
    setStatus(result.message ?? result.error ?? "Testimoni belum berhasil dikirim.");
    if (response.ok) formElement.reset();
    setBusy(false);
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h1 className="font-display text-6xl font-extrabold"><span className="gradient-text">Testimoni</span></h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-mist/60">Pendapat dari orang yang pernah bekerja sama. Testimoni baru akan tampil setelah disetujui admin.</p>
      {testimonials.length ? <div className="mt-10 grid gap-5 md:grid-cols-2">{testimonials.map((item) => <blockquote key={item.id} className="panel-card p-6"><p className="leading-7 text-mist/80">“{item.text}”</p><footer className="mt-5 text-sm"><strong>{item.name}</strong>{item.role && <span className="text-mist/50"> · {item.role}</span>}</footer></blockquote>)}</div> : <p className="panel-card mt-10 p-6 text-sm text-mist/60">Belum ada testimoni yang disetujui.</p>}
      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-2xl font-bold">Kirim testimoni</h2>
        <form onSubmit={submit} className="panel-card mt-5 grid gap-4 p-6">
          <label className="grid gap-2 text-sm">Nama<input name="name" required minLength={2} maxLength={100} className="rounded-xl border border-sky/20 bg-white px-4 py-3" /></label>
          <label className="grid gap-2 text-sm">Peran / hubungan (opsional)<input name="role" maxLength={100} placeholder="Contoh: Pembimbing proyek" className="rounded-xl border border-sky/20 bg-white px-4 py-3" /></label>
          <label className="grid gap-2 text-sm">Testimoni<textarea name="text" required minLength={5} maxLength={1000} rows={4} className="rounded-xl border border-sky/20 bg-white px-4 py-3" /></label>
          <button disabled={busy} className="justify-self-start rounded-full bg-sky px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Mengirim…" : "Kirim untuk ditinjau"}</button>
          {status && <p role="status" className="text-sm text-mist/70">{status}</p>}
        </form>
      </section>
    </div>
  );
}
