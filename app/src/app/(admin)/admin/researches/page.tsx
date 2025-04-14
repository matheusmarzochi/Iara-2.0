"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Research } from "iara-shared/database/schema";
import { researchList, type ResearchItem } from "./action"
import { ResearchStatusBadge } from "~/components/researchStatusBadge";
import { Paperclip, Trash2 } from "lucide-react";
import Link from "next/link";

type ResearchStatus = Research["status"];

export default function AdminResearchList() {
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get("email") || "";
    const [emailFilter, setEmailFilter] = useState(initialEmail);
    const [titleFilter, setTitleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<ResearchStatus | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
    const pageSize = 10;

    useEffect(() => {
        const fetchResearches = async ({
            email,
            title,
            status,
            page,
            limit,
        }: {
            email: string;
            title: string;
            status: ResearchStatus | "";
            page: number;
            limit: number;
        }) => {
            const data = await researchList({
                email,
                title,
                status,
                page,
                limit,
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
        });
    }, [currentPage, emailFilter, titleFilter, statusFilter]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // reset page; fetchResearches will be auto-triggered by useEffect
    };

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
                    onChange={(e) => { setStatusFilter(e.target.value as ResearchStatus | ""); setCurrentPage(1); }}
                    className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="">Qualquer Status</option>
                    <option value="OPENED">Aberta</option>
                    <option value="ANALYSIS">Em Análise</option>
                    <option value="CREATED">Aberta</option>
                    <option value="PROCESSING">Processando</option>
                    <option value="FINISHED">Encerrada</option>
                </select>
                <button type="submit" className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-900 dark:bg-sky-600 dark:hover:bg-sky-700">
                    Filter
                </button>
            </form>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">Owner Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">Research Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">Created At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">Questions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-200">Answers</th>
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