"use client";

import React, { useState } from "react";
import Link from "next/link";

// Demo Data for Super Admin Dashboard
const platformOrders = [
  {
    id: "#ZN-9045",
    customer: "Ananya Sharma",
    shop: "Shivam Groceries",
    amount: "₹340",
    paymentStatus: "Paid (UPI)",
    paymentColor: "bg-emerald-100 text-emerald-800",
    orderStatus: "Out for Delivery",
    orderColor: "bg-purple-100 text-purple-800",
    time: "5 mins ago",
  },
  {
    id: "#ZN-9044",
    customer: "Vikram Mehta",
    shop: "Fresh Vegetable Store",
    amount: "₹180",
    paymentStatus: "Paid (Card)",
    paymentColor: "bg-emerald-100 text-emerald-800",
    orderStatus: "Preparing",
    orderColor: "bg-blue-100 text-blue-800",
    time: "12 mins ago",
  },
  {
    id: "#ZN-9043",
    customer: "Sunita Verma",
    shop: "Daily Needs Grocery",
    amount: "₹1,250",
    paymentStatus: "Paid (UPI)",
    paymentColor: "bg-emerald-100 text-emerald-800",
    orderStatus: "Delivered",
    orderColor: "bg-emerald-100 text-emerald-800",
    time: "28 mins ago",
  },
  {
    id: "#ZN-9042",
    customer: "Karan Singh",
    shop: "Green Mart Organic",
    amount: "₹590",
    paymentStatus: "Pending (COD)",
    paymentColor: "bg-amber-100 text-amber-800",
    orderStatus: "Dispatched",
    orderColor: "bg-purple-100 text-purple-800",
    time: "40 mins ago",
  },
  {
    id: "#ZN-9041",
    customer: "Priya Patel",
    shop: "Sharma General Store",
    amount: "₹420",
    paymentStatus: "Paid (NetBanking)",
    paymentColor: "bg-emerald-100 text-emerald-800",
    orderStatus: "Delivered",
    orderColor: "bg-emerald-100 text-emerald-800",
    time: "1 hour ago",
  },
];

const merchantOnboardings = [
  {
    id: "m1",
    name: "Aman Fresh Fruits & Veggies",
    owner: "Aman Verma",
    category: "Fruits & Vegetables",
    location: "Sector 18 Market, Noida",
    status: "Verified",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    date: "Sep 28, 2026",
  },
  {
    id: "m2",
    name: "City Supermarket & Dairy",
    owner: "Sanjay Kumar",
    category: "Grocery & Dairy",
    location: "Indirapuram, Ghaziabad",
    status: "Pending Verification",
    statusColor: "bg-amber-100 text-amber-800 border-amber-200",
    date: "Sep 29, 2026",
  },
  {
    id: "m3",
    name: "Organic Roots Store",
    owner: "Neha Gupta",
    category: "Organic Grocery",
    location: "Vasant Kunj, New Delhi",
    status: "Verified",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    date: "Sep 27, 2026",
  },
];

