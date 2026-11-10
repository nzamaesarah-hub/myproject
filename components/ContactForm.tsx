"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setStatus("");
    const form = new FormData(formElement);
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), text: form.get("text") }) });
    const result = await response.json();
    setStatus(response.ok ? "Pesan tersimpan. Terima kasih sudah menghubungi saya!" : result.error ?? "Pesan belum berhasil disimpan.");
    if (response.ok) formElement.reset();
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="panel-card mt-8 grid gap-4 p-6">
      <label className="grid gap-2 text-sm">Nama<input name="name" required minLength={2} maxLength={100} className="rounded-xl border border-sky/20 bg-white px-4 py-3" /></label>
      <label className="grid gap-2 text-sm">Email<input name="email" type="email" required className="rounded-xl border border-sky/20 bg-white px-4 py-3" /></label>
      <label className="grid gap-2 text-sm">Pesan<textarea name="text" required minLength={5} maxLength={2000} rows={4} className="rounded-xl border border-sky/20 bg-white px-4 py-3" /></label>
      <button disabled={busy} className="justify-self-start rounded-full bg-sky px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Mengirim…" : "Kirim pesan"}</button>
      {status && <p role="status" className="text-sm text-mist/70">{status}</p>}
    </form>
  );
}
