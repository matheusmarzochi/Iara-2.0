"use server"
import { ilike, eq, and, countDistinct, isNull } from "iara-shared/node_modules/drizzle-orm";
import { db } from "iara-shared/database";
import {
    type Research,
    researches,
    users,
    questions,
    forms
} from "iara-shared/database/schema";

type ResearchStatus = Research["status"];

export interface ResearchItem {
    researchId: string;
    title: string;
    description: string;
    status: ResearchStatus;
    uploadPath: string | null;
    createdAt: Date;
    userEmail: string | null;
    questionsQuantity: number;
    answersQuantity: number;
}

export interface ResearchListResponse {
    items: ResearchItem[];
    total: number;
}

type FilterData = {
    email: string;
    title: string;
    status: ResearchStatus | "";
    page?: number;
    limit?: number;
}

export const researchList = async (filter: FilterData): Promise<ResearchListResponse> => {
    const conditions = [];

    if (filter.title) {
        conditions.push(ilike(researches.title, `%${filter.title}%`));
    }

    if (filter.status) {
        conditions.push(eq(researches.status, filter.status));
    }

    if (filter.email) {
        conditions.push(ilike(users.email, `%${filter.email}%`));
    }

    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const offset = (page - 1) * limit;

    // Count query to get the total researches matching the filter
    const countResult = await db
        .select({ total: countDistinct(researches.id) })
        .from(researches)
        .leftJoin(users, eq(researches.userId, users.id))
        .where(and(...conditions));
    const total = countResult[0]?.total ?? 0;

    // Build the query with left joins and aggregation.
    const query = await db
        .select({
            researchId: researches.id,
            title: researches.title,
            description: researches.description,
            status: researches.status,
            createdAt: researches.createdAt,
            uploadPath: researches.uploadPath,
            userEmail: users.email,
            questionsQuantity: countDistinct(questions.id),
            answersQuantity: countDistinct(forms.id)
        })
        .from(researches)
        .leftJoin(users, eq(researches.userId, users.id))
        .leftJoin(questions, eq(questions.researchId, researches.id))
        .leftJoin(forms, eq(forms.researchId, researches.id))
        .where(and(...conditions))
        .groupBy(researches.id, researches.title, researches.description, researches.status, researches.createdAt, users.email)
        .limit(limit)
        .offset(offset);

    return { items: query, total };
}
