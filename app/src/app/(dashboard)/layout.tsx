"use client";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "~/components/logo";
import { ToggleTheme } from "~/components/theme/toggle-theme";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // ícones para o botão sanduíche

export default function DashboarLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="bg-[#E0F2FE] dark:bg-sky-900 relative">
        <div className="container h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Botão sanduíche mobile - movido para a esquerda do Logo */}
            <button
              className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400/60"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label={mobileNavOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileNavOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <Link href="/dashboard">
              <Logo className="w-10" />
            </Link>
            {/* Navegação desktop */}
            <nav className="flex gap-2 ml-4 hidden md:flex">
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors duration-200 text-sky-700 dark:text-sky-300 hover:bg-sky-300 dark:hover:bg-sky-700 hover:text-sky-900 dark:hover:text-white ${
                  pathname.startsWith("/dashboard")
                    ? "bg-sky-200 dark:bg-sky-800/60 text-sky-900 dark:text-white shadow-sm"
                    : ""
                }`}
              >
                Pesquisas
              </Link>
              <Link
                href="/fitness"
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors duration-200 text-sky-700 dark:text-sky-300 hover:bg-sky-300 dark:hover:bg-sky-700 hover:text-sky-900 dark:hover:text-white ${
                  pathname.startsWith("/fitness")
                    ? "bg-sky-200 dark:bg-sky-800/60 text-sky-900 dark:text-white shadow-sm"
                    : ""
                }`}
              >
                Fitness Overtime
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
        {/* Menu mobile */}
        {mobileNavOpen && (
          <nav className="md:hidden absolute left-0 top-20 w-full z-30 bg-[#E0F2FE] dark:bg-sky-900 border-t border-sky-200 dark:border-sky-800 px-4 py-4 flex flex-col gap-2 shadow-lg">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/60 text-sky-700 dark:text-sky-300 hover:bg-sky-300 dark:hover:bg-sky-700 hover:text-sky-900 dark:hover:text-white ${
                pathname.startsWith("/dashboard")
                  ? "bg-sky-200 dark:bg-sky-800/60 text-sky-900 dark:text-white shadow-sm"
                  : ""
              }`}
              onClick={() => setMobileNavOpen(false)}
            >
              Pesquisas
            </Link>
            <Link
              href="/fitness"
              className={`px-3 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/60 text-sky-700 dark:text-sky-300 hover:bg-sky-300 dark:hover:bg-sky-700 hover:text-sky-900 dark:hover:text-white ${
                pathname.startsWith("/fitness")
                  ? "bg-sky-200 dark:bg-sky-800/60 text-sky-900 dark:text-white shadow-sm"
                  : ""
              }`}
              onClick={() => setMobileNavOpen(false)}
            >
              Fitness Overtime
            </Link>
          </nav>
        )}
      </header>

      <main className="min-h-[calc(100dvh-160px)] w-full md:container px-2 py-0 md:py-10">
        {children}
      </main>
    </>
  );
}
