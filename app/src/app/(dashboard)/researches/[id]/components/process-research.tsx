"use client";

import { useServerAction } from "zsa-react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "~/components/ui/drawer";
import { useMediaQuery } from "~/hooks/use-media-query";
import { closeResearchAction } from "../actions";
import { toast } from "sonner";
import type { Research } from "iara-shared/database/schema";
import { Loader, CpuIcon } from "lucide-react";

type Props = {
	research: string;
	status: Research["status"];
};

export function ProcessResearch({ research, status }: Props) {
	const isDesktop = useMediaQuery("(min-width: 764px)");

	const { execute, isPending } = useServerAction(closeResearchAction, {
		onSuccess: () => {
			toast.success("Pesquisa processada.", {
				description:
					"Sua pesquisa foi processada, aguarde enquanto realizamos o processamento das respostas.",
			});
		},
	});

	return (
		<div className="w-full">

			{isDesktop ? (
				<Dialog>
					<DialogTrigger asChild>
						<Button
							size="sm"
							disabled={status !== "CREATED"}
							className="w-full gap-2 focus:hover-xl hover:shadow-xl transition-all text-white bg-green-500 hover:bg-green-600 dark:text-gray-900 shadow-md"
						>
							<CpuIcon className="size-4" />
							Processar
						</Button>
					</DialogTrigger>

					<DialogContent>
						<DialogHeader>
							<DialogTitle>Processar Pesquisa</DialogTitle>
						</DialogHeader>

						<DialogDescription>
							Você tem certeza de que deseja processar essa pesquisa? Caso
							processe, não poderá mais receber novas respostas.
						</DialogDescription>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" size="sm">
									Não processar
								</Button>
							</DialogClose>
							<Button
								size="sm"
								onClick={() => execute({ id: research })}
								disabled={status !== "CREATED" || isPending}
								className="min-w-[80px] w-full gap-2 focus:hover-xl hover:shadow-xl transition-all text-white bg-green-500 hover:bg-green-600 dark:text-gray-900 shadow-md"
							>
								{isPending ? (
									<>
										<span className="sr-only">Processando a pesquisa</span>
										<Loader className="size-4 animate-spin" />
									</>
								) : (
									"Processar"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			) : (
				<Drawer>
					<DrawerTrigger asChild>
						<Button
							size="sm"
							variant="destructive"
							disabled={status !== "CREATED"}
							className="w-full order-1 gap-2 focus:hover-xl hover:shadow-xl transition-all text-white bg-green-500 hover:bg-green-600 dark:text-gray-900 shadow-md"
						>
							<CpuIcon className="size-4" />
							Processar
						</Button>
					</DrawerTrigger>

					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Processar Pesquisa</DrawerTitle>
							<DrawerDescription>
								Você tem certeza de que deseja processar essa pesquisa? Caso
								processe, não poderá mais receber novas respostas.
							</DrawerDescription>
						</DrawerHeader>

						<DrawerFooter className="gap-4">
							<DrawerClose className="w-full">
								<Button variant="outline" size="sm" className="w-full">
									Não processar
								</Button>
							</DrawerClose>

							<Button
								size="sm"
								onClick={() => execute({ id: research })}
								disabled={status !== "CREATED" || isPending}
								className="bg-green-500 hover:bg-green-600 dark:text-gray-900 shadow-md"
							>
								{isPending ? (
									<>
										<span className="sr-only">Processando a pesquisa</span>
										<Loader className="size-4 animate-spin" />
									</>
								) : (
									"Processar"
								)}
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			)}
		</div>
	);
}
