"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllPlatformOrdersAction,
  adminCancelOrderAction,
  PlatformOrderRecord,
} from "../../features/orders/api";

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "PLACED":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "ACCEPTED":
    case "PREPARING":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "READY_FOR_PICKUP":
    case "OUT_FOR_DELIVERY":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "CANCELLED":
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<PlatformOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async (filter = statusFilter) => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await getAllPlatformOrdersAction(filter);
      if (res.error) {
        setActionError(res.error);
      }
      setOrders(res.data || []);
    } catch (err: any) {
      setActionError(err?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(statusFilter);
  }, [statusFilter]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order as an administrator?")) return;
    setProcessingId(orderId);
    setActionSuccess(null);
    setActionError(null);
    try {
      const res = await adminCancelOrderAction(orderId, "Super Admin Operational Cancellation");
      if (res.success) {
        setActionSuccess(res.message || "Order cancelled successfully.");
        await loadData(statusFilter);
      } else {
        setActionError(res.error || "Failed to cancel order.");
      }
    } catch (err: any) {
      setActionError(err?.message || "Unexpected cancellation error.");
    } finally {
      setProcessingId(null);
      setTimeout(() => setActionSuccess(null), 5000);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.displayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shopName.toLowerCase().includes(searchTerm.toLowerCase())
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
              | Platform Orders
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
            <h1 className="text-2xl font-black text-[#17231D]">All Platform Orders</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Monitor, audit and govern customer orders across all registered shops in Renukoot.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Filter by ID, customer, shop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#22A06B] w-56"
            />
            <button
              onClick={() => loadData(statusFilter)}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
        </div>

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

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "PLACED", label: "Placed" },
            { id: "ACCEPTED", label: "Accepted" },
            { id: "PREPARING", label: "Preparing" },
            { id: "READY_FOR_PICKUP", label: "Ready for Pickup" },
            { id: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
            { id: "DELIVERED", label: "Delivered" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-[#0F5D3A] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 text-sm font-semibold">
            Loading orders from PostgreSQL...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 space-y-2">
            <div className="text-4xl">📦</div>
            <p className="text-sm font-bold text-gray-700">No orders found for this view.</p>
            <p className="text-xs text-gray-400">
              When customer orders are created in the database, they will be listed here with live statuses.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-[#F8FAF6]">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Shop
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Items Summary
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-5 py-3.5 text-left font-black text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-right font-black text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-4 font-black text-[#0F5D3A]">{ord.displayId}</td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-900">{ord.customerName}</div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5">{ord.customerPhone}</div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-800">{ord.shopName}</td>
                      <td className="px-5 py-4 text-gray-600 max-w-[200px] truncate">{ord.itemsSummary}</td>
                      <td className="px-5 py-4 font-black text-gray-900">₹{ord.total.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-200">
                          {ord.paymentMethod} • {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${getStatusBadgeClass(
                            ord.status
                          )}`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {ord.status !== "DELIVERED" && ord.status !== "CANCELLED" && ord.status !== "REJECTED" && (
                          <button
                            onClick={() => handleCancelOrder(ord.id)}
                            disabled={processingId === ord.id}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition disabled:opacity-50"
                          >
                            Cancel
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
