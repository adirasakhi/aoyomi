"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BookMarked, House, Search } from "lucide-react";
import Image from "next/image";

export function Header() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[200] border-b border-border bg-background/95 backdrop-blur">
      <div className="container-wide flex items-center gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="AOYOMI home">
          <Image
            src="/logo.png"
            alt="AOYOMI logo"
            width={36}
            height={36}
            className="rounded-lg transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-bold text-xl tracking-wider text-text-primary group-hover:text-primary transition-colors">
            AO<span className="text-primary">YOMI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-meta" aria-label="Primary">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="hover:text-text-primary">
            Home
          </Link>
          <Link
            href="/bookmarks"
            aria-current={pathname === "/bookmarks" ? "page" : undefined}
            className="hover:text-text-primary"
          >
            Bookmark
          </Link>
        </nav>
        <form
          className="ml-auto flex-1 max-w-md flex gap-2"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari judul manga"
            aria-label="Cari judul manga"
            className="input"
          />
          <button type="submit" className="btn btn-primary tap-target" aria-label="Cari">
            <Search size={18} aria-hidden />
          </button>
        </form>
      </div>
    </header>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const item = (href: string, label: string, active: boolean, icon: React.ReactNode) => (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-1 flex-col items-center gap-1 py-2 text-micro tap-target ${active ? "text-primary" : "text-text-secondary"
        }`}
    >
      {icon}
      {label}
    </Link>
  );
  return (
    <nav
      aria-label="Mobile"
      className="md:hidden fixed bottom-0 inset-x-0 z-[200] border-t border-border bg-surface flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {item("/", "Home", pathname === "/", <House size={20} aria-hidden />)}
      {item("/search", "Search", pathname === "/search", <Search size={20} aria-hidden />)}
      {item("/bookmarks", "Saved", pathname === "/bookmarks", <BookMarked size={20} aria-hidden />)}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="container-wide px-4 py-8 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div>
            <p className="font-bold tracking-wider">
              AO<span className="text-primary">YOMI</span>
            </p>
            <p className="text-meta text-micro mt-1">
              Baca komik dengan tenang, kapan saja.
            </p>
          </div>
          <nav className="md:ml-auto flex gap-5 text-meta text-micro" aria-label="Footer">
            <Link href="/" className="hover:text-text-primary tap-target inline-flex items-center">
              Home
            </Link>
            <Link href="/search" className="hover:text-text-primary tap-target inline-flex items-center">
              Search
            </Link>
            <Link href="/bookmarks" className="hover:text-text-primary tap-target inline-flex items-center">
              Bookmark
            </Link>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row gap-1 text-micro border-t border-border-muted pt-4">
          <span>© {new Date().getFullYear()} AOYOMI. Komik milik pengarang & penerbit masing-masing.</span>
          <span className="md:ml-auto">Data: Shinigami API.</span>
        </div>
      </div>
    </footer>
  );
}
