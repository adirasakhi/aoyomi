"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { BookMarked, House, Search, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useBookmarks } from "@/lib/store/bookmarks";

export function Header() {
  const [q, setQ] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const bookmarkCount = useBookmarks((s) => Object.keys(s.items).length);

  useEffect(() => {
    if (mobileSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-[200] border-b border-border/80 bg-background/80 backdrop-blur-xl transition-all">
      <div className="container-wide flex items-center justify-between gap-3 px-4 py-2.5 md:py-3">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0" aria-label="AOYOMI home">
          <div className="relative flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="AOYOMI logo"
              width={34}
              height={34}
              className="rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-md shadow-primary/20"
            />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          <span className="font-extrabold text-xl tracking-wider text-text-primary group-hover:text-primary transition-colors">
            AO<span className="text-gradient">YOMI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5 ml-4" aria-label="Primary">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              pathname === "/"
                ? "bg-surface-elevated text-primary shadow-sm border border-border"
                : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
            }`}
          >
            Home
          </Link>
          <Link
            href="/bookmarks"
            aria-current={pathname === "/bookmarks" ? "page" : undefined}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              pathname === "/bookmarks"
                ? "bg-surface-elevated text-primary shadow-sm border border-border"
                : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
            }`}
          >
            <BookMarked size={16} />
            <span>Bookmark</span>
            {bookmarkCount > 0 && (
              <span className="badge badge-primary px-1.5 py-0 text-[10px] font-bold h-4 min-w-4 flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Desktop Search */}
        <form
          className="hidden md:flex ml-auto flex-1 max-w-sm gap-2"
          role="search"
          onSubmit={handleSearch}
        >
          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              aria-hidden
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari manga, manhwa..."
              aria-label="Cari judul manga"
              className="input pl-9 pr-8 text-sm"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
                aria-label="Hapus teks"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary px-3.5 tap-target" aria-label="Cari">
            <Search size={16} aria-hidden />
          </button>
        </form>

        {/* Mobile Header Right Actions */}
        <div className="flex md:hidden items-center gap-1">
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="btn btn-ghost p-2 text-text-secondary hover:text-primary tap-target"
            aria-label="Buka pencarian"
          >
            {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <Link
            href="/bookmarks"
            className="btn btn-ghost p-2 relative text-text-secondary hover:text-primary tap-target"
            aria-label="Buka bookmark"
          >
            <BookMarked size={20} />
            {bookmarkCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-border/50 bg-surface/95 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <form className="flex gap-2" role="search" onSubmit={handleSearch}>
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                aria-hidden
              />
              <input
                ref={searchInputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari judul komik..."
                aria-label="Cari judul manga"
                className="input pl-9 pr-8 text-sm"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
                  aria-label="Hapus teks"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary px-4 tap-target" aria-label="Cari">
              Cari
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const bookmarkCount = useBookmarks((s) => Object.keys(s.items).length);

  const navItems = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
      icon: (active: boolean) => <House size={20} className={active ? "text-primary" : ""} />,
    },
    {
      href: "/search",
      label: "Search",
      active: pathname === "/search",
      icon: (active: boolean) => <Search size={20} className={active ? "text-primary" : ""} />,
    },
    {
      href: "/bookmarks",
      label: "Saved",
      active: pathname === "/bookmarks",
      badge: bookmarkCount > 0 ? bookmarkCount : undefined,
      icon: (active: boolean) => <BookMarked size={20} className={active ? "text-primary" : ""} />,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-[200] bg-surface/90 backdrop-blur-xl border-t border-border/80 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={`relative flex flex-1 flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all tap-target ${
              item.active ? "text-primary font-semibold" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <div
              className={`relative flex items-center justify-center p-1 rounded-lg transition-transform duration-200 ${
                item.active ? "scale-110 bg-primary/10" : ""
              }`}
            >
              {item.icon(item.active)}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-primary text-background font-black text-[10px] flex items-center justify-center shadow-sm">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight mt-0.5">{item.label}</span>
            {item.active && (
              <span className="absolute bottom-0.5 w-4 h-0.5 rounded-full bg-primary shadow-[0_0_8px_#38BDF8]" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface/40 mt-16 pb-20 md:pb-8">
      <div className="container-wide px-4 py-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="font-extrabold text-lg tracking-wider">
                AO<span className="text-gradient">YOMI</span>
              </p>
              <span className="badge badge-primary text-[10px] py-0 px-1.5">v2.0</span>
            </div>
            <p className="text-meta text-xs text-text-muted max-w-sm">
              Baca manga, manhwa & manhua favoritmu dengan tampilan modern, cepat, dan nyaman.
            </p>
          </div>
          <nav className="flex flex-wrap gap-4 text-xs text-text-secondary" aria-label="Footer">
            <Link href="/" className="hover:text-primary transition-colors py-1">
              Home
            </Link>
            <Link href="/search" className="hover:text-primary transition-colors py-1">
              Search & Browse
            </Link>
            <Link href="/bookmarks" className="hover:text-primary transition-colors py-1">
              Bookmark Library
            </Link>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row gap-2 text-micro text-text-muted border-t border-border/40 pt-4 items-center justify-between">
          <span>© {new Date().getFullYear()} AOYOMI. Hak cipta milik pengarang & penerbit masing-masing.</span>
          <span>Powered by Shinigami API</span>
        </div>
      </div>
    </footer>
  );
}

