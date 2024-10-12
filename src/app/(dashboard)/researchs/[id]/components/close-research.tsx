"use client";

import Link from "next/link";
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

// @todo adicionar action para encerrar pesquisa
export function CloseResearch() {
  const isDesktop = useMediaQuery("(min-width: 764px)");

  return (
    <div className="fixed bottom-4 w-full left-0">
      <div className="container w-full flex [&>*]:w-full gap-4">
        <Button size="sm" variant="outline" asChild>
          <Link href="/dashboard">Voltar</Link>
        </Button>

        {isDesktop ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="destructive">
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
                <DialogClose>
                  <Button variant="outline" size="sm">
                    Não encerrar
                  </Button>
                </DialogClose>
                <Button size="sm" variant="destructive">
                  Encerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="sm" variant="destructive">
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

                <Button size="sm" variant="destructive">
                  Encerrar
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}
