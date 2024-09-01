import type { ReactNode } from "react";
import { Logo } from "~/components/logo";
import { ToggleTheme } from "~/components/theme/toggle-theme";

export default function ResearchPublicPage({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <header>
        <div className="container h-20 flex justify-between items-center">
          <Logo className="w-10" />
        </div>
      </header>
      <main className="min-h-[calc(100dvh-160px)] w-full container">
        {children}
      </main>
      <footer>
        <div className="container flex h-20 items-center gap-2">
          <ToggleTheme />{" "}
          <p className="text-xs">&copy; iara {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  );
}
