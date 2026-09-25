import Image from "next/image";
import Link from "next/link";
import type { Manga } from "@/types/manga";

export type CardVariant = "standard" | "spotlight" | "ranked";

function Meta({ manga }: { manga: Manga }) {
  return (
    <p className="text-micro text-mono mt-1">
      {manga.latestChapter ? `Ch ${manga.latestChapter}` : ""}
      {manga.rating ? ` · ★ ${manga.rating}` : ""}
    </p>
  );
}

export function MangaCard({
  manga,
  variant = "standard",
  rank,
}: {
  manga: Manga;
  variant?: CardVariant;
  rank?: number;
}) {
  if (variant === "spotlight") {
    return (
      <Link
        href={`/manga/${manga.mangaId}`}
        className="card p-4 flex gap-4 hover:border-text-secondary"
        aria-label={`Buka ${manga.title}`}
      >
        <div className="relative w-24 aspect-[5/7] overflow-hidden rounded-md bg-surface-elevated shrink-0">
          {manga.cover ? (
            <Image
              src={manga.cover}
              alt={`Cover ${manga.title}`}
              fill
              sizes="96px"
              className="object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium line-clamp-1 text-base">{manga.title}</p>
          <Meta manga={manga} />
          {manga.description ? (
            <p className="text-meta text-sm line-clamp-2 mt-2">{manga.description}</p>
          ) : null}
          {manga.genres.length ? (
            <p className="text-micro mt-2 line-clamp-1">
              {manga.genres.slice(0, 3).map((g) => g.name).join(" · ")}
            </p>
          ) : null}
        </div>
      </Link>
    );
  }

  if (variant === "ranked") {
    return (
      <Link
        href={`/manga/${manga.mangaId}`}
        className="card px-4 py-3 flex items-center gap-4 hover:border-text-secondary"
        aria-label={`Peringkat ${rank ?? ""}: buka ${manga.title}`}
      >
        {typeof rank === "number" ? (
          <span className="text-mono text-h2 w-8 shrink-0 text-text-secondary" aria-hidden>
            {rank}
          </span>
        ) : null}
        <div className="relative w-12 h-[68px] overflow-hidden rounded bg-surface-elevated shrink-0">
          {manga.cover ? (
            <Image
              src={manga.cover}
              alt={`Cover ${manga.title}`}
              fill
              sizes="48px"
              className="object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium line-clamp-1">{manga.title}</p>
          <Meta manga={manga} />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/manga/${manga.mangaId}`}
      className="card p-3 block hover:border-text-secondary"
      aria-label={`Buka ${manga.title}`}
    >
      <div className="relative aspect-[5/7] overflow-hidden rounded-md bg-surface-elevated">
        {manga.cover ? (
          <Image
            src={manga.cover}
            alt={`Cover ${manga.title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      <p className="mt-3 font-medium line-clamp-1">{manga.title}</p>
      <Meta manga={manga} />
    </Link>
  );
}

export function MangaSection({
  title,
  items,
  variant = "standard",
}: {
  title: string;
  items: Manga[];
  variant?: CardVariant;
}) {
  if (!items.length) return null;
  if (variant === "spotlight") {
    return (
      <section aria-label={title} className="mt-8">
        <h2 className="text-h2 mb-4">{title}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((m) => (
            <MangaCard key={m.mangaId} manga={m} variant="spotlight" />
          ))}
        </div>
      </section>
    );
  }
  if (variant === "ranked") {
    return (
      <section aria-label={title} className="mt-8">
        <h2 className="text-h2 mb-4">{title}</h2>
        <ol className="grid md:grid-cols-2 gap-3">
          {items.map((m, i) => (
            <li key={m.mangaId}>
              <MangaCard manga={m} variant="ranked" rank={i + 1} />
            </li>
          ))}
        </ol>
      </section>
    );
  }
  return (
    <section aria-label={title} className="mt-8">
      <h2 className="text-h2 mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((m) => (
          <MangaCard key={m.mangaId} manga={m} />
        ))}
      </div>
    </section>
  );
}
