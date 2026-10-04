import { NextResponse } from "next/server";
import { endSession } from "@/lib/session";

export async function POST() {
  await endSession();
  // Relativ adresse: bag Render-proxyen kender serveren kun sin interne
  // adresse (localhost:10000), så browseren må selv sætte domænet på.
  return new NextResponse(null, { status: 303, headers: { Location: "/" } });
}
