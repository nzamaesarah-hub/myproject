"use client";

import { useCallback, useEffect, useState } from "react";

type Item = Record<string, string | number>;
type AdminData = { projects: Item[]; certificates: Item[]; skills: Item[]; testimonials: Item[]; messages: Item[]; comments: Item[] };
type Tab = "projects" | "certificates" | "skills" | "testimonials" | "messages" | "comments";
const emptyData: AdminData = { projects: [], certificates: [], skills: [], testimonials: [], messages: [], comments: [] };

export default function AdminPanel() {
  const [data, setData] = useState<AdminData>(emptyData);
  const [tab, setTab] = useState<Tab>("projects");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/admin/data", { cache: "no-store" });
    if (response.ok) {
      setData(await response.json());
      setLoggedIn(true);
    } else setLoggedIn(false);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Login gagal.");
    else { setPassword(""); await refresh(); }
    setBusy(false);
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const upload = form.get("imageUpload");
    let uploadedImage = "";
    if ((tab === "projects" || tab === "certificates") && upload instanceof File && upload.size > 0) {
      const uploadData = new FormData();
      uploadData.append("file", upload);
      const uploadResponse = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        setError(uploadResult.error ?? "Gambar gagal diunggah.");
        setBusy(false);
        return;
      }
      uploadedImage = uploadResult.path;
    }
    const body: Record<string, string | number | boolean> = {};
    for (const [key, value] of form.entries()) {
      if (key !== "imageUpload") body[key] = String(value).trim();
    }
    if (uploadedImage) body.image = uploadedImage;
    if (editing?.id) body.id = Number(editing.id);
    if (tab === "testimonials") body.approved = Boolean(editing?.approved);
    const response = await fetch(`/api/admin/${tab}`, { method: editing?.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Data gagal disimpan.");
    else { setEditing(null); setMessage("Perubahan berhasil disimpan ke database."); await refresh(); }
    setBusy(false);
  }

  async function remove(collection: Tab, id: number) {
    if (!window.confirm("Hapus data ini?")) return;
    const response = await fetch(`/api/admin/${collection}?id=${id}`, { method: "DELETE" });
    if (response.ok) { setMessage("Data dihapus."); await refresh(); }
    else setError("Data gagal dihapus.");
  }

  async function approval(item: Item, approved: boolean) {
    const response = await fetch("/api/admin/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, approved }) });
    if (response.ok) { setMessage(approved ? "Testimoni disetujui dan tampil di situs." : "Testimoni disembunyikan."); await refresh(); }
    else setError("Status testimoni gagal diperbarui.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false); setData(emptyData); setEditing(null);
  }

  if (!loggedIn) return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <div className="panel-card p-8">
        <h1 className="font-display text-4xl font-bold">Admin <span className="gradient-text">Portfolio</span></h1>
        <p className="mt-3 text-sm text-mist/60">Masuk untuk mengelola proyek, sertifikat, testimoni, dan pesan.</p>
        <form onSubmit={login} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">Kata sandi admin<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-sky/20 bg-white px-4 py-3" /></label>
          <button disabled={busy} className="rounded-full bg-sky px-6 py-3 font-semibold text-white disabled:opacity-60">{busy ? "Memeriksa…" : "Masuk"}</button>
        </form>
        {error && <p role="alert" className="mt-4 text-sm text-rose-600">{error}</p>}
      </div>
    </div>
  );

  const fields: Record<Exclude<Tab, "messages" | "comments">, { key: string; label: string; required?: boolean; multiline?: boolean }[]> = {
    projects: [
      { key: "title", label: "Nama proyek", required: true }, { key: "category", label: "Kategori", required: true }, { key: "year", label: "Tahun", required: true },
      { key: "image", label: "Path gambar (contoh: /nama-gambar.jpg)" }, { key: "description", label: "Deskripsi", multiline: true },
    ],
    certificates: [
      { key: "title", label: "Nama sertifikat", required: true }, { key: "issuer", label: "Penerbit", required: true }, { key: "year", label: "Tahun", required: true },
      { key: "image", label: "Path gambar (opsional)" }, { key: "url", label: "Tautan sertifikat (opsional)" },
    ],
    skills: [{ key: "title", label: "Nama keterampilan", required: true }, { key: "description", label: "Deskripsi", multiline: true }],
    testimonials: [
      { key: "name", label: "Nama", required: true }, { key: "role", label: "Peran / hubungan" }, { key: "text", label: "Isi testimoni", required: true, multiline: true },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-widest text-sky">Area terbatas</p><h1 className="mt-2 font-display text-5xl font-extrabold">Admin <span className="gradient-text">Portfolio</span></h1></div>
        <button onClick={logout} className="rounded-full border border-sky/20 px-5 py-2 text-sm">Keluar</button>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">{(["projects", "certificates", "skills", "testimonials", "comments", "messages"] as Tab[]).map((key) => <button key={key} onClick={() => { setTab(key); setEditing(null); }} className={`rounded-full px-4 py-2 text-sm ${tab === key ? "bg-sky text-white" : "bg-panel text-mist/70"}`}>{({ projects: "Proyek", certificates: "Sertifikat", skills: "Keterampilan", testimonials: "Testimoni", messages: "Pesan masuk", comments: "Komentar proyek" })[key]} ({data[key].length})</button>)}</div>
      {message && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}

      {tab !== "messages" && tab !== "comments" && <form key={`${tab}-${editing?.id ?? "new"}`} onSubmit={save} className="panel-card mt-6 grid gap-4 p-6 md:grid-cols-2">
        <h2 className="font-display text-xl font-bold md:col-span-2">{editing?.id ? "Ubah data" : `Tambah ${{ projects: "proyek", certificates: "sertifikat", skills: "keterampilan", testimonials: "testimoni" }[tab]}`}</h2>
        {fields[tab].map((field) => field.key === "image" ? (
          <div key={field.key} className="grid gap-3 text-sm">
            <label className="grid gap-2">{field.label}<input name="image" defaultValue={String(editing?.image ?? "")} placeholder="Atau pilih file di bawah" className="rounded-xl border border-sky/20 bg-white px-4 py-3" /></label>
            <label className="grid gap-2">Unggah gambar<input name="imageUpload" type="file" accept="image/jpeg,image/png,image/webp" className="rounded-xl border border-sky/20 bg-white px-4 py-3 file:mr-3 file:rounded-full file:border-0 file:bg-sky/10 file:px-3 file:py-2" /><span className="text-xs text-mist/50">JPG, PNG, atau WEBP · maksimal 5 MB</span></label>
          </div>
        ) : <label key={field.key} className={`grid gap-2 text-sm ${field.multiline ? "md:col-span-2" : ""}`}>{field.label}{field.multiline ? <textarea name={field.key} required={field.required} defaultValue={String(editing?.[field.key] ?? "")} rows={3} className="rounded-xl border border-sky/20 bg-white px-4 py-3" /> : <input name={field.key} required={field.required} defaultValue={String(editing?.[field.key] ?? "")} className="rounded-xl border border-sky/20 bg-white px-4 py-3" />}</label>)}
        <div className="flex gap-2 md:col-span-2"><button disabled={busy} className="rounded-full bg-sky px-6 py-3 text-sm font-semibold text-white">{busy ? "Menyimpan…" : "Simpan ke database"}</button>{editing && <button type="button" onClick={() => setEditing(null)} className="rounded-full border px-6 py-3 text-sm">Batal</button>}</div>
      </form>}

      <div className="mt-6 grid gap-4">
        {data[tab].length === 0 && <p className="panel-card p-6 text-sm text-mist/60">Belum ada data pada bagian ini.</p>}
        {data[tab].map((item) => <article key={item.id} className="panel-card flex flex-wrap items-start justify-between gap-4 p-5">
          <div className="min-w-0 flex-1">{(tab === "projects" || tab === "certificates") && item.image && <img src={String(item.image)} alt="" className="mb-3 h-24 w-36 rounded-lg border border-sky/10 object-cover" />}<h3 className="font-display text-lg font-bold">{String(item.title ?? item.name ?? "Pesan dari " + item.email)}</h3><p className="mt-1 text-xs text-sky">{String(item.project_title ?? item.category ?? item.issuer ?? item.role ?? item.email ?? "")} {item.year ? `· ${item.year}` : ""}</p><p className="mt-2 whitespace-pre-wrap text-sm text-mist/70">{String(item.description ?? item.text ?? "")}</p>{tab === "testimonials" && <p className="mt-2 text-xs font-semibold">Status: {item.approved ? "Disetujui" : "Menunggu tinjauan"}</p>}{(tab === "messages" || tab === "comments") && <p className="mt-2 text-xs text-mist/50">{String(item.created_at ?? "")}</p>}</div>
          <div className="flex flex-wrap gap-2">{(tab === "projects" || tab === "certificates" || tab === "skills") && <button onClick={() => { setEditing(item); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-full border border-sky/20 px-4 py-2 text-xs">Ubah</button>}{tab === "testimonials" && <button onClick={() => void approval(item, !item.approved)} className="rounded-full border border-sky/20 px-4 py-2 text-xs">{item.approved ? "Sembunyikan" : "Setujui"}</button>}<button onClick={() => void remove(tab, Number(item.id))} className="rounded-full border border-rose-200 px-4 py-2 text-xs text-rose-700">Hapus</button></div>
        </article>)}
      </div>
    </div>
  );
}
