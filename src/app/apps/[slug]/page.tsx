import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { apps, getApp } from "@/apps/registry";
import { AppRuntime } from "@/apps/runtime";

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/apps/[slug]">): Promise<Metadata> {
  const app = getApp((await params).slug);
  return app ? { title: app.name, description: app.tagline } : {};
}

export default async function AppPage({ params }: PageProps<"/apps/[slug]">) {
  const { slug } = await params;
  if (!getApp(slug)) notFound();
  return <AppRuntime slug={slug} />;
}
