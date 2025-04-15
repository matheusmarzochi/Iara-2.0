"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { userList, type UserItem } from "./action";

type SortByType = 'email' | 'researchCount' | 'createdAt';
type SortOrderType = 'asc' | 'desc';

export default function AdminUserList() {
	const [usersData, setUsersData] = useState<UserItem[]>([]);
	const [emailFilter, setEmailFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [sortBy, setSortBy] = useState<SortByType>('createdAt');
	const [sortOrder, setSortOrder] = useState<SortOrderType>('desc');
	const pageSize = 10;

	useEffect(() => {
		const fetchUsers = async ({
			email,
			page,
			limit,
			sortBy,
			sortOrder
		}: {
			email: string;
			page: number;
			limit: number;
			sortBy: SortByType;
			sortOrder: SortOrderType;
		}) => {
			const data = await userList({
				email,
				page,
				limit,
				sortBy,
				sortOrder,
			});
			setUsersData(data.items);
			setTotalCount(data.total);
		};

		fetchUsers({
			email: emailFilter,
			page: currentPage,
			limit: pageSize,
			sortBy,
			sortOrder,
		});
	}, [emailFilter, currentPage, sortBy, sortOrder]);

	const handleFilter = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1);
	};

	const handleSort = (column: SortByType) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			setSortBy(column);
			setSortOrder('asc');
		}
	};

	const SortArrow = ({ column }: { column: SortByType }) => {
		if (sortBy !== column) return null;
		return sortOrder === 'asc' ? ' ▲' : ' ▼';
	};

	return (
		<div className="p-8">
			<h1 className="mb-4 text-2xl font-bold">User List</h1>
			<form onSubmit={handleFilter} className="mb-6 flex space-x-2">
				<input
					type="text"
					placeholder="User Email"
					value={emailFilter}
					onChange={(e) => { setEmailFilter(e.target.value); setCurrentPage(1); }}
					className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				/>
				<button type="submit" className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-900 dark:bg-sky-600 dark:hover:bg-sky-700">
					Filter
				</button>
			</form>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead className="bg-gray-50 dark:bg-gray-800">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
								<button type="button" onClick={() => handleSort('email')} className="flex items-center space-x-1 hover:text-gray-500 dark:hover:text-gray-400">
									<span>Email</span>
									<SortArrow column="email" />
								</button>
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
								<button type="button" onClick={() => handleSort('researchCount')} className="flex items-center space-x-1 hover:text-gray-500 dark:hover:text-gray-400">
									<span>Research Count</span>
									<SortArrow column="researchCount" />
								</button>
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
								<button type="button" onClick={() => handleSort('createdAt')} className="flex items-center space-x-1 hover:text-gray-500 dark:hover:text-gray-400">
									<span>Created At</span>
									<SortArrow column="createdAt" />
								</button>
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">Access</th>
						</tr>
					</thead>
					<tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
						{usersData.map((user) => (
							<tr key={user.id}>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{user.researchCount}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
									{new Date(user.createdAt).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
										<Link 
											href={`/admin/researches?email=${user.email}`}
											className="bg-sky-700 text-white px-3 py-1 rounded hover:bg-sky-900 dark:bg-sky-600 dark:hover:bg-sky-700"
										>
											Access
										</Link>
								</td>
							</tr>
						))}
						{usersData.length === 0 && (
							<tr>
								<td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-700 dark:text-gray-300">
									No users found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
				Total Users: {totalCount}
			</div>
			<div className="mt-4 flex justify-between">
				<button
					onClick={() => {
						if (currentPage > 1) {
							setCurrentPage(currentPage - 1);
						}
					}}
					type="button"
					disabled={currentPage === 1}
					className="bg-sky-700 text-white px-4 py-2 rounded disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-700"
				>
					Previous
				</button>
				<span className="dark:text-gray-300">Page {currentPage}</span>
				<button
					onClick={() => {
						if (usersData.length === pageSize) {
							setCurrentPage(currentPage + 1);
						}
					}}
					type="button"
					disabled={usersData.length < pageSize}
					className="bg-sky-700 text-white px-4 py-2 rounded disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-700"
				>
					Next
				</button>
			</div>
		</div>
	);
}
