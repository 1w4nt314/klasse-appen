import Link from "next/link";
import { LogoMark } from "@/components/Logo";

/** Fælles 404 — bruges både for ukendte adresser og sider man ikke har adgang til (fx /admin). */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-canvas px-5 py-16 text-center">
      <LogoMark size={48} />
      <h1 className="mt-6 font-display text-3xl font-bold text-ink">Siden findes ikke</h1>
      <p className="mt-2 max-w-sm text-muted">
        Adressen er forkert, eller siden er flyttet.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-control bg-brand px-5 py-2.5 font-bold text-white hover:bg-brand-strong"
      >
        Til forsiden
      </Link>
    </main>
  );
}
