"use client";

import { SignInButton, SignedIn, SignedOut, useSession } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";

export function AuthButton() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <Button size="sm" className="group gap-2">
            Entrar{" "}
            <MoveRightIcon className="h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <Button size="sm" className="group gap-2">
          <Link className="flex gap-2 items-center" href="/dashboard">
            Dashboard{" "}
            <MoveRightIcon className="h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </SignedIn>
    </>
  );
}
