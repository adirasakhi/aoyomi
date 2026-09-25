"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Cover with honest fallback (R-23): initial letter on surface instead of
// a broken image box. Parent must be relative; this fills it absolutely.
export function CoverImage({
  src,
  alt,
  sizes,
  eager = false,
  className,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    const initial = (alt.replace(/^Cover /, "").trim().charAt(0) || "?").toUpperCase();
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-surface-elevated",
          className
        )}
      >
        <span aria-hidden className="text-h1 text-text-muted">
          {initial}
        </span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
