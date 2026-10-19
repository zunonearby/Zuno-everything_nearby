"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getPlatformSettingsAction, PlatformConfigSummary } from "../../features/settings/api";

export default function SettingsClient({
  initialConfig,
  initialError,
}: {
  initialConfig?: PlatformConfigSummary;
  initialError?: string;
}) {
  const [config, setConfig] = useState<PlatformConfigSummary | undefined>(initialConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlatformSettingsAction();
      if (res.error) {
        setError(res.error);
      }
      if (res.data) {
        setConfig(res.data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load platform settings.");
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
              | Platform Configuration
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
            <h1 className="text-2xl font-black text-[#17231D]">System Settings & Service Boundaries</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Hyperlocal boundary coordinates, operational service areas, and platform flags.
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
          {/* Service Area Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#17231D]">Active Service Area</h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                OPERATIONAL
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 font-bold block">Region Name</span>
                <span className="font-extrabold text-[#17231D] text-sm mt-0.5 block">
                  {config?.serviceArea.name}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 font-bold block">Pincode</span>
                <span className="font-mono font-extrabold text-[#17231D] text-sm mt-0.5 block">
                  {config?.serviceArea.pincode}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 font-bold block">City & State</span>
                <span className="font-extrabold text-[#17231D] text-sm mt-0.5 block">
                  {config?.serviceArea.city}, {config?.serviceArea.state}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-400 font-bold block">Hub Address</span>
                <span className="font-bold text-gray-700 text-xs mt-0.5 block truncate">
                  {config?.serviceArea.hub_address || "Central Renukoot"}
                </span>
              </div>
            </div>
            {config?.serviceArea.notes && (
              <p className="text-[11px] text-gray-500 italic mt-2">
                Operational Note: {config.serviceArea.notes}
              </p>
            )}
          </div>

          {/* Database Platform Settings */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-[#17231D]">Database Settings Key-Value Store</h3>
            {(!config?.dbSettings || config.dbSettings.length === 0) ? (
              <p className="text-xs text-gray-500">
                No custom key-value rows stored in <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[11px]">public.platform_settings</code>. System is operating on default configuration.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                  <thead>
                    <tr className="text-left font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                      <th className="py-2 px-3">Setting Key</th>
                      <th className="py-2 px-3">Value</th>
                      <th className="py-2 px-3">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {config.dbSettings.map((s) => (
                      <tr key={s.key}>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#0F5D3A]">{s.key}</td>
                        <td className="py-2.5 px-3 font-mono text-gray-700">{JSON.stringify(s.value)}</td>
                        <td className="py-2.5 px-3 text-gray-500">{new Date(s.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
