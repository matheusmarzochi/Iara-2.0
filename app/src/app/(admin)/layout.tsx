"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "~/components/logo";
import { ToggleTheme } from "~/components/theme/toggle-theme";
import { usePathname } from "next/navigation";

export default function DashboarLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <header className="bg-[#E0F2FE] dark:bg-sky-900">
        <div className="container h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Logo className="w-10" />
            </Link>
            {/* Navegação admin */}
            <nav className="flex gap-2 ml-4">
              <Link
                href="/admin/users"
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors duration-200 text-sky-700 dark:text-sky-300 hover:bg-sky-300 dark:hover:bg-sky-700 hover:text-sky-900 dark:hover:text-white ${
                  pathname.startsWith("/admin/users")
                    ? "bg-sky-200 dark:bg-sky-800/60 text-sky-900 dark:text-white shadow-sm"
                    : ""
                }`}
              >
                Usuários
              </Link>
              <Link
                href="/admin/researches"
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors duration-200 text-sky-700 dark:text-sky-300 hover:bg-sky-300 dark:hover:bg-sky-700 hover:text-sky-900 dark:hover:text-white ${
                  pathname.startsWith("/admin/researches")
                    ? "bg-sky-200 dark:bg-sky-800/60 text-sky-900 dark:text-white shadow-sm"
                    : ""
                }`}
              >
                Pesquisas
              </Link>
              <Link
                href="/admin/fitness"
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors duration-200 text-sky-700 dark:text-sky-300 hover:bg-sky-300 dark:hover:bg-sky-700 hover:text-sky-900 dark:hover:text-white ${
                  pathname.startsWith("/admin/fitness")
                    ? "bg-sky-200 dark:bg-sky-800/60 text-sky-900 dark:text-white shadow-sm"
                    : ""
                }`}
              >
                Fitness Over time
              </Link>
            </nav>
          </div>
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

      <main className="min-h-[calc(100dvh-160px)] w-full md:container px-2 py-10">
        {children}
      </main>
    </>
  );
}
