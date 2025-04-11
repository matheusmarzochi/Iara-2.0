"use server"

import download from "iara-shared/storage/download";
import { db } from "iara-shared/database/"; // existing import
import { researches } from "iara-shared/database/schema"; // new import
import { eq } from "iara-shared/node_modules/drizzle-orm"; // new import

// Helper to slugify a string
const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    try {
        // load research using drizzle (drizzle ORM)
        const [researchData] = await db.select().from(researches).where(eq(researches.id, params.id));
        if (!researchData || !researchData.uploadPath) return new Response("Research not found", { status: 404 });
        
        // New: generate filename based on slug of research title and extension from uploadPath
        const slug = slugify(researchData.title);
        const ext = researchData.uploadPath.includes('.') ? researchData.uploadPath.substring(researchData.uploadPath.lastIndexOf('.')) : '';
        const filename = `${slug}${ext}`;
        
        // use uploadPath from research
        const fileContent = await download(researchData.uploadPath);
        return new Response(fileContent, {
            headers: {
                "Content-Disposition": `attachment; filename=${filename}`
            }
        });
    } catch (error) {
        return new Response("Error downloading file", { status: 500 });
    }
}
