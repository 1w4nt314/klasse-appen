import { Logo } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { TextLink } from "@/components/ui";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center px-5 py-5">
        <Logo />
      </header>
      <main className="flex flex-1 items-start justify-center px-5 pt-6 pb-16 sm:pt-12">
        <div className="w-full max-w-md">
          {!isSupabaseConfigured && (
            <p className="mb-4 rounded-control border border-line bg-surface px-4 py-3 text-sm text-muted">
              <strong className="text-ink">Demo-tilstand:</strong> login er ikke koblet på
              endnu. <TextLink href="/apps">Gå direkte til apps</TextLink>.
            </p>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
