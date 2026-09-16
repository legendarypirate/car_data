import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Хуудас олдсонгүй</h1>
      <p className="mt-2 text-mute">
        Таны хайсан хуудас байхгүй байна.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Нүүр хуудас руу буцах
      </Link>
    </main>
  );
}
