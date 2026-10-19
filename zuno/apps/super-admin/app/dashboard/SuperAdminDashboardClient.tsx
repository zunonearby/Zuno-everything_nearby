"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SuperAdminDashboardData,
  getSuperAdminDashboardDataAction,
} from "../../features/dashboard/api";

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

export default function SuperAdminDashboardClient({
  initialData,
}: {
  initialData: SuperAdminDashboardData;
}) {
  const router = useRouter();
  const [data, setData] = useState<SuperAdminDashboardData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getSuperAdminDashboardDataAction();
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Failed to refresh platform data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };

  const filteredOrders = (data.recentOrders || []).filter(
    (order) =>
      order.displayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#17231D] flex flex-col md:flex-row font-sans">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0F5D3A] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <img src="/brandlogo.png" alt="ZUNO Logo" className="h-8 w-auto object-contain" />
          <span className="text-xs text-[#A7D56B] block font-medium">Super Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md hover:bg-[#22A06B] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            ) : (
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#0F5D3A] text-white flex-shrink-0 flex flex-col justify-between min-h-screen border-r border-[#0d4f31]`}
      >
        <div>
          {/* Brand Header */}
          <div className="hidden md:flex items-center gap-3 p-6 border-b border-[#18754b]">
            <img src="/brandlogo.png" alt="ZUNO Logo" className="h-9 w-auto object-contain" />
            <p className="text-xs text-[#A7D56B] font-extrabold tracking-wider uppercase">
              Control Center
            </p>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {[
              { href: "/dashboard", label: "Overview", icon: "🌐", active: true },
              { href: "/shops", label: "Shops & Approvals", icon: "🏪", badge: data.metrics.pendingShopsCount > 0 ? `${data.metrics.pendingShopsCount} New` : undefined },
              { href: "/orders", label: "Orders", icon: "📦", badge: data.metrics.todayOrdersCount > 0 ? `${data.metrics.todayOrdersCount} Today` : undefined },
              { href: "/customers", label: "Customers", icon: "👥" },
              { href: "/deliveries", label: "Delivery Partners", icon: "🛵" },
              { href: "/payments", label: "Payments", icon: "💳" },
              { href: "/products", label: "Products Catalog", icon: "🥦" },
              { href: "/categories", label: "Categories", icon: "🏷️" },
              { href: "/analytics", label: "Platform Analytics", icon: "📊" },
              { href: "/activity", label: "Activity Logs", icon: "📋" },
              { href: "/settings", label: "System Settings", icon: "⚙️" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  item.active
                    ? "bg-[#22A06B] text-white shadow-sm"
                    : "text-[#D2E7D9] hover:bg-[#157248] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#A7D56B] text-[#0F5D3A] text-[10px] font-black px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Super Admin Profile Info */}
        <div className="p-4 border-t border-[#18754b] bg-[#0c4a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A7D56B] text-[#0F5D3A] font-extrabold flex items-center justify-center text-sm">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-black truncate">{data.admin.fullName}</p>
              <p className="text-[10px] text-[#A7D56B] truncate font-semibold">
                {data.admin.role} Role
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="text-emerald-300 hover:text-white text-base p-1.5 rounded-lg hover:bg-[#157248] transition"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-[#17231D]">Platform Operations Overview</h2>
            <p className="text-xs text-gray-500 font-medium">
              Real-time status of customers, shops, orders & platform activity from PostgreSQL
            </p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search shops, orders, users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-[#F8FAF6] border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#22A06B]"
              />
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              title="Refresh live metrics"
              className="p-2 text-gray-600 hover:text-[#0F5D3A] hover:bg-emerald-50 rounded-lg transition"
            >
              🔄
            </button>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-[#0F5D3A]">
              Live Database Connected
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-semibold flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button
                onClick={refreshData}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Banner */}
          <div className="bg-gradient-to-r from-[#0F5D3A] via-[#157248] to-[#22A06B] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="bg-[#A7D56B] text-[#0F5D3A] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                HYPERLOCAL PLATFORM CONTROL
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-3">
                Welcome to ZUNO Control Center
              </h3>
              <p className="text-emerald-100 text-sm mt-1 leading-relaxed">
                Monitor live grocery commerce, shop onboarding, order fulfillment and platform health across Renukoot (PIN 231217).
              </p>
            </div>
            <div className="absolute right-4 -bottom-6 opacity-20 text-8xl pointer-events-none select-none">
              🏪
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                title: "Total Customers",
                value: loading ? "..." : `${data.metrics.totalCustomers.toLocaleString("en-IN")}`,
                change: "Registered profiles",
                icon: "👥",
                bgColor: "bg-blue-50 text-blue-700 border-blue-100",
              },
              {
                title: "Active Shops",
                value: loading ? "..." : `${data.metrics.activeShopsCount} / ${data.metrics.approvedShopsCount}`,
                change: `${data.metrics.pendingShopsCount} pending review`,
                icon: "🏪",
                bgColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
              },
              {
                title: "Today's Orders",
                value: loading ? "..." : `${data.metrics.todayOrdersCount} Orders`,
                change: "Placed today",
                icon: "📦",
                bgColor: "bg-purple-50 text-purple-700 border-purple-100",
              },
              {
                title: "Active Deliveries",
                value: loading ? "..." : `${data.metrics.activeDeliveriesCount} Tasks`,
                change: "In transit / assigned",
                icon: "🛵",
                bgColor: "bg-amber-50 text-amber-700 border-amber-100",
              },
              {
                title: "Platform GMV Today",
                value: loading ? "..." : `₹${data.metrics.todayGmv.toLocaleString("en-IN")}`,
                change: "Gross merchant value",
                icon: "💵",
                bgColor: "bg-teal-50 text-teal-700 border-teal-100",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{stat.title}</span>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base border ${stat.bgColor}`}>
                    {stat.icon}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-xl font-black text-[#17231D]">{stat.value}</span>
                  <p className="text-[11px] font-semibold text-gray-500 mt-1">{stat.change}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Grid Layout: Orders Table + Live Activity Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Orders Table */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h4 className="font-black text-lg text-[#17231D]">Platform Live Orders</h4>
                  <p className="text-xs text-gray-500">Real-time order stream across all merchant shops in Renukoot</p>
                </div>
                <Link
                  href="/orders"
                  className="text-xs font-bold text-[#0F5D3A] bg-emerald-50 hover:bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-100 transition"
                >
                  View All Orders →
                </Link>
              </div>

              <div className="overflow-x-auto">
                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="w-10 h-10 mx-auto bg-emerald-50 text-[#0F5D3A] rounded-full flex items-center justify-center text-lg font-bold">
                      📦
                    </div>
                    <p className="text-xs font-bold text-gray-700">No customer orders placed yet</p>
                    <p className="text-[11px] text-gray-400">
                      When customers place orders via the ZUNO Customer app, they will appear here in real time.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Shop Name</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-3 font-extrabold text-[#0F5D3A]">{ord.displayId}</td>
                          <td className="py-3 px-3 font-semibold text-gray-900">
                            {ord.customerName}
                            <span className="block text-[10px] text-gray-400 font-normal">
                              {ord.timeAgo}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-700 font-medium">{ord.shopName}</td>
                          <td className="py-3 px-3 font-black text-gray-900">
                            ₹{ord.amount.toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                                ord.status
                              )}`}
                            >
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Right Col: Platform Activity Log Stream */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="font-black text-base text-[#17231D]">Platform Activity Feed</h4>
                <Link
                  href="/activity"
                  className="text-[10px] font-bold text-[#0F5D3A] hover:underline"
                >
                  All Logs →
                </Link>
              </div>

              {data.recentActivity.length === 0 ? (
                <div className="py-8 text-center space-y-1">
                  <p className="text-xs font-bold text-gray-700">No recent administrative activity logged</p>
                  <p className="text-[11px] text-gray-400">
                    Audit logs are written when approvals, status changes, and administrative actions occur.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentActivity.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100"
                    >
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border flex-shrink-0 bg-blue-50 text-blue-600 border-blue-100">
                        📋
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-black text-gray-900 truncate">{log.title}</h5>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">{log.timeAgo}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1 leading-snug">{log.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Merchant Onboardings Overview Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-black text-lg text-[#17231D]">Merchant Onboarding & Governance</h4>
                <p className="text-xs text-gray-500">Live shop registration requests and verification statuses from database</p>
              </div>
              <Link
                href="/shops"
                className="text-xs font-bold text-[#0F5D3A] hover:text-[#22A06B] transition-colors"
              >
                Manage All Shops ({data.metrics.approvedShopsCount + data.metrics.pendingShopsCount}) →
              </Link>
            </div>

            {data.recentShops.length === 0 ? (
              <div className="py-8 text-center space-y-1 border border-dashed border-gray-200 rounded-xl">
                <p className="text-xs font-bold text-gray-700">No shopkeeper applications registered yet</p>
                <p className="text-[11px] text-gray-400">
                  New shop registrations from merchants in Renukoot will appear here for verification.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.recentShops.map((merch) => (
                  <div
                    key={merch.id}
                    className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between bg-gray-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-black text-sm text-[#17231D]">{merch.name}</h5>
                        <p className="text-[11px] text-gray-500">Owner: {merch.ownerName}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          merch.approvalStatus === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : merch.approvalStatus === "REJECTED"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {merch.approvalStatus}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="flex items-center gap-1 text-[11px]">
                        <span className="font-bold text-gray-400">Phone:</span> {merch.phone}
                      </p>
                      <p className="flex items-center gap-1 text-[11px]">
                        <span className="font-bold text-gray-400">Location:</span> {merch.locality}, PIN {merch.pincode}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        {merch.isActive ? "🟢 Store Online" : "⚪ Store Offline"}
                      </span>
                      <Link
                        href="/shops"
                        className="bg-[#0F5D3A] hover:bg-[#22A06B] text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors inline-block"
                      >
                        Review Store
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
