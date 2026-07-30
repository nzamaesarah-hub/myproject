export default async function BlogPage() {
  const respon = await fetch("https://dummyjson.com/posts?limit=6");
  const data = await respon.json();
  const posts = data.posts;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h1 className="font-display text-6xl font-extrabold md:text-7xl">
        <span className="gradient-text">Blog</span>
      </h1>

      <p className="mt-4 max-w-md font-body text-mist/60">
        Berisi berbagai artikel dan informasi menarik seputar teknologi,
        pengembangan perangkat lunak, serta topik yang dapat menambah wawasan
        dan inspirasi.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <div
            key={post.id}
            className="rounded-2xl border border-mist/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky/40 hover:shadow-lg hover:shadow-sky/10"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-sky">
              Artikel #{post.id}
            </span>

            <h2 className="mt-3 font-display text-2xl font-bold text-mist">
              {post.title}
            </h2>

            <p className="mt-4 line-clamp-3 font-body text-sm leading-6 text-mist/60">
              {post.body}
            </p>

            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                post.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center text-sm font-semibold text-sky transition-colors hover:text-sky/80"
            >
              Baca Selengkapnya →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}