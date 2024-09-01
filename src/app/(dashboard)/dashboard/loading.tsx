import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="container">
      <header className="flex items-center justify-end pt-4 pb-8">
        <Button size="sm" asChild>
          <Link href="/research/new">Criar Formulário</Link>
        </Button>
      </header>

      <section className="flex flex-col gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  <Skeleton className="h-4 w-32" />
                </CardTitle>
                <Skeleton className="h-4 w-20 rounded-lg" />
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
