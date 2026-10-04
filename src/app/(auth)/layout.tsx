import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { getTeacher } from "@/lib/session";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  if (await getTeacher()) redirect("/apps");
  return <AuthShell>{children}</AuthShell>;
}
