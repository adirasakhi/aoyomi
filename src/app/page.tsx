"use client";

import { Header, Footer, MobileNav } from "@/components/layout/Chrome";
import { HeroSlider } from "@/components/home/HeroSlider";
import { MangaSection } from "@/components/home/Manga";
import { ContinueReading } from "@/components/home/ContinueReading";
import { MangaCardSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import { useHome, useSlider } from "@/lib/api/hooks";

export default function HomePage() {
  const home = useHome();
  const slider = useSlider("explore-1");

  return (
    <>
      <Header />
      <main className="container-wide px-4 pb-24 md:pb-12 pt-6 flex-1 w-full">
        {slider.isPending ? (
          <div className="skeleton h-[320px] md:h-[420px] rounded-xl" aria-label="Memuat featured" />
        ) : slider.isError ? (
          <ErrorState message="Gagal memuat featured." onRetry={() => slider.refetch()} />
        ) : (
          <HeroSlider items={slider.data?.data ?? []} />
        )}

        <ContinueReading />

        {home.isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8" aria-label="Memuat manga">
            {Array.from({ length: 8 }).map((_, i) => (
              <MangaCardSkeleton key={i} />
            ))}
          </div>
        ) : home.isError ? (
          <div className="mt-8">
            <ErrorState message="Gagal mengambil data." onRetry={() => home.refetch()} />
          </div>
        ) : (
          <>
            <MangaSection title="Latest" items={home.data?.latest ?? []} variant="standard" />
            <MangaSection
              title="Recommended"
              items={home.data?.recommended ?? []}
              variant="spotlight"
            />
            <MangaSection title="Popular" items={home.data?.popular ?? []} variant="ranked" />
          </>
        )}
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
