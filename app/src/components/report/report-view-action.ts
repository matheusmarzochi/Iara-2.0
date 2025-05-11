"use server"

import { db } from "iara-shared/database"
import { categories } from "iara-shared/database/schema/category"
import { eq } from "iara-shared/node_modules/drizzle-orm"

export async function updateCategoryTarget(categoryId: string, target: boolean) {
    await db.update(categories)
        .set({ target })
        .where(eq(categories.id, categoryId))
}
