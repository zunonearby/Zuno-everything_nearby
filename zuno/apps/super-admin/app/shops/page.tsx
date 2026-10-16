"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPendingShopkeeperApplications,
  updateShopApprovalStatus,
  ShopkeeperApplication,
} from "../../features/shops/api";

export default function ShopsPage() {
  const [applications, setApplications] = useState<ShopkeeperApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "PENDING" | "APPROVED">("PENDING");
  const [totalPendingCount, setTotalPendingCount] = useState<number>(0);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async (filter = activeFilter) => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await getPendingShopkeeperApplications(filter);
      if (res.error) {
        setActionError(res.error);
      }
      setApplications(res.applications);

      if (filter === "PENDING") {
        setTotalPendingCount(
          res.applications.filter(
            (a) => a.approvalStatus === "PENDING" || (!a.isApproved && a.approvalStatus !== "REJECTED")
          ).length
        );
      } else {
        getPendingShopkeeperApplications("PENDING").then((pRes) => {
          if (!pRes.error) {
            setTotalPendingCount(
              pRes.applications.filter(
                (a) => a.approvalStatus === "PENDING" || (!a.isApproved && a.approvalStatus !== "REJECTED")
              ).length
            );
          }
        });
      }
    } catch (err: any) {
      setActionError(err?.message || "Failed to load shopkeeper applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeFilter);
  }, [activeFilter]);

  const handleStatusChange = async (
    shopId: string,
    status: "APPROVED" | "REJECTED" | "SUSPENDED"
  ) => {
    setProcessingId(shopId);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await updateShopApprovalStatus(shopId, status);
      if (res.success) {
        setActionSuccess(res.message || `Shop status updated to ${status}.`);
        if (activeFilter === "PENDING") {
          setApplications((prev) => prev.filter((a) => a.id !== shopId));
          setTotalPendingCount((prev) => Math.max(0, prev - 1));
        }
        // Refresh list to show accurate database state
        await loadData(activeFilter);
      } else {
        setActionError(res.error || `Failed to update status to ${status}.`);
      }
    } catch (err: any) {
      setActionError(err?.message || "An unexpected error occurred.");
    } finally {
      setProcessingId(null);
      setTimeout(() => {
        setActionSuccess(null);
      }, 5000);
    }
  };

  const pendingCount = totalPendingCount;

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
              | Merchant Governance
            </span>
          </div>
          <span className="text-xs font-bold bg-[#A7D56B] text-[#0F5D3A] px-2.5 py-1 rounded-full">
            SUPER_ADMIN Active
          </span>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Page Title & Refresh */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-[#17231D]">
              Shopkeeper Applications & Approvals
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Review and approve merchant onboarding requests for PIN 231217, Renukoot region.
            </p>
          </div>
          <button
            onClick={() => loadData(activeFilter)}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "🔄 Refresh List"}
          </button>
        </div>

        {/* Action Alerts */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <span>✅</span>
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <span>⚠️</span>
            <span>{actionError}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveFilter("PENDING")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeFilter === "PENDING"
                ? "bg-[#0F5D3A] text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span>Pending Review</span>
            {pendingCount > 0 && (
              <span className="bg-[#A7D56B] text-[#0F5D3A] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveFilter("APPROVED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === "APPROVED"
                ? "bg-[#0F5D3A] text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Approved Shops
          </button>
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeFilter === "ALL"
                ? "bg-[#0F5D3A] text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All Registrations
          </button>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 text-sm font-semibold">
            Loading shopkeeper applications from database...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 space-y-2">
            <div className="text-4xl">🏪</div>
            <p className="text-sm font-bold text-gray-700">No applications found in this category.</p>
            <p className="text-xs text-gray-400">
              When new shopkeepers register at <span className="font-mono text-gray-600">/register</span>, their application will appear here for review.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-[#F8FAF6]">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Shop Details
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Owner & Contact
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Location & PIN
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-right font-black text-gray-600 uppercase tracking-wider">
                      Approval Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {applications.map((app) => {
                    const isApproved = app.approvalStatus === "APPROVED" || app.isApproved;
                    const isRejected = app.approvalStatus === "REJECTED";
                    const isSuspended = app.approvalStatus === "SUSPENDED";
                    const isPending = !isApproved && !isRejected && !isSuspended;
                    const isWorking = processingId === app.id;

                    return (
                      <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-black text-sm text-gray-900">{app.shopName}</div>
                          <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                            {app.description || "No description provided."}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1 font-mono">
                            ID: {app.id.substring(0, 8)}...
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-900">{app.ownerName}</div>
                          <div className="text-xs font-mono text-gray-600 mt-0.5">{app.phone}</div>
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          <div className="font-medium">{app.addressLine}</div>
                          <div className="text-[11px] text-gray-500 font-semibold mt-0.5">
                            {app.locality}, PIN {app.pincode}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${
                              isApproved
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : isRejected
                                ? "bg-red-50 text-red-800 border-red-200"
                                : isSuspended
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-blue-50 text-blue-800 border-blue-200"
                            }`}
                          >
                            {app.approvalStatus}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right space-x-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleStatusChange(app.id, "APPROVED")}
                                disabled={isWorking}
                                className="px-3.5 py-1.5 bg-[#0F5D3A] hover:bg-[#157248] text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
                              >
                                {isWorking ? "Updating..." : "✓ Approve"}
                              </button>
                              <button
                                onClick={() => handleStatusChange(app.id, "REJECTED")}
                                disabled={isWorking}
                                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
                              >
                                ✕ Reject
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <button
                              onClick={() => handleStatusChange(app.id, "SUSPENDED")}
                              disabled={isWorking}
                              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
                            >
                              Suspend
                            </button>
                          )}

                          {(isRejected || isSuspended) && (
                            <button
                              onClick={() => handleStatusChange(app.id, "APPROVED")}
                              disabled={isWorking}
                              className="px-3.5 py-1.5 bg-[#0F5D3A] hover:bg-[#157248] text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
                            >
                              Re-Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Security & Invariant Explainer */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
          <p className="font-extrabold flex items-center gap-1.5">
            <span>🛡️</span> Security & Database Authorization Invariant
          </p>
          <p className="text-[11px] leading-relaxed text-emerald-800">
            Shop approval modifications are protected by PostgreSQL trigger{" "}
            <code className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded text-[10px]">
              check_shops_approval_protection
            </code>{" "}
            and RLS policy{" "}
            <code className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded text-[10px]">
              shops_update_admin
            </code>
            . Only verified SUPER_ADMIN and ADMIN accounts can alter approval status. Shop owners cannot self-approve.
          </p>
        </div>
      </div>
    </div>
  );
}
