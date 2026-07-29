import Link from "next/link";
import Sunburst from "@/components/Sunburst";

export default function HomePage() {
  return (
    <div>
      {/* HERO — judul besar bertumpuk khas tema ini */}
      <section className="relative mx-auto max-w-6xl px-4 pb-9 pt-16 md:px-8 md:pt-24">
        <h1 className="font-display text-7xl font-extrabold leading-[0.95] tracking-tight sm:text-8xl md:text-9xl">
          <span className="gradient-text">About Nz</span>
          <br />
        </h1>

        <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <p className="max-w-sm font-body text-mist/70">
            Saya adalah siswi kelas XII jurusan Rekayasa Perangkat Lunak (RPL) di SMK Telkom Makassar yang memiliki ketertarikan pada pengembangan perangkat lunak, UI/UX Design, serta manajemen proyek.
          </p>

          <div className="panel-card w-full max-w-xs px-6 py-5 md:w-auto">
            <p className="font-display text-xl font-bold">Nahza Maesarah</p>
            <p className="font-body text-sm text-mist/60">Student of SMK TELKOM MAKASSAR</p>
          </div>
        </div>

        <Sunburst className="absolute right-4 top-24 hidden h-16 w-16 text-sky/60 md:block" />

        <div className="mt-12 flex gap-4">
          <Link
            href="/portfolio"
            className="rounded-full bg-sky px-6 py-3 font-body text-sm font-medium text-navy"
          >
            Lihat Portofolio
          </Link>
          <Link
            href="/profile"
            className="rounded-full border border-sky/30 px-6 py-3 font-body text-sm font-medium text-mist"
          >
            Tentang Saya
          </Link>
        </div>
      </section>

      {/* RINGKASAN FOKUS — bagian umum, isi bebas */}
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="panel-card grid gap-8 p-8 md:grid-cols-3 md:p-10">
          {[
            { title: "Wakil Ketua Osis 1 Periode 25/26", desc: "Aktif Menjabat sebagai Wakil Ketua OSIS, terlibat dalam perencanaan, koordinasi, serta pelaksanaan berbagai program kerja dan event sekolah" },
            { title: "Project Management", desc: "Berpengalaman memimpin tim lintas kelas sebagai Project Manager dalam pengembangan website klien, mulai dari perencanaan, pembagian tugas, hingga koordinasi desain." },
            { title: "Finance Administration", desc: "Mengelola administrasi dan anggaran kegiatan sekolah, melakukan pencatatan transaksi, verifikasi bukti pembelian, hingga penyusunan laporan keuangan sesuai SOP sekolah." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <Sunburst className="mt-1 h-6 w-6 shrink-0 text-sky" />
              <div>
                <h3 className="font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-1 font-body text-sm text-mist/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}