import Sunburst from "@/components/Sunburst";

export default function Footer() {
  return (
    <footer className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <p className="flex items-center justify-center gap-3 font-display text-lg font-semibold">
          <Sunburst className="h-6 w-6 text-sky" />
          Nama Kamu
          <Sunburst className="h-6 w-6 text-sky" />
        </p>

        <div className="panel-card mx-auto mt-6 px-6 py-10">
          <h2 className="font-display text-4xl font-bold md:text-6xl">
            <span className="gradient-text">let&apos;s connect</span>
          </h2>
        </div>

        <p className="mt-6 font-body text-mist/70">
          Terbuka untuk kolaborasi dan kesempatan baru.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <span className="rounded-full bg-panel px-5 py-3 font-body text-sm text-mist/80">
            hello@namakamu.com
          </span>
          <span className="rounded-full bg-panel px-5 py-3 font-body text-sm text-mist/80">
            @namakamu
          </span>
        </div>
      </div>
    </footer>
  );
}
