import { db } from "iara-shared/database";
import { ResearchForm } from "../components/research-form";
import { notFound } from "next/navigation";
import { Logo } from "~/components/logo";
import QRCode from "react-qr-code";
import { headers } from "next/headers";
import { env } from "~/env";

type Props = {
    params: {
        id: string;
    };
};

async function getResearchForm(id: string) {
    return db.query.researches.findFirst({
        where: (research, { eq }) => eq(research.id, id),
        columns: {
            userId: false,
        },
        with: {
            questions: {
                with: {
                    categories: true,
                },
            },
        },
    });
}

export default async function ResearchQRCodePage({ params }: Props) {
    const research = await getResearchForm(params.id);
    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const fullUrl = `${protocol}://${env.NEXT_PUBLIC_APP_URL}/${research?.id}`;

    if (!research) {
        return notFound();
    }

    if (research.status !== "CREATED") {
        return (
            <section className="space-y-6 h-[calc(100dvh-160px)] flex items-center">
                <header className="pt-4 pb-6 space-y-4">
                    <h2 className="text-3xl font-semibold leading-tight text-muted-foreground">
                        Essa pesquisa foi encerrada.
                    </h2>
                </header>
            </section>
        );
    }

    return (
        <section className="flex flex-col justify-between items-center h-[calc(100dvh-180px)] container py-4 overflow-hidden">
            <header className="text-center mb-4 max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-semibold leading-tight mb-2">
                    {research.title}
                </h2>
                <p className="text-xs sm:text-sm">{research.description}</p>
            </header>

            <div className="flex items-center justify-center w-full max-w-full">
                <div className="relative bg-white rounded-lg shadow-md w-[80vw] max-w-[500px] h-auto aspect-square p-4">
                    <QRCode 
                        value={fullUrl}
                        style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
                        fgColor="#075985"
                        bgColor="#FFFFFF"
                        level="H"
                    />
                </div>
            </div>

            <div className="h-4"/>
        </section>
    );
}
