import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;
const BACKEND_KEY = process.env.BACKEND_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const repoUrl = searchParams.get("repo_url");
    const branch = searchParams.get("branch");

    if (!repoUrl) {
      return NextResponse.json(
        { error: "repo_url is required" },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (BACKEND_KEY) headers["X-API-Key"] = BACKEND_KEY;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 240000); // 4 min timeout for cloning

    try {
      const response = await fetch(
        `${BACKEND_URL}/ingest/github?repo_url=${encodeURIComponent(repoUrl)}${
          branch ? `&branch=${encodeURIComponent(branch)}` : ""
        }`,
        {
          method: "POST",
          headers,
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (fetchErr: unknown) {
      clearTimeout(timeout);
      if (fetchErr instanceof Error && fetchErr.name === "AbortError") {
        return NextResponse.json(
          { error: "GitHub clone timed out after 4 minutes" },
          { status: 504 }
        );
      }
      throw fetchErr;
    }
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
