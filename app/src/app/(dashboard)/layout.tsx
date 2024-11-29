import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "~/components/logo";
import { ToggleTheme } from "~/components/theme/toggle-theme";

export default function DashboarLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-[#E0F2FE] dark:bg-sky-900">
        <div className="container h-20 flex justify-between items-center">
          <Link href="/dashboard">
            <Logo className="w-10" />
          </Link>

          <div className="flex gap-2">
            <UserButton
              appearance={{
                elements: { userButtonOuterIdentifier: "text-foreground" },
              }}
              showName
            />

            <ToggleTheme
              variant="ghost"
              className="rounded-full hover:bg-transparent"
            />
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100dvh-160px)] w-full container py-10">
        {children}
      </main>
    </>
  );
}
