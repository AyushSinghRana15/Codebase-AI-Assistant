import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;
const BACKEND_KEY = process.env.BACKEND_API_KEY;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(req, path, "GET");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(req, path, "PUT");
}

async function proxyRequest(req: NextRequest, path: string[], method: string) {
  try {
    const queryString = req.nextUrl.searchParams.toString();
    const url = `${BACKEND_URL}/auth/${path.join("/")}${queryString ? `?${queryString}` : ""}`;

    const headers: Record<string, string> = {};
    const authHeader = req.headers.get("authorization");
    if (authHeader) headers["Authorization"] = authHeader;
    if (BACKEND_KEY) headers["X-API-Key"] = BACKEND_KEY;

    const body = method === "PUT" ? await req.json() : undefined;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        method,
        headers: { ...headers, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
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
