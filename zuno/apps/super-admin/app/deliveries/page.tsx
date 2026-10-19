"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDeliveryPartnersAction,
  updateDeliveryPartnerStatusAction,
  DeliveryPartnerRecord,
} from "../../features/deliveries/api";

export default function DeliveriesPage() {
  const [applications, setApplications] = useState<DeliveryPartnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await getDeliveryPartnersAction();
      if (res.error) {
        setActionError(res.error);
      }
      setApplications(res.data || []);
    } catch (err: any) {
      setActionError(err?.message || "Failed to load delivery partner applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (
    partnerId: string,
    status: "APPROVED" | "REJECTED" | "SUSPENDED"
  ) => {
    setProcessingId(partnerId);
    setActionMessage(null);
    setActionError(null);
    try {
      const res = await updateDeliveryPartnerStatusAction(partnerId, status);
      if (res.success) {
        setActionMessage(res.message || `Status updated to ${status}.`);
        await loadData();
      } else {
        setActionError(res.error || `Failed to update status to ${status}.`);
      }
    } catch (err: any) {
      setActionError(err?.message || "An unexpected error occurred.");
    } finally {
      setProcessingId(null);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

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
              | Delivery Governance
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
            <h1 className="text-2xl font-black text-[#17231D]">Delivery Partner Governance</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Review, verify, and approve delivery partner registration requests for PIN 231217, Renukoot.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "🔄 Refresh List"}
          </button>
        </div>

        {actionMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <span>✅</span>
            <span>{actionMessage}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <span>⚠️</span>
            <span>{actionError}</span>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 text-sm font-semibold">
            Loading delivery partner applications from database...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 space-y-2">
            <div className="text-4xl">🛵</div>
            <p className="text-sm font-bold text-gray-700">No delivery partner applications found.</p>
            <p className="text-xs text-gray-400">
              When new delivery partners register in the Delivery App, their applications will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-[#F8FAF6]">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Mobile Number
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Vehicle Details
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-right font-black text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-black text-sm text-gray-900">{app.fullName}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {app.id.slice(0, 8)}...</div>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-gray-800">{app.phone}</td>
                      <td className="px-5 py-4 text-gray-700">
                        <div className="font-semibold">{app.vehicleType}</div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5">{app.vehicleNumber}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${
                            app.approvalStatus === "APPROVED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : app.approvalStatus === "REJECTED"
                              ? "bg-red-50 text-red-800 border-red-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {app.approvalStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {app.approvalStatus !== "APPROVED" && (
                          <button
                            onClick={() => handleStatusChange(app.id, "APPROVED")}
                            disabled={processingId === app.id}
                            className="px-3.5 py-1.5 bg-[#0F5D3A] hover:bg-[#157248] text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
                          >
                            ✓ Approve
                          </button>
                        )}
                        {app.approvalStatus !== "REJECTED" && (
                          <button
                            onClick={() => handleStatusChange(app.id, "REJECTED")}
                            disabled={processingId === app.id}
                            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
                          >
                            ✕ Reject
                          </button>
                        )}
                        {app.approvalStatus === "APPROVED" && (
                          <button
                            onClick={() => handleStatusChange(app.id, "SUSPENDED")}
                            disabled={processingId === app.id}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
                          >
                            Suspend
                          </button>
                        )}
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
