"use server"

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

