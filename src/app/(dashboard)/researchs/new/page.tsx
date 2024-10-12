import { Button } from "~/components/ui/button";
import { CreateResearchForm } from "./components/create-research-form";

export default function CreateResearchPage() {
  return (
    <>
      <header className="pt-4 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold leading-tight">Formulário</h2>
          <Button size="sm" variant="outline">
            Preview
          </Button>
        </div>

        <small className="text-muted-foreground inline-block">
          Você pode personalizar cada pergunta e escolher entre perguntas
          abertas ou de múltipla escolha.
        </small>
      </header>

      <CreateResearchForm />
    </>
  );
}
