import { Button } from "~/components/ui/button";
import { CopyLinkForm } from "./components/copy-link-form";
import Link from "next/link";
import { CloseResearch } from "./components/close-research";

export default function ResearchPage() {
  return (
    <div className="relative">
      <header className="pt-4 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold leading-tight">
            Pesquisa de Sastifação F4P
          </h2>
        </div>
      </header>

      <section className="space-y-6">
        <p>Avaliação do Treinamento Kanban (KMP I)</p>

        <div>
          <p>Criado em: 30/08/2024</p>
          <p>Respostas: 32</p>
        </div>

        <CopyLinkForm />
      </section>

      <CloseResearch />
    </div>
  );
}
