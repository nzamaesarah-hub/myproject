import Image from "next/image";
import { listCertificates } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function CertificatesPage() {
  const certificates = listCertificates();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h1 className="font-display text-6xl font-extrabold"><span className="gradient-text">Sertifikat</span></h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-mist/60">Sertifikat dan pencapaian yang mendukung perjalanan belajar serta pengalaman saya.</p>
      {certificates.length === 0 ? (
        <div className="panel-card mt-10 p-8 text-sm text-mist/60">Belum ada sertifikat yang ditambahkan. Sertifikat dapat dimasukkan melalui halaman Admin.</div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <article key={certificate.id} className="panel-card overflow-hidden p-5">
              {certificate.image && <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-panel"><Image src={certificate.image} alt={certificate.title} fill className="object-contain p-2" /></div>}
              <p className="text-xs uppercase tracking-wide text-sky">{certificate.issuer} · {certificate.year}</p>
              <h2 className="mt-2 font-display text-xl font-bold">{certificate.title}</h2>
              {certificate.url && <div className="mt-4 flex flex-wrap gap-4"><a className="text-sm font-semibold text-sky hover:underline" href={certificate.url} target="_blank" rel="noreferrer">Buka sertifikat ↗</a><a className="text-sm font-semibold text-sky hover:underline" href={certificate.url} download>Unduh PDF ↓</a></div>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
