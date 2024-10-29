import Link from "next/link";
import type { ReactNode } from "react";
import { AuthButton } from "~/components/auth-button";
import { Logo } from "~/components/logo";
import { ToggleTheme } from "~/components/theme/toggle-theme";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<header>
				<div className="container h-20 flex justify-between items-center">
					<Link href="/">
						<Logo className="w-10" />
					</Link>
					<AuthButton />
				</div>
			</header>
			<main className="min-h-[calc(100dvh-160px)] w-full">{children}</main>
			<footer>
				<div className="container flex h-20 items-center gap-2">
					<ToggleTheme />{" "}
					<p className="text-xs">&copy; iara {new Date().getFullYear()}</p>
				</div>
			</footer>
		</>
	);
}
