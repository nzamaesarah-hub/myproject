import Image from "next/image";
import { experiences } from "@/data/experience";
import { strengths, traits, education, interests } from "@/data/skills";
import Sunburst from "@/components/Sunburst";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      {/* HELLO, I'M ... */}
      <section className="flex flex-col items-center gap-10 md:flex-row">

        {/* Bagian FOTO */}
        <div className="relative h-72 w-full flex-1 overflow-hidden rounded-3xl border border-sky/20 bg-panel/80 md:h-96">
          <Image
            src="/Tes.jpg" // Simpan file foto kamu di folder public/profile.jpg
            alt="Foto Nahza Maesarah"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="panel-card flex-1 p-8 md:p-10">
          <p className="font-body text-mist/60">Hello, I&apos;m</p>
          <h1 className="mt-1 font-display text-5xl font-extrabold leading-tight md:text-6xl">
            <span className="gradient-text">Nahza Maesarah</span>
          </h1>
          <p className="mt-6 font-body text-mist/70">
            Saya adalah siswi kelas XII Rekayasa Perangkat Lunak SMK Telkom Makassar yang memiliki minat pada bidang teknologi, desain dan administrasi keuangan. 
            Selama menjadi Wakil Ketua OSIS, saya dipercaya menangani administrasi keuangan kegiatan sekolah. Pengalaman tersebut membentuk saya menjadi pribadi yang teliti, disiplin, serta mampu bekerja di bawah prosedur yang jelas.
            Di bidang teknologi, saya terus mengembangkan kemampuan dalam pengembangan website, aplikasi mobile, UI/UX Design, serta pengelolaan proyek perangkat lunak.
            
          </p>
        </div>
      </section>

      {/* WHAT I DO BEST */}
      <section className="mt-20">
        <h2 className="font-display text-4xl font-extrabold md:text-5xl">
          Apa yang <span className="gradient-text">saya kuasai</span>
        </h2>
        <div className="mt-8 space-y-4">
          {strengths.map((item) => (
            <div key={item.title} className="panel-card flex items-start gap-4 p-6">
              <Sunburst className="mt-1 h-6 w-6 shrink-0 text-sky" />
              <div>
                <h3 className="font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-1 font-body text-sm text-mist/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT MAKES ME DIFFERENT */}
      <section className="mt-20 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl font-extrabold md:text-5xl">
            Yang membuat <span className="gradient-text">saya berbeda</span>
          </h2>
        </div>
        <div className="space-y-4">
          {traits.map((item) => (
            <div key={item.title} className="panel-card flex items-start gap-4 p-6">
              <Sunburst className="mt-1 h-5 w-5 shrink-0 text-sky" />
              <div>
                <h3 className="font-display text-base font-bold">{item.title}</h3>
                <p className="mt-1 font-body text-sm text-mist/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PENGALAMAN ORGANISASI */}
      <section className="mt-20">
        <h2 className="font-display text-4xl font-extrabold md:text-5xl">
          Pengalaman <span className="gradient-text">organisasi</span>
        </h2>
        <div className="mt-10 space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.role}
              className="panel-card flex flex-col justify-between gap-2 p-6 md:flex-row md:items-start"
            >
              <div>
                <h3 className="font-display text-xl font-bold">{exp.role}</h3>
                <p className="font-body text-sm text-sky">{exp.company}</p>
                <p className="mt-2 max-w-lg font-body text-sm text-mist/60">
                  {exp.description}
                </p>
              </div>
              <span className="whitespace-nowrap font-body text-sm text-mist/40">
                {exp.period}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PENDIDIKAN */}
      <section className="mt-20">
        <h2 className="font-display text-4xl font-extrabold md:text-5xl">Pendidikan</h2>
        <div className="panel-card mt-8 p-6">
          <h3 className="font-display text-lg font-bold">{education.school}</h3>
          <p className="font-body text-sm text-sky">{education.major}</p>
          <p className="mt-2 font-body text-sm text-mist/60">{education.description}</p>
          <p className="mt-2 font-body text-sm text-mist/40">{education.period}</p>
        </div>
      </section>

      {/* MINAT */}
      <section className="mt-20">
        <h2 className="font-display text-4xl font-extrabold md:text-5xl">Minat</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {interests.map((item) => (
            <span key={item} className="rounded-full bg-panel px-5 py-2 font-body text-sm text-mist/80">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}