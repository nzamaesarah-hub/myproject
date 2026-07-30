"use client"; // Diperlukan karena menggunakan input & state

import { useState } from "react";

export default function BukuTamuPage() {
  // Langkah 1: Siapkan Dua State
  // 1. State untuk teks yang sedang diketik di kotak input
  const [inputTeks, setInputTeks] = useState<string>("");

  // 2. State (Array) untuk menyimpan daftar seluruh pesan yang sudah terkirim
  const [daftarPesan, setDaftarPesan] = useState<string[]>([
    "Halo! Portofolionya bagus sekali 👍",
    "Sangat terkesan dengan desain dan proyek-proyeknya!",
  ]);

  // Langkah 3: Fungsi Tombol Kirim
  const tambahPesan = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah form melakukan reload halaman

    // Pastikan input tidak kosong/hanya spasi
    if (inputTeks.trim() === "") return;

    // Ambil isi Array lama, tambahkan teks baru, lalu reset kotak input
    setDaftarPesan([...daftarPesan, inputTeks]);
    setInputTeks("");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      {/* Header Halaman */}
      <h1 className="font-display text-5xl font-extrabold md:text-6xl">
        <span className="gradient-text">Buku Tamu</span>
      </h1>
      <p className="mt-4 font-body text-mist/60">
        Tinggalkan pesan atau jejak kamu setelah mengunjungi portofolio ini!
      </p>

      {/* Langkah 2: Form Input */}
      <form onSubmit={tambahPesan} className="mt-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          value={inputTeks} // Menautkan nilai (value) ke state
          onChange={(e) => setInputTeks(e.target.value)} // Menangkap input teks via onChange
          placeholder="Tulis pesan kamu di sini..."
          className="flex-1 rounded-xl border border-sky/20 bg-panel/80 px-4 py-3 font-body text-sm text-mist placeholder:text-mist/40 focus:border-sky focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-sky px-6 py-3 font-body text-sm font-bold text-panel transition-opacity hover:opacity-90"
        >
          Kirim Pesan
        </button>
      </form>

      {/* Langkah 4: Render List dengan .map() */}
      <div className="mt-12 space-y-4">
        <h2 className="font-display text-xl font-bold">Pesan Terkirim ({daftarPesan.length})</h2>
        
        {daftarPesan.length === 0 ? (
          <p className="font-body text-sm text-mist/40">Belum ada pesan. Jadilah yang pertama!</p>
        ) : (
          <div className="space-y-3">
            {daftarPesan.map((pesan, index) => (
              <div
                key={index}
                className="rounded-xl border border-sky/10 bg-panel/60 p-4 font-body text-sm text-mist/90"
              >
                💬 {pesan}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}