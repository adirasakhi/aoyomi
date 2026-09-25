"use client";

import Image from "next/image";
import { useState } from "react";
import { proxied } from "@/lib/images";

export function ReaderImage({ src, alt, index }: { src: string; alt: string; index: number }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const finalSrc = proxied(src);
  if (!finalSrc || failed) {
    return (
      <div className="reader-image image-placeholder flex items-center justify-center min-h-[400px]" role="img" aria-label={`${alt} gagal dimuat`}>
        <p className="text-meta">Gambar {index + 1} gagal dimuat.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {!loaded ? <div className="skeleton w-full aspect-[2/3]" aria-hidden /> : null}
      <Image
        src={finalSrc}
        alt={alt}
        width={800}
        height={1200}
        sizes="(max-width: 900px) 100vw, 900px"
        loading={index < 2 ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
        priority={index === 0}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className="reader-image"
      />
    </div>
  );
}
