"use client";
import { useEffect, useState } from "react";
import type { Research } from "iara-shared/database/schema";
import { researchList, type ResearchItem } from "./action"
import { ResearchStatusBadge } from "~/components/researchStatusBadge";
import { Paperclip } from "lucide-react";
import Link from "next/link";

type ResearchStatus = Research["status"];

export default function AdminResearchList() {
    const [researchItems, setResearchItems] = useState<ResearchItem[]>([]);
    const [emailFilter, setEmailFilter] = useState("");
    const [titleFilter, setTitleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<ResearchStatus | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
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
            setResearchItems(data.items);
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
                    className="border rounded p-2"
                />
                <input
                    type="text"
                    placeholder="Research Title"
                    value={titleFilter}
                    onChange={(e) => { setTitleFilter(e.target.value); setCurrentPage(1); }}
                    className="border rounded p-2"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value as ResearchStatus | ""); setCurrentPage(1); }}
                    className="border rounded p-2"
                >
                    <option value="">Any Status</option>
                    <option value="OPENED">OPENED</option>
                    <option value="ANALYSIS">ANALYSIS</option>
                    <option value="CREATED">CREATED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="FINISHED">FINISHED</option>
                </select>
                <button type="submit" className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-900">Filter</button>
            </form>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Owner Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Research Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Questions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Answers</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Access</th> {/* New header */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {researchItems.map((research) => (
                            <tr key={research.researchId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{research.userEmail}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{research.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {new Date(research.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {research.uploadPath ? (
                                        <span className="mr-2" title="File Uploaded">
                                            <Paperclip className="w-4 h-4 inline-block" />
                                        </span>
                                    ) : (
                                        <span className="mr-2 inline-block w-4 h-4"/>
                                    )}
                                    <ResearchStatusBadge status={research.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{research.questionsQuantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{research.answersQuantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"> {/* New column */}
                                    <Link href={`/admin/${research.researchId}`} className="bg-sky-700 text-white px-3 py-1 rounded hover:bg-sky-900">
                                        Access
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {researchItems.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-700">No researches found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-2 text-sm text-gray-700">
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
                    className="bg-sky-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button
                    onClick={() => {
                        if (researchItems.length === pageSize) {
                            setCurrentPage(currentPage + 1);
                        }
                    }}
                    type="button"
                    disabled={researchItems.length < pageSize}
                    className="bg-sky-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}