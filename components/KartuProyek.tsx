"use client"; // Diperlukan untuk state dan interaksi (Langkah 1 Tugas)

import { useState } from "react"; // Import useState (Langkah 1 Tugas)

interface KartuProyekProps {
  title: string;
  category: string;
  year: string;
  image?: string;
}

export default function KartuProyek({
  title,
  category,
  year,
  image,
}: KartuProyekProps) {
  // 1. State untuk jumlah like dan status sudah/belum like (Langkah 2 Tugas)
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // 2. Fungsi Logika Toggle Like (Langkah 3 Tugas)
  const tanganiKlikLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
    } else {
      setLikes(likes - 1);
      setIsLiked(false);
    }
  };

  return (
    <div className="group rounded-2xl border border-sky/20 bg-panel/80 p-5 transition-colors hover:border-sky/60">
      
      {/* Tampilan Gambar Proyek */}
      <div className="aspect-4/3 overflow-hidden rounded-xl bg-panel">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-mist/40">
            Foto proyek
          </div>
        )}
      </div>

      <div className="mt-4">
        {/* Label Proyek Terpopuler! jika likes >= 5 (Langkah 4.3 Tugas) */}
        {likes >= 5 && (
          <p className="mb-1 font-body text-xs font-bold text-amber-400">
            🔥 Proyek Terpopuler!
          </p>
        )}

        <p className="font-body text-xs uppercase tracking-wide text-sky">
          {category} · {year}
        </p>
        
        <h3 className="mt-1 font-display text-lg font-bold">{title}</h3>
      </div>

      {/* Bagian Tombol dan Counter Like */}
      <div className="mt-6 flex items-center justify-between border-t border-mist/10 pt-4">
        <span className="font-body text-xs font-semibold text-mist/70">
          ❤️ {likes} Suka
        </span>

        {/* Tombol dengan Event Handler & Ternary Operator (Langkah 4.1 & 4.2 Tugas) */}
        <button
          onClick={tanganiKlikLike}
          className={`rounded-xl px-4 py-2 font-body text-xs font-bold transition-all ${
            isLiked
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30"
              : "bg-sky/10 text-sky border border-sky/30 hover:bg-sky/20"
          }`}
        >
          {isLiked ? "Batal Suka" : "Suka"}
        </button>
      </div>

    </div>
  );
}