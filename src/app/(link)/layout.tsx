import { AuthShell } from "@/components/AuthShell";

/** Sider man lander på fra et link i en mail. Virker også, når man er logget ind. */
export default function LinkLayout({ children }: LayoutProps<"/">) {
  return <AuthShell>{children}</AuthShell>;
}
