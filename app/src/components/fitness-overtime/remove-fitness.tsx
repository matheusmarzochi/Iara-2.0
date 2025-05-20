"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "lucide-react";
import { removeFitness } from "../../app/(dashboard)/fitness/actions/fitness-actions";

export default function RemoveFitness({ fitnessId }: { fitnessId: string }) {
  const [pending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  const handleRemove = () => {
    startTransition(async () => {
      await removeFitness(fitnessId);
      router.push("/fitness");
    });
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setConfirm(true)}
        title="Remover Fitness"
      >
        <TrashIcon className="size-4" />
      </Button>
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-sky-900 rounded-lg shadow-lg p-6 min-w-[320px] flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Remover Fitness</span>
            <span className="text-sm text-muted-foreground mb-4">
              Tem certeza que deseja remover este Fitness? Esta ação não poderá ser desfeita.
            </span>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={pending}
                onClick={handleRemove}
              >
                Sim, remover
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => setConfirm(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
