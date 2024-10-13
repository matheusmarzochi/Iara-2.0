"use client";

import Link from "next/link";
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
import type { Research } from "~/database/schema";
import { Loader } from "lucide-react";

type Props = {
  research: string;
  status: Research["status"];
};

export function CloseResearch({ research, status }: Props) {
  const isDesktop = useMediaQuery("(min-width: 764px)");

  const { execute, isPending } = useServerAction(closeResearchAction, {
    onSuccess: () => {
      toast.success("Pesquisa encerrada.", {
        description:
          "Sua pesquisa foi encerrada, aguarde enquanto realizamos o processamento das respostas.",
      });
    },
  });

  return (
    <div className="fixed bottom-4 w-full left-0">
      <div className="container w-full flex [&>*]:w-full gap-4">
        <Button size="sm" variant="outline" asChild>
          <Link href="/dashboard">Voltar</Link>
        </Button>

        {isDesktop ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                disabled={status !== "CREATED"}
              >
                Encerrar Pesquisa
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Encerrar Pesquisa</DialogTitle>
              </DialogHeader>

              <DialogDescription>
                Você tem certeza de que deseja encerrar essa pesquisa? Caso
                encerre, não poderá mais receber novas respostas.
              </DialogDescription>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    Não encerrar
                  </Button>
                </DialogClose>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => execute({ id: research })}
                  disabled={status !== "CREATED" || isPending}
                  className="min-w-[80px]"
                >
                  {isPending ? (
                    <>
                      <span className="sr-only">Encerrando a pesquisa</span>
                      <Loader className="size-4 animate-spin" />
                    </>
                  ) : (
                    "Encerrar"
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
              >
                Encerrar Pesquisa
              </Button>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Encerrar Pesquisa</DrawerTitle>
                <DrawerDescription>
                  Você tem certeza de que deseja encerrar essa pesquisa? Caso
                  encerre, não poderá mais receber novas respostas.
                </DrawerDescription>
              </DrawerHeader>

              <DrawerFooter className="gap-4">
                <DrawerClose className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    Não encerrar
                  </Button>
                </DrawerClose>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => execute({ id: research })}
                  disabled={status !== "CREATED" || isPending}
                >
                  {isPending ? (
                    <>
                      <span className="sr-only">Encerrando a pesquisa</span>
                      <Loader className="size-4 animate-spin" />
                    </>
                  ) : (
                    "Encerrar"
                  )}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}
