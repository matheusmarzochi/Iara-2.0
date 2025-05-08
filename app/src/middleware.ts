import { clerkMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);

  // SessionId cookie logic
  const sessionCookieName = "sessionId";
  let sessionId = request.cookies.get(sessionCookieName)?.value;
  let response: NextResponse;

  // Default to NextResponse.next(), will be replaced if redirect is needed
  response = NextResponse.next();

  if (!sessionId) {
    sessionId = generateSessionId();
    response.cookies.set(sessionCookieName, sessionId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      // secure: true, // Uncomment if using HTTPS
    });
  }

  // Rota /admin: Apenas usuários com role "Admin" podem acessar
  if (url.pathname.startsWith("/admin")) {
    const { userId } = await auth();
    if (!userId) {
      response = NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      const user = await clerkClient.users.getUser(userId);
      if (user.privateMetadata.role !== "Admin") {
        response = NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }
  
  // Rotas /dashboard e /researches: Necessitam que o usuário esteja logado
  if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/researches")) {
    const { userId } = await auth();
    if (!userId) {
      response = NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  // Sempre retorna a response (com ou sem cookie novo)
  return response;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
