import { NextRequest, NextResponse } from "next/server";
import { trackVisit, getVisitorCount } from "@/services/analytics/visitors";

export async function GET() {
  try {
    const count = await getVisitorCount();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const page = (body as { page?: string }).page || "/";
    await trackVisit(page);
    return NextResponse.json({ tracked: true });
  } catch {
    return NextResponse.json({ tracked: false });
  }
}
