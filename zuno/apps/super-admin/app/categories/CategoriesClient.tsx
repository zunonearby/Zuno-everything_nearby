"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getPlatformCategoriesAction, CategoryRecord } from "../../features/categories/api";

export default function CategoriesClient({
  initialCategories,
  initialError,
}: {
  initialCategories: CategoryRecord[];
  initialError?: string;
}) {
  const [categories, setCategories] = useState<CategoryRecord[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlatformCategoriesAction();
      if (res.error) {
        setError(res.error);
      }
      setCategories(res.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load categories.");
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
              | Category Catalog
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
            <h1 className="text-2xl font-black text-[#17231D]">Platform Product Categories</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Core taxonomy defining grocery, fresh produce, and essentials categories in Supabase.
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

        {categories.length === 0 ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 space-y-2">
            <div className="text-4xl">🏷️</div>
            <p className="text-sm font-bold text-gray-700">No categories found in database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
              >
                <div>
                  <h4 className="font-black text-sm text-[#17231D]">{cat.name}</h4>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">slug: {cat.slug}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cat.isActive
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {cat.isActive ? "Active" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
