import { clerkMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);

  // Rota /admin: Apenas usuários com role "Admin" podem acessar
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
  
  // Rotas /dashboard e /researches: Necessitam que o usuário esteja logado
  if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/researches")) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  // Outras rotas (/dashboard, /researches e demais) são abertas para todos
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
