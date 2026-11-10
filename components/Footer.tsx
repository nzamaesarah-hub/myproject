import Sunburst from "@/components/Sunburst";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <p className="flex items-center justify-center gap-3 font-display text-lg font-semibold">
          <Sunburst className="h-6 w-6 text-sky" />
          Nahza Maesarah
          <Sunburst className="h-6 w-6 text-sky" />
        </p>

        <div className="panel-card mx-auto mt-6 px-6 py-10">
          <h2 className="font-display text-4xl font-bold md:text-6xl">
            <span className="gradient-text">Let&apos;s connect</span>
          </h2>
        </div>

        <p className="mt-6 font-body text-mist/70">
          Terbuka untuk kolaborasi dan kesempatan baru.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="mailto:nzamaesarah@gmail.com" className="rounded-full bg-panel px-5 py-3 font-body text-sm text-mist/80 hover:text-sky">
            nzamaesarah@gmail.com
          </a>
          <a href="https://instagram.com/_nzzzmsrh" target="_blank" rel="noreferrer" className="rounded-full bg-panel px-5 py-3 font-body text-sm text-mist/80 hover:text-sky">
            @_nzzzmsrh
          </a>
        </div>
        <Link href="/contact" className="mt-6 inline-block rounded-full border border-sky/20 px-5 py-2 text-sm text-sky hover:bg-sky/10">Kirim pesan</Link>
        <p className="mt-6 text-xs text-mist/40">© {new Date().getFullYear()} Nahza Maesarah</p>
      </div>
    </footer>
  );
}
