import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// We don't have cookies in Sprint 1 because we use in-memory JWT storage, 
// so the middleware can't fully protect routes. 
// We will implement client-side route protection guards in Sprint 1 instead.
// For production (Sprint 2+), this middleware will read the HTTP-Only cookie.

export function middleware(request: NextRequest) {
  // Pass through for now. Client-side HOC or layout will check Zustand store.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
