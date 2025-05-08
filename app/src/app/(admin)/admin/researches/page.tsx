"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Research } from "iara-shared/database/schema";
import { researchList, type ResearchItem } from "./action";
import { ResearchStatusBadge } from "~/components/research/researchStatusBadge";
import { Paperclip, Trash2 } from "lucide-react";
import Link from "next/link";

type ResearchStatusType = Research["status"];
type SortByType = 'userEmail' | 'title' | 'createdAt' | 'status' | 'questionsQuantity' | 'answersQuantity';
type SortOrderType = 'asc' | 'desc';

export default function AdminResearchList() {
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get("email") || "";
    const [emailFilter, setEmailFilter] = useState(initialEmail);
    const [titleFilter, setTitleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<ResearchStatusType | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
    const [sortBy, setSortBy] = useState<SortByType>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrderType>('desc');
    const pageSize = 10;

    useEffect(() => {
        const fetchResearches = async ({
            email,
            title,
            status,
            page,
            limit,
            sortBy,
            sortOrder
        }: {
            email: string;
            title: string;
            status: ResearchStatusType | "";
            page: number;
            limit: number;
            sortBy: SortByType;
            sortOrder: SortOrderType;
        }) => {
            const data = await researchList({
                email,
                title,
                status,
                page,
                limit,
                sortBy,
                sortOrder,
            });
            setResearchItems(data.items as ResearchItem[]);
            setTotalCount(data.total);
        };

        fetchResearches({
            email: emailFilter,
            title: titleFilter,
            status: statusFilter,
            page: currentPage,
            limit: pageSize,
            sortBy,
            sortOrder,
        });
    }, [currentPage, emailFilter, titleFilter, statusFilter, sortBy, sortOrder]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handleSort = (column: SortByType) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc'); // Default to ascending when changing column
        }
    };

    const SortArrow = ({ column }: { column: SortByType }) => {
        if (sortBy !== column) return null;
        return sortOrder === 'asc' ? ' ▲' : ' ▼';
    };

    const researchStatusOptions = useMemo(() => [
        { value: "", label: "Todas" },
        { value: "OPENED", label: "Aberta" },
        { value: "ANALYSIS", label: "Em Analise" },
        { value: "PROCESSING", label: "Processando" },
        { value: "FINISHED", label: "Encerrada" },
    ], []);

    return (
        <div className="p-8">
            <h1 className="mb-4 text-2xl font-bold">Research List</h1>
            <form onSubmit={handleFilter} className="mb-6 flex space-x-2">
                <input
                    type="text"
                    placeholder="User Email"
                    value={emailFilter}
                    onChange={(e) => { setEmailFilter(e.target.value); setCurrentPage(1); }}
                    className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                    type="text"
                    placeholder="Research Title"
                    value={titleFilter}
                    onChange={(e) => { setTitleFilter(e.target.value); setCurrentPage(1); }}
                    className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value as ResearchStatusType | ""); setCurrentPage(1); }}
                    className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    {researchStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button type="submit" className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-900 dark:bg-sky-600 dark:hover:bg-sky-700">
                    Filter
                </button>
            </form>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
                                <button type="button" onClick={() => handleSort('userEmail')} className="flex items-center space-x-1 hover:text-gray-500 dark:hover:text-gray-400">
                                    <span>Owner Email</span>
                                    <SortArrow column="userEmail" />
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
                                <button type="button" onClick={() => handleSort('title')} className="flex items-center space-x-1 hover:text-gray-500 dark:hover:text-gray-400">
                                    <span>Research Title</span>
                                    <SortArrow column="title" />
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
                                <button type="button" onClick={() => handleSort('createdAt')} className="flex items-center space-x-1 hover:text-gray-500 dark:hover:text-gray-400">
                                    <span>Created At</span>
                                    <SortArrow column="createdAt" />
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
                                <button type="button" onClick={() => handleSort('status')} className="flex items-center space-x-1 hover:text-gray-500 dark:hover:text-gray-400">
                                    <span>Status</span>
                                    <SortArrow column="status" />
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
                                <button type="button" onClick={() => handleSort('questionsQuantity')} className="flex items-center space-x-1 hover:text-gray-500 dark:hover:text-gray-400">
                                    <span>Questions</span>
                                    <SortArrow column="questionsQuantity" />
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">
                                <button type="button" onClick={() => handleSort('answersQuantity')} className="flex items-center space-x-1 hover:text-gray-500 dark:hover:text-gray-400">
                                    <span>Answers</span>
                                    <SortArrow column="answersQuantity" />
                                </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">Access</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {researchItems.map((research) => (
                            <tr key={research.researchId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{research.userEmail}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{research.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                    {new Date(research.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center">
                                    <ResearchStatusBadge status={research.status} />
                                    <div className="flex items-center space-x-2">
                                        {research.uploadPath ? (
                                            <span className="mr-2" title="File Uploaded">
                                                <Paperclip className="w-4 h-4 inline-block" />
                                            </span>
                                        ) : (
                                            <span className="mr-2 inline-block w-4 h-4" />
                                        )}
                                        {research.deletedAt ? (
                                            <span className="mr-2 text-red-500" title={`Deleted at ${new Date(research.deletedAt).toLocaleString()}`}>
                                                <Trash2 className="w-4 h-4 inline-block" />
                                            </span>
                                        ) : (
                                            <span className="mr-2 inline-block w-4 h-4" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{research.questionsQuantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{research.answersQuantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                    <Link href={`/admin/researches/${research.researchId}`} className="bg-sky-700 text-white px-3 py-1 rounded hover:bg-sky-900 dark:bg-sky-600 dark:hover:bg-sky-700">
                                        Access
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {researchItems.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-700 dark:text-gray-300">No researches found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Total Researches: {totalCount}
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
                        if (researchItems.length === pageSize) {
                            setCurrentPage(currentPage + 1);
                        }
                    }}
                    type="button"
                    disabled={researchItems.length < pageSize}
                    className="bg-sky-700 text-white px-4 py-2 rounded disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-700"
                >
                    Next
                </button>
            </div>
        </div>
    );
}