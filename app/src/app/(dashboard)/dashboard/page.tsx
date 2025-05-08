import { auth } from "@clerk/nextjs/server";
import { count, desc, eq, isNull, and } from "iara-shared/node_modules/drizzle-orm";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Plus, Upload, List, PencilRuler, MailOpen, Search, Cog, CheckCircle } from "lucide-react"; // Added icons
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { db } from "iara-shared/database";
import {
  forms,
  type Research,
  researches,
  users,
} from "iara-shared/database/schema";
import { formatters, cn } from "~/lib/utils";
import { ResearchStatusBadge } from "~/components/research/researchStatusBadge";
import { StatusFilterSelect } from "~/components/status-filter-select";


const iconMap = { MailOpen, Cog, CheckCircle, Search, PencilRuler, List };

type StatusDetail = {
  value: Research["status"];
  label: string;
  iconName: keyof typeof iconMap;
};

type ResearchGroup = Record<
  Research["status"],
  Array<Pick<Research, "id" | "title" | "createdAt" | "status"> & { replies: number }>
>;

const statusDetails: Readonly<Array<StatusDetail>> = [
  { value: "OPENED", label: "Aberta", iconName: "MailOpen" },
  { value: "PROCESSING", label: "Em Processamento", iconName: "Cog" },
  { value: "FINISHED", label: "Encerrado", iconName: "CheckCircle" },
  { value: "ANALYSIS", label: "Em Análise", iconName: "Search" },
] as const;

async function getUserResearchs(status?: Research["status"]) {
  const { userId } = auth();

  const filterStatus = status ?? "OPENED";

  const user = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, userId as string))

  const whereConditions = [
    eq(researches.userId, user),
    isNull(researches.deletedAt),
    eq(researches.status, filterStatus),
  ];

  const researchs = await db
    .select({
      id: researches.id,
      title: researches.title,
      status: researches.status,
      createdAt: researches.createdAt,
      replies: count(forms.id),
    })
    .from(researches)
    .leftJoin(forms, eq(forms.researchId, researches.id))
    .where(and(...whereConditions))
    .orderBy(desc(researches.createdAt))
    .groupBy(researches.id);

  return researchs as Array<
    Pick<Research, "id" | "title" | "status" | "createdAt"> & { replies: number }
  >;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { status?: Research["status"] };
}) {

  const currentStatus = searchParams?.status ?? "OPENED";

  const researchs = await getUserResearchs(currentStatus);

  const researchStatusTitle = (status: Research["status"]) =>
    ({
      CREATED: <h3 className="font-bold text-2xl">Em Andamento</h3>,
      OPENED: <h3 className="font-bold text-2xl">Aberta</h3>,
      ANALYSIS: <h3 className="font-bold text-2xl">Em Analise</h3>,
      PROCESSING: <h3 className="font-bold text-2xl">Em Processamento</h3>,
      FINISHED: <h3 className="font-bold text-2xl">Encerrado</h3>,
    })[status];

  const allUserResearchs = await db
    .select({ status: researches.status })
    .from(researches)
    .leftJoin(users, eq(users.id, researches.userId))
    .where(and(
      eq(users.clerkId, auth().userId as string),
      isNull(researches.deletedAt)
    ));

  const countsByStatus = allUserResearchs.reduce((acc, { status }) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<Research["status"], number>);


  const statusDetailsWithCounts = statusDetails.map(detail => ({
    ...detail,
    count: countsByStatus[detail.value] ?? 0,
  }));

  const statusesToDisplay = researchs.length > 0 ? [currentStatus] : [];

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="w-64 hidden md:block pt-4">
        <nav className="flex flex-col gap-2 sticky top-4">
          <h2 className="text-lg font-semibold mb-2 px-4">Status</h2>

          {statusDetailsWithCounts.map(({ value, label, iconName, count }) => {
            const Icon = iconMap[iconName];

            const isActive = currentStatus === value;
            const href = `/dashboard?status=${value}`;
            return (
              <Link
                key={value}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-muted-foreground transition-colors hover:text-primary",
                  "dark:text-slate-400 dark:hover:text-slate-50",
                  isActive && "bg-muted text-primary font-semibold dark:bg-slate-800 dark:text-slate-50"
                )}
              >
                {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                <span className="flex flex-1 items-center justify-between">
                  <span>{label}</span>
                  
                  {count > 0 && (
                    <span className={cn(
                      "text-xs font-medium rounded-full px-2 py-0.5",
                      isActive
                        ? "bg-primary text-primary-foreground dark:bg-sky-500 dark:text-white"
                        : "bg-gray-200 text-muted-foreground dark:bg-slate-700 dark:text-slate-200"
                    )}>
                      {count}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">

        <section className="flex flex-col items-end md:items-start pt-4 md:pt-0 pb-8 gap-6">
          <div className="flex gap-4">
            <Button size="sm" className="order-1 md:order-2" asChild>
              <Link href="/researches/new">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Criar Pesquisa
                </span>
              </Link>
            </Button>
            <Button size="sm" className="order-1 md:order-2" asChild>
              <Link href="/researches/upload">
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Data
                </span>
              </Link>
            </Button>
          </div>

          {researchs.length <= 0 ? (
            <section className="order-2 md:order-1">
              <p className="text-muted-foreground">
                Você não possui nenhuma pesquisa. Clique em “Criar pesquisa”
                para descobrir as necessidades e expectativas dos seus clientes!
              </p>
            </section>
          ) : null}
        </section>

        {/* Add Select Filter for Mobile */}
        <div className="md:hidden mb-6 pt-4">
          <h2 className="text-lg font-semibold mb-2">Filtrar Status</h2>
          <StatusFilterSelect currentStatus={currentStatus} statuses={statusDetailsWithCounts} />
        </div>

        {/* Main Research Display */}
        <section className="space-y-10">
          {statusesToDisplay.map((status) => {
              const researchesInStatus = researchs;

              return (
                <div key={status} className="space-y-6">
                  {researchStatusTitle(status)}

                  <div className="w-full max-w-full flex flex-col gap-6 md:grid lg:grid-cols-2 overflow-x-auto">
                    {researchesInStatus.map((research) => {
                      const researchURL =
                        status === "FINISHED"
                          ? `/researches/${research.id}/reports`
                          : `/researches/${research.id}`;

                      return (
                        <Card
                          key={research.id}
                          className="relative w-full md:max-w-[600px] shadow-md focus:hover-xl hover:shadow-xl transition-all bg-[#F8FAFC] dark:bg-sky-900 dark:border-sky-900"
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl truncate max-w-[10rem] md:max-w-full">
                                {research.title}
                              </CardTitle>
                              <ResearchStatusBadge status={research.status} />
                            </div>
                          </CardHeader>

                          <CardContent className="flex items-end justify-between">
                            <div>
                              <p className="text-sm">
                                Criado em: {formatters.date(research.createdAt)}
                              </p>
                              <p className="text-sm">
                                Respostas: {research.replies}
                              </p>
                            </div>
                          </CardContent>

                          <Link className="absolute inset-0" href={researchURL} />
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          {researchs.length === 0 && (
            <p className="text-muted-foreground">Nenhuma pesquisa encontrada para o status "{statusDetails.find(s => s.value === currentStatus)?.label ?? currentStatus}".</p>
          )}
        </section>
      </main>
    </div>
  );
}
