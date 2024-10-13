"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { LaptopIcon } from "@radix-ui/react-icons";

export function ToggleTheme() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-8 p-0">
          <SunIcon className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute size-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar Tema</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => setTheme("light")}
        >
          <SunIcon className="size-4" /> Claro
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => setTheme("dark")}
        >
          <MoonIcon className="size-4" /> Escuro
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => setTheme("system")}
        >
          <LaptopIcon className="size-4" /> Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
