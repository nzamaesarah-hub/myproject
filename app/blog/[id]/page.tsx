export default async function DetailBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch data spesifik berdasarkan ID artikel
  const respon = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await respon.json();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <span className="font-body text-xs font-bold uppercase tracking-wider text-sky">
        Artikel #{post.id}
      </span>
      <h1 className="mt-2 font-display text-4xl font-extrabold capitalize text-mist md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-6 font-body text-base leading-relaxed text-mist/80">
        {post.body}
      </p>

      <div className="mt-10 border-t border-mist/10 pt-6">
        <a
          href="/blog"
          className="font-body text-sm font-semibold text-sky hover:underline"
        >
          ← Kembali ke Daftar Blog
        </a>
      </div>
    </div>
  );
}