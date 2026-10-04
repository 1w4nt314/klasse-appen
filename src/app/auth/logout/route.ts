import { NextResponse, type NextRequest } from "next/server";
import { endSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  // Et fremmed site må ikke kunne logge folk ud (CSRF). Ældre browsere uden
  // Sec-Fetch-Site får lov.
  if (request.headers.get("sec-fetch-site") === "cross-site")
    return new NextResponse("Forbidden", { status: 403 });
  await endSession();
  // Relativ adresse: bag Render-proxyen kender serveren kun sin interne
  // adresse (localhost:10000), så browseren må selv sætte domænet på.
  return new NextResponse(null, { status: 303, headers: { Location: "/" } });
}
