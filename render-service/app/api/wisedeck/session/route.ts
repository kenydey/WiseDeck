import { NextRequest, NextResponse } from "next/server";

type PresentationData = Record<string, unknown>;

const store = new Map<string, { data: PresentationData; expires: number }>();
const TTL_MS = 60 * 60 * 1000;

function gc() {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (v.expires < now) store.delete(k);
  }
}

/** POST: register a presentation JSON for pdf-maker (WiseDeck bridge). */
export async function POST(req: NextRequest) {
  try {
    gc();
    const body = await req.json();
    const session_id = body.session_id as string | undefined;
    const presentation = body.presentation as PresentationData | undefined;
    if (!session_id || !presentation) {
      return NextResponse.json(
        { detail: "session_id and presentation required" },
        { status: 400 }
      );
    }
    store.set(session_id, { data: presentation, expires: Date.now() + TTL_MS });
    return NextResponse.json({ ok: true, session_id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}

/** GET: retrieve by session id (used by PdfMakerPage). */
export async function GET(req: NextRequest) {
  gc();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ detail: "id required" }, { status: 400 });
  }
  const row = store.get(id);
  if (!row || row.expires < Date.now()) {
    return NextResponse.json({ detail: "session not found" }, { status: 404 });
  }
  return NextResponse.json(row.data);
}
