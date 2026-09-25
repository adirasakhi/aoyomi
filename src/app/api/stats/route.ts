import { NextResponse } from "next/server";
import { getRequestStats } from "@/lib/api/rate-limiter";

// Dev-only request monitor (PRD Phase 7). Never exposed in production.
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }
  return NextResponse.json(getRequestStats());
}
