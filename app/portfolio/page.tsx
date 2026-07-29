import { projects } from "@/data/portfolio";

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h1 className="font-display text-6xl font-extrabold md:text-7xl">
        <span className="gradient-text">Portfolio</span>
      </h1>
      <p className="mt-4 max-w-md font-body text-mist/60">
        Berisi proyek pengembangan perangkat lunak, desain UI/UX, serta pengalaman yang saya kerjakan selama menempuh pendidikan di SMK Telkom Makassar. Setiap proyek memberikan pengalaman dalam bekerja sama, menyelesaikan permasalahan, dan menerapkan teknologi ke dalam solusi nyata.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.title} className="group">
            
            {/* Container Foto Proyek */}
            <div className="aspect-4/3 overflow-hidden rounded-2xl border border-sky/20 bg-panel/80 transition-colors group-hover:border-sky/60">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-mist/40">
                  Foto proyek
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="font-body text-xs uppercase tracking-wide text-sky">
                {project.category} · {project.year}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold">{project.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}