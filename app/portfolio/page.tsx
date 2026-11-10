import { projects } from "@/data/portfolio";
import KartuProyek from "@/components/KartuProyek";
import { listProjects } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  const projects = listProjects();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h1 className="font-display text-6xl font-extrabold md:text-7xl">
        <span className="gradient-text">Portfolio</span>
      </h1>
      <p className="mt-4 max-w-md font-body text-mist/60">
        Berisi proyek pengembangan perangkat lunak, desain UI/UX, serta pengalaman yang saya kerjakan selama menempuh pendidikan di SMK Telkom Makassar. Setiap proyek memberikan pengalaman dalam bekerja sama, menyelesaikan permasalahan, dan menerapkan teknologi ke dalam solusi nyata.
      </p>

      {/* Grid Proyek dengan Fitur Like & Komentar Masing-Masing */}
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <KartuProyek
            key={project.id}
            id={project.id}
            title={project.title}
            category={project.category}
            year={project.year}
            image={project.image}
            description={project.description}
          />
        ))}
      </div>
    </div>
  );
}
