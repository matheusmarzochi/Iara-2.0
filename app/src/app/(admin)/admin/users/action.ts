"use server"
import { ilike, eq, and, countDistinct, isNull, asc, desc } from "iara-shared/node_modules/drizzle-orm";
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
	sortBy?: 'email' | 'researchCount' | 'createdAt';
	sortOrder?: 'asc' | 'desc';
}

export const userList = async (filter: FilterData): Promise<UserListResponse> => {
	const conditions = [];
	if (filter.email) {
		conditions.push(ilike(users.email, `%${filter.email}%`));
	}

	const page = filter.page || 1;
	const limit = filter.limit || 10;
	const offset = (page - 1) * limit;
	const sortBy = filter.sortBy || 'createdAt';
	const sortOrder = filter.sortOrder || 'desc';


	const countResult = await db
		.select({ total: countDistinct(users.id) })
		.from(users)
		.where(and(...conditions));
	const total = countResult[0]?.total ?? 0;

	const baseQuery = db
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
			)
		)
		.where(and(...conditions))
		.groupBy(users.id, users.email, users.createdAt);

	let orderedQuery;
	const orderDirection = sortOrder === 'asc' ? asc : desc;

	switch (sortBy) {
		case 'email':
			orderedQuery = baseQuery.orderBy(orderDirection(users.email));
			break;
		case 'researchCount':
			orderedQuery = baseQuery.orderBy(orderDirection(countDistinct(researches.id)));
			break;
		default:
			orderedQuery = baseQuery.orderBy(orderDirection(users.createdAt));
			break;
	}

	const query = await orderedQuery.limit(limit).offset(offset);

	return { items: query, total };
}
