"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCustomersAction, CustomerRecord } from "../../features/customers/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomersAction();
      if (res.error) {
        setError(res.error);
      }
      setCustomers(res.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#17231D] font-sans pb-12">
      {/* Top Header Bar */}
      <div className="bg-[#0F5D3A] text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs bg-[#18754b] hover:bg-[#22A06B] text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5"
            >
              ← Back to Dashboard
            </Link>
            <span className="text-[#A7D56B] text-xs font-bold uppercase tracking-wider">
              | Customer Directory
            </span>
          </div>
          <span className="text-xs font-bold bg-[#A7D56B] text-[#0F5D3A] px-2.5 py-1 rounded-full">
            SUPER_ADMIN Active
          </span>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-[#17231D]">Registered Customers</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Directory of verified customer profiles authenticated via OTP in Renukoot.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#22A06B] w-56"
            />
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 text-sm font-semibold">
            Loading customers from database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 space-y-2">
            <div className="text-4xl">👥</div>
            <p className="text-sm font-bold text-gray-700">No customers registered yet.</p>
            <p className="text-xs text-gray-400">
              When customers authenticate with their mobile number, their verified profiles appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-[#F8FAF6]">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-4 font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0F5D3A] flex items-center justify-center font-extrabold text-xs">
                          {c.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div>{c.fullName}</div>
                          <div className="text-[10px] text-emerald-700 font-semibold">Verified Customer</div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-gray-800">{c.phone}</td>
                      <td className="px-5 py-4 font-mono text-[11px] text-gray-400">{c.id.slice(0, 8)}...</td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
