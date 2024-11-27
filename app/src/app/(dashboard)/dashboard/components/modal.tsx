import type { DialogProps } from "@radix-ui/react-dialog";
import { StatusButton } from "~/components/status-button";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { useMediaQuery } from "~/hooks/use-media-query";

export function ConfirmDialog({
  open,
  onOpenChange,
  isPending = false,
}: Pick<DialogProps, "onOpenChange" | "open"> & { isPending: boolean }) {
  const formId = "update-research";
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Formulário</DialogTitle>
          </DialogHeader>
          <p>
            Este formulário já está sendo respondido. As respostas já
            preenchidas não poderão ser alteradas e serão mantidas como estão.
          </p>
          <DialogFooter>
            <DialogClose>
              <Button size="sm" variant="outline" type="button">
                Voltar
              </Button>
            </DialogClose>
            <StatusButton
              form={formId}
              isPending={isPending}
              type="submit"
              size="sm"
              className="lg:w-52"
            >
              Confirmar Edição
            </StatusButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Alterar Formulário</DrawerTitle>
        </DrawerHeader>
        <p className="px-6">
          Este formulário já está sendo respondido. As respostas já preenchidas
          não poderão ser alteradas e serão mantidas como estão.
        </p>
        <DrawerFooter>
          <StatusButton
            form={formId}
            isPending={isPending}
            type="submit"
            size="sm"
            className="lg:w-52"
          >
            Confirmar Edição
          </StatusButton>

          <DrawerClose>
            <Button
              className="w-full"
              size="sm"
              variant="outline"
              type="button"
            >
              Voltar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
