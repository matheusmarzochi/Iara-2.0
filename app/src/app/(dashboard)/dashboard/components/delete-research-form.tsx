"use client";

import { LoaderIcon, Trash2Icon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { useMediaQuery } from "~/hooks/use-media-query";
import { deleteResearchAction } from "../actions";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import { useState } from "react";

type Props = {
  research: {
    id: string;
    title: string;
  };
};

export function DeleteResearchForm({ research }: Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isOpen, setIsOpen] = useState(false);

  const { execute, isPending } = useServerAction(deleteResearchAction, {
    onSuccess: () => {
      toast.success("Pesquisa deletada.", {
        description: "Sua pesquisa foi deletada.",
      });

      setIsOpen(false);
    },
  });

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
        <DialogTrigger asChild>
          <Button
            className="size-8 p-0 relative z-10"
            size="icon"
            variant="ghost"
          >
            <span className="sr-only">Excluir a pesquisa {research.title}</span>
            <Trash2Icon className="size-4 text-destructive-foreground" />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir a pesquisa {research.title}</DialogTitle>
          </DialogHeader>
          <p>
            Você está excluindo a pesquisa {research.title}, essa ação não
            poderá ser desfeita, tem certeza que deseja excluir?
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm" variant="outline" type="button">
                Não excluir
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              type="submit"
              size="sm"
              className="lg:w-52"
              onClick={() => execute({ id: research.id })}
            >
              {isPending ? (
                <>
                  <span className="sr-only">
                    Excluindo a pesquisa {research.title}
                  </span>
                  <LoaderIcon className="size-4 animate-spin" />
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          className="size-8 p-0 relative z-10"
          size="icon"
          variant="ghost"
        >
          <span className="sr-only">Excluir a pesquisa {research.title}</span>
          <Trash2Icon className="size-4 text-destructive-foreground" />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Excluir a pesquisa {research.title}</DrawerTitle>
        </DrawerHeader>
        <p className="px-6">
          Você está excluindo a pesquisa {research.title}, essa ação não poderá
          ser desfeita, tem certeza que deseja excluir?
        </p>
        <DrawerFooter>
          <Button
            variant="destructive"
            type="submit"
            size="sm"
            onClick={() => execute({ id: research.id })}
          >
            {isPending ? (
              <>
                <span className="sr-only">
                  Excluindo a pesquisa {research.title}
                </span>
                <LoaderIcon className="size-4 animate-spin" />
              </>
            ) : (
              "Excluir"
            )}
          </Button>

          <DrawerClose asChild>
            <Button
              className="w-full"
              size="sm"
              variant="outline"
              type="button"
            >
              Não excluir
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
