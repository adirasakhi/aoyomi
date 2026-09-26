import Link from "next/link";
import { Star, Flame, Compass, Sparkles, TrendingUp } from "lucide-react";
import type { Manga } from "@/types/manga";
import { CoverImage } from "@/components/ui/CoverImage";
import { Badge } from "@/components/ui/Badge";

export type CardVariant = "standard" | "spotlight" | "ranked";

function Meta({ manga }: { manga: Manga }) {
  return (
    <div className="flex items-center gap-1.5 text-micro text-text-muted mt-1 font-mono">
      {manga.latestChapter ? (
        <span className="text-text-secondary font-medium">Ch. {manga.latestChapter}</span>
      ) : null}
      {manga.rating ? (
        <span className="flex items-center gap-0.5 text-amber-400 font-medium">
          <Star size={11} className="fill-amber-400" aria-hidden />
          {manga.rating}
        </span>
      ) : null}
      {manga.genres?.[0] ? (
        <span className="truncate max-w-[80px] text-text-muted hidden sm:inline">
          · {manga.genres[0].name}
        </span>
      ) : null}
    </div>
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
        className="group card-glass p-3.5 sm:p-4 flex gap-3.5 sm:gap-4 hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
        aria-label={`Buka ${manga.title}`}
      >
        <div className="relative w-24 sm:w-28 aspect-[5/7] overflow-hidden rounded-xl bg-surface-elevated shrink-0 border border-white/[0.08] shadow-md group-hover:scale-105 transition-transform duration-300">
          <CoverImage src={manga.cover} alt={`Cover ${manga.title}`} sizes="112px" />
          {manga.latestChapter && (
            <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center badge badge-glass text-[10px] py-0.5 px-1 font-bold">
              Ch. {manga.latestChapter}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1">
            {manga.rating && (
              <span className="badge badge-warning text-[10px] py-0 px-1.5 font-bold flex items-center gap-0.5">
                <Star size={10} className="fill-current" /> {manga.rating}
              </span>
            )}
            {manga.status && (
              <span className="badge badge-neutral text-[10px] py-0 px-1.5">
                {manga.status}
              </span>
            )}
          </div>
          <p className="font-bold text-sm sm:text-base line-clamp-1 text-text-primary group-hover:text-primary transition-colors">
            {manga.title}
          </p>
          {manga.description ? (
            <p className="text-meta text-xs line-clamp-2 mt-1.5 text-text-muted">
              {manga.description}
            </p>
          ) : null}
          {manga.genres.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {manga.genres.slice(0, 3).map((g) => (
                <span
                  key={g.id}
                  className="text-[10px] bg-white/[0.05] text-text-secondary px-2 py-0.5 rounded-full border border-white/[0.05]"
                >
                  {g.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    );
  }

  if (variant === "ranked") {
    const isTop1 = rank === 1;
    const isTop2 = rank === 2;
    const isTop3 = rank === 3;

    return (
      <Link
        href={`/manga/${manga.mangaId}`}
        className="group card-glass p-2.5 sm:p-3 flex items-center gap-3 hover:border-primary/40 transition-all duration-300"
        aria-label={`Peringkat ${rank ?? ""}: buka ${manga.title}`}
      >
        {typeof rank === "number" && (
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-extrabold shrink-0 ${
              isTop1
                ? "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-black shadow-md shadow-amber-500/20"
                : isTop2
                ? "bg-gradient-to-br from-slate-200 to-slate-400 text-black shadow-sm"
                : isTop3
                ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-sm"
                : "bg-surface-elevated text-text-secondary border border-white/[0.06]"
            }`}
            aria-hidden
          >
            {rank}
          </div>
        )}
        <div className="relative w-12 h-16 overflow-hidden rounded-lg bg-surface-elevated shrink-0 border border-white/[0.08] group-hover:scale-105 transition-transform duration-200">
          <CoverImage src={manga.cover} alt={`Cover ${manga.title}`} sizes="48px" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm line-clamp-1 text-text-primary group-hover:text-primary transition-colors">
            {manga.title}
          </p>
          <Meta manga={manga} />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/manga/${manga.mangaId}`}
      className="group card-glass p-2 sm:p-2.5 flex flex-col hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
      aria-label={`Buka ${manga.title}`}
    >
      {/* Cover with floating badges & zoom on hover */}
      <div className="relative aspect-[5/7] overflow-hidden rounded-xl bg-surface-elevated border border-white/[0.06] shadow-sm">
        <CoverImage
          src={manga.cover}
          alt={`Cover ${manga.title}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="group-hover:scale-105 transition-transform duration-300"
        />

        {/* Floating Chapter Badge */}
        {manga.latestChapter && (
          <div className="absolute top-2 left-2 z-10">
            <span className="badge badge-glass text-[10px] font-mono font-bold py-0.5 px-1.5 shadow-md">
              Ch. {manga.latestChapter}
            </span>
          </div>
        )}

        {/* Floating Rating Badge */}
        {manga.rating && (
          <div className="absolute top-2 right-2 z-10">
            <span className="badge badge-glass text-[10px] font-mono font-bold py-0.5 px-1.5 text-amber-300 flex items-center gap-0.5 shadow-md">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              {manga.rating}
            </span>
          </div>
        )}

        {/* Bottom subtle shadow vignette */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      <div className="pt-2.5 pb-1 px-1 flex-1 flex flex-col justify-between">
        <p className="font-semibold text-xs sm:text-sm line-clamp-2 text-text-primary group-hover:text-primary transition-colors leading-snug">
          {manga.title}
        </p>
        <Meta manga={manga} />
      </div>
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

  const getSectionIcon = () => {
    if (variant === "ranked" || title.toLowerCase().includes("popular")) {
      return <Flame size={20} className="text-amber-400" />;
    }
    if (variant === "spotlight" || title.toLowerCase().includes("recommend")) {
      return <Sparkles size={20} className="text-sky-400" />;
    }
    return <TrendingUp size={20} className="text-primary" />;
  };

  if (variant === "spotlight") {
    return (
      <section aria-label={title} className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 rounded-lg bg-sky-500/10 text-sky-400">
            {getSectionIcon()}
          </div>
          <h2 className="text-h2 font-bold">{title}</h2>
        </div>
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
      <section aria-label={title} className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
            {getSectionIcon()}
          </div>
          <h2 className="text-h2 font-bold">{title}</h2>
          <span className="badge badge-warning text-[10px] py-0 px-1.5 ml-1">Top 10</span>
        </div>
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
    <section aria-label={title} className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-primary/10 text-primary">
            {getSectionIcon()}
          </div>
          <h2 className="text-h2 font-bold">{title}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {items.map((m) => (
          <MangaCard key={m.mangaId} manga={m} />
        ))}
      </div>
    </section>
  );
}

