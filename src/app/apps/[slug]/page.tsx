import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApp } from "@/apps/registry";
import { AppRuntime } from "@/apps/runtime";
import { requireTeacher } from "@/lib/session";

export async function generateMetadata({
  params,
}: PageProps<"/apps/[slug]">): Promise<Metadata> {
  const app = getApp((await params).slug);
  return app ? { title: app.name, description: app.tagline } : {};
}

export default async function AppPage({ params }: PageProps<"/apps/[slug]">) {
  const { slug } = await params;
  if (!getApp(slug)) notFound();
  const teacher = await requireTeacher(`/apps/${slug}`);
  return <AppRuntime slug={slug} userKey={teacher.id} />;
}
