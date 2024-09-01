import { ResearchForm } from "./components/research-form";

export default function ResearchPage() {
  return (
    <section className="space-y-6">
      <header className="pt-4 pb-6 space-y-4">
        <h2 className="text-3xl font-semibold leading-tight">Formulário</h2>
        <p className="text-sm">Descrição do Formulário</p>
      </header>

      <small className="inline-block text-muted-foreground italic">
        Os campos com * são obrigatórios
      </small>

      <ResearchForm />
    </section>
  );
}
