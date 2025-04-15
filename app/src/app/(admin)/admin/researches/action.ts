"use server"
import { ilike, eq, and, countDistinct, isNull, asc, desc } from "iara-shared/node_modules/drizzle-orm";
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
    deletedAt: Date | null;
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
    sortBy?: 'userEmail' | 'title' | 'createdAt' | 'status' | 'questionsQuantity' | 'answersQuantity';
    sortOrder?: 'asc' | 'desc';
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
    const sortBy = filter.sortBy || 'createdAt';
    const sortOrder = filter.sortOrder || 'desc';

    // Count query to get the total researches matching the filter
    const countResult = await db
        .select({ total: countDistinct(researches.id) })
        .from(researches)
        .leftJoin(users, eq(researches.userId, users.id))
        .where(and(...conditions));
    const total = countResult[0]?.total ?? 0;

    // Build the query with left joins and aggregation.
    const baseQuery = db
        .select({
            researchId: researches.id,
            title: researches.title,
            description: researches.description,
            status: researches.status,
            createdAt: researches.createdAt,
            deletedAt: researches.deletedAt,
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
        .groupBy(researches.id, researches.title, researches.description, researches.status, researches.createdAt, users.email);

    let orderedQuery;
    const orderDirection = sortOrder === 'asc' ? asc : desc;

    // Apply sorting based on the sortBy parameter
    switch (sortBy) {
        case 'userEmail':
            orderedQuery = baseQuery.orderBy(orderDirection(users.email));
            break;
        case 'title':
            orderedQuery = baseQuery.orderBy(orderDirection(researches.title));
            break;
        case 'status':
            orderedQuery = baseQuery.orderBy(orderDirection(researches.status));
            break;
        case 'questionsQuantity':
            orderedQuery = baseQuery.orderBy(orderDirection(countDistinct(questions.id)));
            break;
        case 'answersQuantity':
            orderedQuery = baseQuery.orderBy(orderDirection(countDistinct(forms.id)));
            break;
        case 'createdAt':
        default:
            orderedQuery = baseQuery.orderBy(orderDirection(researches.createdAt));
            break;
    }

    const query = await orderedQuery
        .limit(limit)
        .offset(offset);

    return { items: query, total };
}
