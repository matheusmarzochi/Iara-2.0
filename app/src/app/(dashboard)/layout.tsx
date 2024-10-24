import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "~/components/logo";
import { ToggleTheme } from "~/components/theme/toggle-theme";

export default function DashboarLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<header className="bg-[#E0F2FE] dark:bg-[#0C4A6E]">
				<div className="container h-20 flex justify-between items-center">
					<Link href="/">
						<Logo className="w-10" />
					</Link>

					<div>
						<UserButton
							appearance={{
								elements: { userButtonOuterIdentifier: "text-foreground" },
							}}
							showName
						/>
					</div>
				</div>
			</header>

			<main className="min-h-[calc(100dvh-160px)] w-full container py-10">
				{children}
			</main>

			<footer>
				<div className="container h-20 flex items-center">
					<ToggleTheme />
				</div>
			</footer>
		</>
	);
}
