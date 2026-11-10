"use client";

import { useEffect, useRef, useState } from "react";

interface Comment {
  id: number;
  name: string;
  text: string;
}

interface KartuProyekProps {
  id: number;
  title: string;
  category: string;
  year: string;
  image?: string;
  description?: string;
}

export default function KartuProyek({ id, title, category, year, image, description }: KartuProyekProps) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [nama, setNama] = useState("");
  const [teks, setTeks] = useState("");
  const visitorId = useRef("");
  const [activityError, setActivityError] = useState("");

  useEffect(() => {
    let stored = window.localStorage.getItem("portfolio-visitor-id");
    if (!stored) {
      stored = window.crypto.randomUUID();
      window.localStorage.setItem("portfolio-visitor-id", stored);
    }
    visitorId.current = stored;
    void fetch(`/api/projects/${id}?visitorId=${encodeURIComponent(stored)}`)
      .then((response) => response.json())
      .then((data) => { setLikes(data.likes ?? 0); setIsLiked(Boolean(data.liked)); setComments(data.comments ?? []); })
      .catch(() => setActivityError("Interaksi belum dapat dimuat."));
  }, [id]);

  const handleLike = async () => {
    if (!visitorId.current) return;
    const response = await fetch(`/api/projects/${id}/like`, {
      method: isLiked ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: visitorId.current }),
    });
    if (!response.ok) { setActivityError("Suka belum dapat disimpan."); return; }
    const data = await (await fetch(`/api/projects/${id}?visitorId=${encodeURIComponent(visitorId.current)}`)).json();
    setLikes(data.likes); setIsLiked(data.liked);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !teks.trim()) return;
    const response = await fetch(`/api/projects/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nama, text: teks }),
    });
    if (!response.ok) { setActivityError("Komentar belum dapat disimpan."); return; }
    const data = await (await fetch(`/api/projects/${id}?visitorId=${encodeURIComponent(visitorId.current)}`)).json();
    setComments(data.comments ?? []);
    setNama("");
    setTeks("");
  };

  return (
    <div className="panel-card flex flex-col justify-between p-5 rounded-2xl border border-sky/20 bg-sky/5 transition hover:border-sky/40">
      <div>
        {/* Gambar / Slot Foto Proyek */}
        <div className="photo-slot aspect-[4/3] rounded-xl overflow-hidden mb-4 flex items-center justify-center bg-navy/40 border border-dashed border-sky/30 text-mist/50 text-sm">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            "Foto Proyek"
          )}
        </div>

        {/* Informasi Proyek */}
        <p className="font-body text-xs uppercase tracking-wide text-sky">
          {category} · {year}
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-mist">{title}</h3>
        {description && <p className="mt-2 font-body text-sm leading-6 text-mist/60">{description}</p>}
      </div>

      {/* SECTION LIKE DAN KOMENTAR PERMANEN (TANPA PANAH) */}
      <div className="mt-6 border-t border-sky/10 pt-4 flex flex-col gap-3">
        {/* Tombol Like */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition ${
              isLiked
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-sky/10 text-mist/70 border border-sky/20 hover:bg-sky/20"
            }`}
          >
            <span>{isLiked ? "❤️ Suka" : "🤍 Suka"}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-navy/60">{likes}</span>
          </button>

          <span className="text-xs text-mist/60 font-body">
            {comments.length} Komentar
          </span>
        </div>

        {/* FORM INPUT KOMENTAR (Langsung Terbuka) */}
        <form onSubmit={handleAddComment} className="flex flex-col gap-2 mt-2">
          <input
            type="text"
            placeholder="Nama Anda"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="border border-sky/30 bg-navy/70 p-2 rounded text-xs text-mist placeholder-mist/40 focus:outline-none focus:border-sky"
          />
          <textarea
            placeholder="Tulis komentar..."
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            rows={2}
            className="border border-sky/30 bg-navy/70 p-2 rounded text-xs text-mist placeholder-mist/40 focus:outline-none focus:border-sky resize-none"
          />
          <button
            type="submit"
            className="bg-sky text-navy px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wide self-end hover:opacity-90 transition"
          >
            Kirim
          </button>
        </form>

        {/* DAFTAR KOMENTAR YANG MASUK */}
        {comments.length > 0 && (
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1 mt-1">
            {comments.map((c) => (
              <div key={c.id} className="bg-navy/40 p-2 rounded border border-sky/10 text-xs">
                <p className="font-bold text-sky">{c.name}</p>
                <p className="text-mist/80 mt-0.5">{c.text}</p>
              </div>
            ))}
          </div>
        )}
        {activityError && <p role="status" className="text-xs text-rose-600">{activityError}</p>}
      </div>
    </div>
  );
}
