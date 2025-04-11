import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher(["/dashboard", "/researches(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);

  // Admin route check: if path starts with "/admin", enforce Admin role.
  if (url.pathname.startsWith("/admin")) {
    const { userId } = await auth();
        
    if (!userId) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    const user = await clerkClient.users.getUser(userId);
    if (user.privateMetadata.role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (isPrivateRoute(request)) {
    console.log("Private route accessed:", url.pathname);
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
