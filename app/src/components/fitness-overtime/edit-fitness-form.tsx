"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { updateFitness } from "../../app/(dashboard)/fitness/actions/fitness-actions";
import { useRouter } from "next/navigation";

type Research = { id: string; title: string; formsCount?: number; createdAt?: string };

type Props = {
  fitness: {
    id: string;
    name: string;
    researches?: string[];
  };
  researches: Research[];
  onSaved?: () => void;
};

export default function EditFitnessForm({ fitness, researches, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(fitness.name);
  const [loading, setLoading] = useState(false);
  const [selectedResearches, setSelectedResearches] = useState<string[]>(fitness.researches ?? []);
  const [order, setOrder] = useState<"createdAt" | "alpha">("createdAt");
  const router = useRouter();

  function handleResearchChange(id: string) {
    setSelectedResearches(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  }

  function getOrderedResearches() {
    if (order === "alpha") {
      return [...researches].sort((a, b) => a.title.localeCompare(b.title));
    }
    return [...researches].sort((a, b) =>
      (a.createdAt && b.createdAt)
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : 0
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await updateFitness({ id: fitness.id, name, researches: selectedResearches });
    setLoading(false);
    setOpen(false);
    if (onSaved) {
      onSaved();
    } else {
      router.refresh();
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" variant="outline">
        Editar
      </Button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-sky-900 rounded shadow space-y-4 w-full max-w-md sm:min-w-[480px] sm:p-8 p-4"
          >
            <h3 className="text-lg font-semibold">Editar Fitness</h3>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Nome"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <div>
              <span className="block mb-1 font-medium">Pesquisas</span>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  size="sm"
                  variant={order === "createdAt" ? "default" : "outline"}
                  onClick={() => setOrder("createdAt")}
                >
                  Ordem Cronológico
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={order === "alpha" ? "default" : "outline"}
                  onClick={() => setOrder("alpha")}
                >
                  Ordem A-Z
                </Button>
              </div>
              <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white dark:bg-sky-800">
                {researches.length === 0 && (
                  <span className="text-xs text-muted-foreground">Nenhuma pesquisa encontrada.</span>
                )}
                {getOrderedResearches().map(r => (
                  <label key={r.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={selectedResearches.includes(r.id)}
                      onChange={() => handleResearchChange(r.id)}
                    />
                    <span>
                      {r.title}
                      {typeof r.formsCount === "number" && (
                        <span className="ml-2 text-xs text-muted-foreground">({r.formsCount} respostas)</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
