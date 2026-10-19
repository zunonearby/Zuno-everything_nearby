"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getPlatformActivityLogsAction, ActivityLogRecord } from "../../features/activity/api";

export default function ActivityPage() {
  const [logs, setLogs] = useState<ActivityLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlatformActivityLogsAction();
      if (res.error) {
        setError(res.error);
      }
      setLogs(res.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load activity logs.");
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
              | Audit Trail
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
            <h1 className="text-2xl font-black text-[#17231D]">Platform Activity & Audit Logs</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Immutable audit trail recording administrative approvals, shop modifications, and status changes in PostgreSQL.
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

        {loading ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 text-sm font-semibold">
            Loading activity logs from database...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 space-y-2">
            <div className="text-4xl">📋</div>
            <p className="text-sm font-bold text-gray-700">No activity logs recorded yet.</p>
            <p className="text-xs text-gray-400">
              When administrators approve shops, reject applications, or modify accounts, entries are logged here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-[#F8FAF6]">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Action Type
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Actor
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Details / Metadata
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-black text-[#0F5D3A] bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-100">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">
                        {log.actorName}
                        <span className="block text-[10px] text-gray-400 font-semibold">{log.actorRole}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-700 font-mono">
                        {log.entityType} ({log.entityId.slice(0, 8)}...)
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px] text-gray-600 max-w-xs truncate">
                        {JSON.stringify(log.metadata)}
                      </td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(log.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
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
