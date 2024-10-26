import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function ThanksPage() {
	return (
		<section className="w-full h-[calc(100dvh-160px)] text-balance flex flex-col justify-center items-center text-center">
			<div className="max-w-md flex flex-col gap-6 items-center">
				<h2 className="text-lg">
					Muito Obrigado por responder a nossa pesquisa. Ficamos felizes com a
					sua colaboração!
				</h2>

				<Button variant="outline" size="sm" className="w-[160px]" asChild>
					<Link href="/">Voltar</Link>
				</Button>
			</div>
		</section>
	);
}
