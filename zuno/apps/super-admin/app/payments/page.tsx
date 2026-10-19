"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getPaymentsAction, PaymentRecord } from "../../features/payments/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPaymentsAction();
      if (res.error) {
        setError(res.error);
      }
      if (res.data) {
        setPayments(res.data.payments);
        setTotalCollected(res.data.totalCollected);
        setTotalPending(res.data.totalPending);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
              | Payments & Collections
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
            <h1 className="text-2xl font-black text-[#17231D]">Platform Payments & Transactions</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Monitor customer payment collections, COD settlements, and transaction statuses from PostgreSQL.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Financial KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Settled Collections</span>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              ₹{totalCollected.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Paid orders (UPI, Card, Completed COD)</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pending Settlement</span>
            <div className="text-2xl font-black text-amber-700 mt-2">
              ₹{totalPending.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Pending COD & in-flight payments</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Transactions</span>
            <div className="text-2xl font-black text-[#17231D] mt-2">{payments.length}</div>
            <p className="text-[11px] text-gray-400 mt-1">Total recorded payment events</p>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 text-sm font-semibold">
            Loading payment records from database...
          </div>
        ) : payments.length === 0 ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 space-y-2">
            <div className="text-4xl">💳</div>
            <p className="text-sm font-bold text-gray-700">No payment transactions recorded yet.</p>
            <p className="text-xs text-gray-400">
              When orders are placed with payment methods (COD, UPI, Online), records will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-[#F8FAF6]">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-[#0F5D3A]">{p.id.slice(0, 8)}...</td>
                      <td className="px-5 py-4 font-bold text-gray-900">{p.displayOrderId}</td>
                      <td className="px-5 py-4 font-semibold text-gray-700">{p.method}</td>
                      <td className="px-5 py-4 font-black text-gray-900">₹{p.amount.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${
                            p.status === "PAID"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : p.status === "FAILED"
                              ? "bg-red-50 text-red-800 border-red-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px] text-gray-500">{p.providerReference}</td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
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
