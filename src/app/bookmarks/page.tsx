import { Header, Footer, MobileNav } from "@/components/layout/Chrome";
import { BookmarkList } from "@/components/bookmark/BookmarkList";

export const metadata = { title: "Bookmarks" };

export default function BookmarksPage() {
  return (
    <>
      <Header />
      <main className="container-wide px-4 pb-24 md:pb-12 pt-6 flex-1 w-full">
        <h1 className="text-h1 mb-4">Bookmarks</h1>
        <BookmarkList />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
