import React from 'react';
import Link from 'next/link';
import { Users, Search } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-gray-100 shadow-md rounded-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            href="/admin/users"
            className="flex items-center bg-white px-8 py-4 text-lg font-medium border border-gray-300 rounded hover:bg-gray-200"
          >
            <Users className="mr-2" />
            Usuários
          </Link>
          <Link
            href="/admin/researches"
            className="flex items-center bg-white px-8 py-4 text-lg font-medium border border-gray-300 rounded hover:bg-gray-200"
          >
            <Search className="mr-2" />
            Pesquisa
          </Link>
        </div>
      </div>
    </div>
  );
}
