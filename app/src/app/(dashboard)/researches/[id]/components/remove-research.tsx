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
import { removeResearchAction } from "../actions";
import { toast } from "sonner";
import type { Research } from "iara-shared/database/schema";
import { Loader, TrashIcon } from "lucide-react";

type Props = {
	research: string;
	status: Research["status"];
};

export function RemoveResearch({ research, status }: Props) {
	const isDesktop = useMediaQuery("(min-width: 764px)");

	const { execute, isPending } = useServerAction(removeResearchAction, {
		onSuccess: () => {
			toast.success("Pesquisa removida.", {
				description:
					"Sua pesquisa foi removida com sucesso.",
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
                            variant="outline"
							className="w-full gap-2 focus:hover-xl hover:shadow-xl transition-all text-red-500 border-red-500 bg-[#F8FAFC] dark:bg-sky-900 dark:hover:bg-sky-800 hover:text-red-500 shadow-md"
						>
							<TrashIcon className="size-4" />
							Remover
						</Button>
					</DialogTrigger>

					<DialogContent>
						<DialogHeader>
							<DialogTitle>Remover Pesquisa</DialogTitle>
						</DialogHeader>

						<DialogDescription>
							Você tem certeza de que deseja remover essa pesquisa? Esta ação não pode ser desfeita.
						</DialogDescription>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline" size="sm">
									Cancelar
								</Button>
							</DialogClose>
							<Button
								size="sm"
								variant="destructive"
								onClick={() => execute({ id: research })}
								disabled={isPending}
								className="w-full"
							>
								{isPending ? (
									<>
										<span className="sr-only">Removendo a pesquisa</span>
										<Loader className="size-4 animate-spin" />
									</>
								) : (
									"Remover"
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
                            variant="outline"
							className="w-full order-1 gap-2 focus:hover-xl hover:shadow-xl transition-all text-red-500 border-red-500 bg-[#F8FAFC] dark:bg-sky-900 dark:hover:bg-sky-800 hover:text-red-500 shadow-md"
						>
							<TrashIcon className="size-4" />
							Remover
						</Button>
					</DrawerTrigger>

					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Remover Pesquisa</DrawerTitle>
							<DrawerDescription>
								Você tem certeza de que deseja remover essa pesquisa? Esta ação não pode ser desfeita.
							</DrawerDescription>
						</DrawerHeader>

						<DrawerFooter className="gap-4">
							<DrawerClose className="w-full">
								<Button variant="outline" size="sm" className="w-full">
									Cancelar
								</Button>
							</DrawerClose>

							<Button
								size="sm"
								variant="destructive"
								onClick={() => execute({ id: research })}
								disabled={isPending}
								className="w-full"
							>
								{isPending ? (
									<>
										<span className="sr-only">Removendo a pesquisa</span>
										<Loader className="size-4 animate-spin" />
									</>
								) : (
									"Remover"
								)}
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			)}
		</div>
	);
}
