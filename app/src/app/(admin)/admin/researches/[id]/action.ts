"use server"
import { db } from "iara-shared/database";
import { and, eq } from "iara-shared/node_modules/drizzle-orm";
import { producer } from '~/queue/research'
import { researches } from "iara-shared/database/schema";
import download from "iara-shared/storage/download";

export async function downloadAction({ researchUploadPath }: { researchUploadPath: string }): Promise<Response> {
    try {
        const fileContent = await download(researchUploadPath);
        return new Response(fileContent, {
            headers: {
                "Content-Disposition": "attachment; filename=file"
            }
        });
    } catch (error) {
        return new Response("Error downloading file", { status: 500 });
    }
}

export async function processResearch(formData: FormData) {
    const researchId = formData.get("researchId") as string;
    
    try {
        await db
            .update(researches)
            .set({
                status: "PROCESSING",
                updatedAt: new Date(),
            })
            .where(eq(researches.id, researchId));
        
        await producer.send(researchId);
    } catch (error) {
        console.error("Error sending research to queue:", error);
        throw error;
    }
}


