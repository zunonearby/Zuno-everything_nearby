"use client";

import React, { useEffect, useState } from "react";
import {
  getPendingShopkeeperApplications,
  updateShopApprovalStatus,
  ShopkeeperApplication,
} from "../../features/shops/api";

export default function ShopsPage() {
  const [applications, setApplications] = useState<ShopkeeperApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPendingShopkeeperApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (
    shopId: string,
    status: "APPROVED" | "REJECTED" | "SUSPENDED"
  ) => {
    const res = await updateShopApprovalStatus(shopId, status);
    setActionMessage(res.message);
    setApplications((prev) =>
      prev.map((app) =>
        app.id === shopId
          ? { ...app, approvalStatus: status, isApproved: status === "APPROVED" }
          : app
      )
    );
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopkeeper Applications & Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve shopkeeper onboarding requests for PIN 231217, Renukoot region.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold transition"
        >
          Refresh List
        </button>
      </div>

      {actionMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-semibold">
          {actionMessage}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading shopkeeper applications...</div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-xl border">
          No pending shopkeeper applications found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Shop Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Owner & Phone</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Address & Locality</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-right font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    <div>{app.shopName}</div>
                    <div className="text-xs font-normal text-gray-500">{app.description}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="font-semibold">{app.ownerName}</div>
                    <div className="text-xs font-mono text-gray-500">{app.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div>{app.addressLine}</div>
                    <div className="text-xs text-gray-500">
                      {app.locality}, PIN {app.pincode}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        app.approvalStatus === "APPROVED" || app.isApproved
                          ? "bg-emerald-100 text-emerald-800"
                          : app.approvalStatus === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : app.approvalStatus === "SUSPENDED"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {app.approvalStatus || (app.isApproved ? "APPROVED" : "PENDING")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {app.approvalStatus !== "APPROVED" && !app.isApproved && (
                      <button
                        onClick={() => handleStatusChange(app.id, "APPROVED")}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition"
                      >
                        Approve Shop
                      </button>
                    )}
                    {app.approvalStatus !== "REJECTED" && (
                      <button
                        onClick={() => handleStatusChange(app.id, "REJECTED")}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition"
                      >
                        Reject
                      </button>
                    )}
                    {(app.approvalStatus === "APPROVED" || app.isApproved) && (
                      <button
                        onClick={() => handleStatusChange(app.id, "SUSPENDED")}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition"
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
      )}
    </div>
  );
}
