'use server';

import { writeFile, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import os from 'node:os';
import { db } from "iara-shared/database";
import { eq } from "iara-shared/node_modules/drizzle-orm";
import { researches, users } from "iara-shared/database/schema";
import { auth } from "@clerk/nextjs/server";
import upload from "iara-shared/storage/upload";

export async function uploadResearchFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { 
        success: false, 
        error: 'No file provided' 
      };
    }

    // Check if file is a spreadsheet
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
    if (!validTypes.includes(file.type)) {
      return { 
        success: false, 
        error: 'Invalid file type. Please upload a valid spreadsheet (.xlsx, .xls or .csv).' 
      };
    }

    // Get current user
    const { userId } = await auth();
    const user = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkId, userId as string))
        .then(result => result[0]);

    // Create research record in database
    const researchName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension for name
    const [newResearch] = await db.insert(researches)
      .values({
        title: researchName,
        description: "Research file upload",
        userId: user.id,
        status: "ANALYSIS",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: researches.id });

    const researchId = newResearch.id;
    
    // Get file extension
    const fileExtension = file.name.split('.').pop() || 'xlsx';
    
    // Use system temporary directory with a unique file name
    const tmpDir = os.tmpdir();
    const filePath = join(tmpDir, `upload.${researchId}-${Date.now()}.${fileExtension}`);

    // Convert file to buffer and write to temporary directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Upload file to minio
    const objectName = `researches/${researchId}/upload.${fileExtension}`;
    await upload(filePath, objectName);
    
    // Remove the temporary file
    await unlink(filePath);
    
    return {
      success: true,
      researchId,
      filePath,
      message: 'File uploaded successfully'
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: 'Failed to upload file. Please try again.'
    };
  }
}
