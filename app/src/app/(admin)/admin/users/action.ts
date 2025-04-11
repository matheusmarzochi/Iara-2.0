"use server"
import { ilike, eq, and, countDistinct, isNull } from "iara-shared/node_modules/drizzle-orm";
import { db } from "iara-shared/database";
import { users, researches } from "iara-shared/database/schema";

export interface UserItem {
	id: string;
	email: string;
	createdAt: Date;
	researchCount: number;
}

export interface UserListResponse {
	items: UserItem[];
	total: number;
}

type FilterData = {
	email: string;
	page?: number;
	limit?: number;
}

export const userList = async (filter: FilterData): Promise<UserListResponse> => {
	const conditions = [];
	if (filter.email) {
		conditions.push(ilike(users.email, `%${filter.email}%`));
	}
	// Optionally add a condition if soft-deletes are implemented, e.g. isNull(users.deletedAt)

	const page = filter.page || 1;
	const limit = filter.limit || 10;
	const offset = (page - 1) * limit;

	// Count total users matching the filter
	const countResult = await db
		.select({ total: countDistinct(users.id) })
		.from(users)
		.where(and(...conditions));
	const total = countResult[0]?.total ?? 0;

	// Query users with aggregation count (researchCount)
	const query = await db
		.select({
			id: users.id,
			email: users.email,
			createdAt: users.createdAt,
			researchCount: countDistinct(researches.id)
		})
		.from(users)
		.leftJoin(
			researches,
			and(
				eq(researches.userId, users.id),
				isNull(researches.deletedAt) // only count researches not soft-deleted
			)
		)
		.where(and(...conditions))
		.groupBy(users.id, users.email, users.createdAt)
		.limit(limit)
		.offset(offset);

	return { items: query, total };
}
