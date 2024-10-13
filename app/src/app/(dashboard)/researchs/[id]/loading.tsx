import { CopyLinkForm } from "./components/copy-link-form";
import { CloseResearch } from "./components/close-research";
import { Skeleton } from "~/components/ui/skeleton";

export default function ResearchPage() {
  return (
    <div className="relative">
      <header className="pt-4 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-60 h-10" />
        </div>
      </header>

      <section className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-4 w-60" />
        </div>

        <div>
          <p className="flex gap-2 items-center">
            Criado em: <Skeleton className="h-5 w-36" />
          </p>
          <p className="flex gap-2 items-center">
            Respostas: <Skeleton className="h-5 w-10" />
          </p>
        </div>

        <CopyLinkForm />
      </section>

      <CloseResearch />
    </div>
  );
}
