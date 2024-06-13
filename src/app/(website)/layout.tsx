import { ReactNode } from "react";
import { ToggleTheme } from "~/components/theme/toggle-theme";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="min-h-[calc(100dvh-80px)] w-full">{children}</main>
      <footer>
        <div className="container flex h-20 items-center gap-2">
          <ToggleTheme />{" "}
          <p className="text-xs">&copy; iara {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  );
}
