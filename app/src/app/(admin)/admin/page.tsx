import React from 'react';
import Link from 'next/link';
import { Users, Search } from 'lucide-react';
import { ChartColumnStacked } from 'lucide-react'; // ícone para o botão Fitness Over Time

export default function AdminPage() {
  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            href="/admin/users"
            className="flex items-center bg-white dark:bg-gray-600 px-8 py-4 text-lg font-medium border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-200 dark:hover:bg-gray-500 dark:text-white"
          >
            <Users className="mr-2" />
            Usuários
          </Link>
          <Link
            href="/admin/researches"
            className="flex items-center bg-white dark:bg-gray-600 px-8 py-4 text-lg font-medium border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-200 dark:hover:bg-gray-500 dark:text-white"
          >
            <Search className="mr-2" />
            Pesquisa
          </Link>
          <Link
            href="/admin/fitness"
            className="flex items-center bg-white dark:bg-gray-600 px-8 py-4 text-lg font-medium border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-200 dark:hover:bg-gray-500 dark:text-white"
          >
            <ChartColumnStacked className="mr-2" />
            Fitness Over Time
          </Link>
        </div>
      </div>
    </div>
  );
}
