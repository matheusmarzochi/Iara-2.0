import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher(["/dashboard", "/researches(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);

  if (url.pathname.endsWith("/researches")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPrivateRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