const activityLogs = [
  {
    id: "act-1",
    title: "New Shop Onboarded",
    description: "City Supermarket & Dairy submitted verification documents",
    time: "10 mins ago",
    icon: "🏪",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    id: "act-2",
    title: "High Demand Surge",
    description: "Sector 14 experiencing +35% order volume surge in Vegetables",
    time: "25 mins ago",
    icon: "📈",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    id: "act-3",
    title: "Delivery Rider Onboarded",
    description: "Delivery partner Rahul Prasad verified and marked online",
    time: "1 hour ago",
    icon: "🛵",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    id: "act-4",
    title: "Platform Security Audit",
    description: "Automated RLS & Auth permission check passed cleanly",
    time: "3 hours ago",
    icon: "🛡️",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = platformOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shop.toLowerCase().includes(searchTerm.toLowerCase())
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
              { id: "overview", label: "Overview", icon: "🌐" },
              { id: "customers", label: "Customers", icon: "👥" },
              { id: "shopkeepers", label: "Shopkeepers", icon: "🏪" },
              { id: "shops", label: "Shops", icon: "🛍️" },
              { id: "products", label: "Products Catalog", icon: "🥦" },
              { id: "categories", label: "Categories", icon: "🏷️" },
              { id: "orders", label: "Orders", icon: "📦", badge: "Live" },
              { id: "deliveries", label: "Deliveries", icon: "🛵" },
              { id: "payments", label: "Payments", icon: "💳" },
              { id: "revenue", label: "Revenue & GMV", icon: "💵" },
              { id: "analytics", label: "Platform Analytics", icon: "📊" },
              { id: "activity", label: "Activity Logs", icon: "📋" },
              { id: "settings", label: "System Settings", icon: "⚙️" },
            ].map((item) => {
              const isShops = item.id === "shops" || item.id === "shopkeepers";
              const content = (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#A7D56B] text-[#0F5D3A] text-[10px] font-black px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              );

              if (isShops) {
                return (
                  <Link
                    key={item.id}
                    href="/shops"
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-[#D2E7D9] hover:bg-[#157248] hover:text-white"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === item.id
                      ? "bg-[#22A06B] text-white shadow-sm"
                      : "text-[#D2E7D9] hover:bg-[#157248] hover:text-white"
                  }`}
                >
                  {content}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Super Admin Profile Info */}
        <div className="p-4 border-t border-[#18754b] bg-[#0c4a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A7D56B] text-[#0F5D3A] font-extrabold flex items-center justify-center text-sm">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-black truncate">Platform Admin</p>
              <p className="text-[10px] text-[#A7D56B] truncate font-semibold">SUPER_ADMIN Role</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-[#17231D]">Platform Operations Overview</h2>
            <p className="text-xs text-gray-500 font-medium">Real-time status of customers, shops, orders & platform activity</p>
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
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-[#0F5D3A]">
                System Healthy
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
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
                Monitor live grocery commerce, shop onboarding, order fulfillment and platform health across all active regions.
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
                value: "24,850",
                change: "+1,240 this month",
                icon: "👥",
                bgColor: "bg-blue-50 text-blue-700 border-blue-100",
              },
              {
                title: "Active Shops",
                value: "1,420",
                change: "+38 new shops",
                icon: "🏪",
                bgColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
              },
              {
                title: "Today's Orders",
                value: "3,890",
                change: "98.4% fulfillment",
                icon: "📦",
                bgColor: "bg-purple-50 text-purple-700 border-purple-100",
              },
              {
                title: "Active Deliveries",
                value: "214 Rider Tasks",
                change: "Average 18 min drop",
                icon: "🛵",
                bgColor: "bg-amber-50 text-amber-700 border-amber-100",
              },
              {
                title: "Platform GMV Today",
                value: "₹4,85,200",
                change: "+14.8% vs last week",
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
                  <p className="text-xs text-gray-500">Real-time order stream across all merchant shops</p>
                </div>
                <span className="text-xs font-bold text-[#0F5D3A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Total Today: 3,890 Orders
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Shop Name</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-3 font-extrabold text-[#0F5D3A]">{ord.id}</td>
                        <td className="py-3 px-3 font-semibold text-gray-900">{ord.customer}</td>
                        <td className="py-3 px-3 text-gray-700 font-medium">{ord.shop}</td>
                        <td className="py-3 px-3 font-black text-gray-900">{ord.amount}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ord.paymentColor}`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${ord.orderColor}`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Col: Platform Activity Log Stream */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h4 className="font-black text-base text-[#17231D]">Platform Activity Feed</h4>
                <span className="text-[10px] font-bold text-gray-400">Live</span>
              </div>

              <div className="space-y-3">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border flex-shrink-0 ${log.color}`}>
                      {log.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-gray-900 truncate">{log.title}</h5>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">{log.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-1 leading-snug">{log.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Merchant Onboardings Overview Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-black text-lg text-[#17231D]">Merchant Onboarding & Verification</h4>
                <p className="text-xs text-gray-500">Review local shop registration requests and verification status</p>
              </div>
              <Link
                href="/shops"
                className="text-xs font-bold text-[#0F5D3A] hover:text-[#22A06B] transition-colors"
              >
                View All Merchants →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {merchantOnboardings.map((merch) => (
                <div
                  key={merch.id}
                  className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between bg-gray-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-black text-sm text-[#17231D]">{merch.name}</h5>
                      <p className="text-[11px] text-gray-500">Owner: {merch.owner}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${merch.statusColor}`}>
                      {merch.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p className="flex items-center gap-1 text-[11px]">
                      <span className="font-bold text-gray-400">Category:</span> {merch.category}
                    </p>
                    <p className="flex items-center gap-1 text-[11px]">
                      <span className="font-bold text-gray-400">Location:</span> {merch.location}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Applied: {merch.date}</span>
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
          </div>
        </div>
      </main>
    </div>
  );
}
