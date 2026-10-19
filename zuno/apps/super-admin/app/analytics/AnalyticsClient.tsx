"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getPlatformAnalyticsAction, AnalyticsOperationalData } from "../../features/analytics/api";

export default function AnalyticsClient({
  initialData,
  initialError,
}: {
  initialData?: AnalyticsOperationalData;
  initialError?: string;
}) {
  const [data, setData] = useState<AnalyticsOperationalData | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlatformAnalyticsAction();
      if (res.error) {
        setError(res.error);
      }
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#17231D] font-sans pb-12">
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
              | Platform Analytics
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
            <h1 className="text-2xl font-black text-[#17231D]">Platform Operations Analytics</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Calculated exclusively from transactional database records in PostgreSQL. Behavioral analytics routed to PostHog.
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

        <div className="space-y-6">
          {/* Operational Aggregates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">All-Time GMV</span>
              <div className="text-2xl font-black text-[#17231D] mt-2">
                ₹{(data?.totalGmv ?? 0).toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Excludes cancelled/rejected</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">All-Time Orders</span>
              <div className="text-2xl font-black text-[#17231D] mt-2">
                {data?.totalOrders ?? 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">{data?.completedOrders ?? 0} successfully delivered</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Merchants</span>
              <div className="text-2xl font-black text-[#17231D] mt-2">
                {data?.activeShopsCount ?? 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Approved & online shops</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Customers</span>
              <div className="text-2xl font-black text-[#17231D] mt-2">
                {data?.totalCustomers ?? 0}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Verified user profiles</p>
            </div>
          </div>

          {/* PostHog Behavioral Analytics Boundary Status */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#17231D]">Behavioral Analytics Architecture</h3>
                <p className="text-xs text-gray-500">Separation of transactional PostgreSQL vs. product behavioral tracking</p>
              </div>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  data?.posthogConfigured
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                {data?.posthogConfigured ? "PostHog Active" : "PostHog Key Not Set in Env"}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Per architectural rules: Operational truth (users, orders, revenue, inventory) is derived strictly from PostgreSQL. Funnels, user retention cohorts, and session analytics are captured via PostHog events rather than synthetic DB charts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
