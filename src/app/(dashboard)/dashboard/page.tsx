import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      <header className="flex items-center justify-end pt-4 pb-8">
        <Button size="sm" asChild>
          <Link href="/researchs/new">Criar Formulário</Link>
        </Button>
      </header>

      <section className="py-10 hidden">
        <p className="text-muted-foreground text-center">
          Você não possui nenhum formulário. Clique em “Criar formulário” para
          descobrir as necessidades e expectativas dos seus clientes!
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <Card className="relative">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Do you listen to Twice?</CardTitle>
              <Badge className="whitespace-nowrap w-fit bg-yellow-500 text-black">
                Em Andamento
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm">Criado em: 31/08/2024</p>
            <p className="text-sm">Respostas: 23</p>
          </CardContent>

          <Link className="absolute inset-0" href="/researchs/ABC123" />
        </Card>

        <Card className="relative">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                Do you listen to NewJeans?
              </CardTitle>
              <Badge className="whitespace-nowrap w-fit bg-green-400 text-black">
                Encerrado
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm">Criado em: 31/08/2024</p>
            <p className="text-sm">Respostas: 23</p>
          </CardContent>

          <Link className="absolute inset-0" href="/researchs/ABC124" />
        </Card>
      </section>
    </>
  );
}
