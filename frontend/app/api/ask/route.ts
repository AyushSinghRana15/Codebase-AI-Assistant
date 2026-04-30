import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;
const BACKEND_KEY = process.env.BACKEND_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.query || typeof body.query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (body.query.length > 1000) {
      return NextResponse.json({ error: "Query too long" }, { status: 400 });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (BACKEND_KEY) headers["X-API-Key"] = BACKEND_KEY;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify({ query: body.query, top_k: body.top_k ?? 5 }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const err = await response.text();
        return NextResponse.json({ error: err }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchErr: unknown) {
      clearTimeout(timeout);
      if (fetchErr instanceof Error && fetchErr.name === "AbortError") {
        return NextResponse.json({ error: "Backend timeout" }, { status: 504 });
      }
      throw fetchErr;
    }
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
