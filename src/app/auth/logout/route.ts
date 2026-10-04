import { NextResponse, type NextRequest } from "next/server";
import { endSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  await endSession();
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url, { status: 303 });
}
