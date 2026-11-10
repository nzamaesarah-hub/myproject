"use client";

import { useState } from "react";

interface Comment {
  id: number;
  nama: string;
  teks: string;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, nama: "Guru RPL", teks: "Proyek portofolio yang sangat bagus dan rapi!" },
  ]);
  const [nama, setNama] = useState("");
  const [teks, setTeks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !teks.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      nama,
      teks,
    };

    setComments([...comments, newComment]);
    setNama("");
    setTeks("");
  };

  return (
    <div className="mt-12 border-t border-sky/20 pt-8">
      <h3 className="font-display text-2xl font-bold tracking-tight text-mist mb-6">
        Komentar ({comments.length})
      </h3>

      {/* Form Input Komentar */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8 max-w-xl">
        <input
          type="text"
          placeholder="Nama Anda"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="border border-sky/30 bg-navy/50 p-3 rounded-lg text-sm text-mist placeholder-mist/40 focus:outline-none focus:border-sky transition"
        />
        <textarea
          placeholder="Tulis komentar..."
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          rows={3}
          className="border border-sky/30 bg-navy/50 p-3 rounded-lg text-sm text-mist placeholder-mist/40 focus:outline-none focus:border-sky transition resize-none"
        />
        <button
          type="submit"
          className="bg-sky text-navy px-5 py-2.5 rounded-full text-sm font-body font-semibold uppercase tracking-wide self-start hover:opacity-90 transition"
        >
          Kirim Komentar
        </button>
      </form>

      {/* Daftar Komentar */}
      <div className="space-y-3 max-w-xl">
        {comments.map((item) => (
          <div key={item.id} className="panel-card p-4 rounded-xl border border-sky/20 bg-sky/5">
            <p className="font-bold text-sm text-sky">{item.nama}</p>
            <p className="text-sm text-mist/80 mt-1">{item.teks}</p>
          </div>
        ))}
      </div>
    </div>
  );
}