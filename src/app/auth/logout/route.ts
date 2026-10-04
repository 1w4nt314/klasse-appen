import { NextResponse, type NextRequest } from "next/server";
import { endSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  // Kun fra sitet selv — et fremmed site (eller subdomæne) må ikke kunne logge
  // folk ud (CSRF). Ældre browsere uden Sec-Fetch-Site får lov.
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none")
    return new NextResponse("Forbidden", { status: 403 });
  await endSession();
  // Relativ adresse: bag Render-proxyen kender serveren kun sin interne
  // adresse (localhost:10000), så browseren må selv sætte domænet på.
  return new NextResponse(null, { status: 303, headers: { Location: "/" } });
}
