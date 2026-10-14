"use client";

import React, { useState } from "react";

// Demo data for Shopkeeper Dashboard
const sampleOrders = [
  {
    id: "#ZN-1082",
    customer: "Ananya Sharma",
    items: "5 items (Tomatoes, Spinach, Milk, Bread, Apples)",
    amount: "₹340",
    time: "10 mins ago",
    status: "Pending",
    statusColor: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "#ZN-1081",
    customer: "Vikram Mehta",
    items: "2 items (Fresh Bananas 1kg, Butter 200g)",
    amount: "₹180",
    time: "25 mins ago",
    status: "Preparing",
    statusColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "#ZN-1080",
    customer: "Priya Patel",
    items: "4 items (Wheat Flour 5kg, Mustard Oil 1L, Sugar 1kg)",
    amount: "₹620",
    time: "45 mins ago",
    status: "Out for Delivery",
    statusColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "#ZN-1079",
    customer: "Rohan Gupta",
    items: "3 items (Potatoes 2kg, Onions 2kg, Garlic 250g)",
    amount: "₹240",
    time: "1 hour ago",
    status: "Delivered",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    id: "#ZN-1078",
    customer: "Sunita Verma",
    items: "6 items (Paneer 200g, Curd 500g, Milk 2L, Bread)",
    amount: "₹450",
    time: "2 hours ago",
    status: "Delivered",
    statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
];

const sampleProducts = [
  {
    id: "p1",
    name: "Fresh Farm Tomatoes",
    category: "Vegetables",
    price: "₹25 / 500g",
    stock: "45 kg left",
    inStock: true,
    emoji: "🍅",
    bgColor: "bg-red-50 text-red-600",
  },
  {
    id: "p2",
    name: "Organic Spinach Bunch",
    category: "Vegetables",
    price: "₹20 / bunch",
    stock: "12 bunches left",
    inStock: true,
    emoji: "🥬",
    bgColor: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "p3",
    name: "Robusta Bananas",
    category: "Fruits",
    price: "₹40 / 6 pcs",
    stock: "18 dozen left",
    inStock: true,
    emoji: "🍌",
    bgColor: "bg-amber-50 text-amber-600",
  },
  {
    id: "p4",
    name: "Fresh Dairy Milk 1L",
    category: "Dairy",
    price: "₹66 / pouch",
    stock: "Out of Stock",
    inStock: false,
    emoji: "🥛",
    bgColor: "bg-blue-50 text-blue-600",
  },
];

export default function ShopDashboard() {
  const [isShopOnline, setIsShopOnline] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = sampleOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#17231D] flex flex-col md:flex-row font-sans">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0F5D3A] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <img src="/brandlogo.png" alt="ZUNO Logo" className="h-8 w-auto object-contain" />
          <span className="text-xs text-[#A7D56B] block font-medium">Shopkeeper</span>
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
          {/* Logo Section */}
          <div className="hidden md:flex items-center gap-3 p-6 border-b border-[#18754b]">
            <img src="/brandlogo.png" alt="ZUNO Logo" className="h-9 w-auto object-contain" />
            <p className="text-xs text-[#A7D56B] font-semibold tracking-wider uppercase">
              Shopkeeper Hub
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "orders", label: "Orders", icon: "📦", badge: "2 New" },
              { id: "products", label: "Products", icon: "🛒" },
              { id: "inventory", label: "Inventory", icon: "📋" },
              { id: "profile", label: "Shop Profile", icon: "🏪" },
              { id: "earnings", label: "Earnings", icon: "💰" },
              { id: "analytics", label: "Analytics", icon: "📈" },
              { id: "notifications", label: "Notifications", icon: "🔔" },
              { id: "settings", label: "Settings", icon: "⚙️" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? "bg-[#22A06B] text-white shadow-sm"
                    : "text-[#D2E7D9] hover:bg-[#157248] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#A7D56B] text-[#0F5D3A] text-xs font-black px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Shop Info Footer */}
        <div className="p-4 border-t border-[#18754b] bg-[#0c4a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A7D56B] text-[#0F5D3A] font-extrabold flex items-center justify-center text-sm shadow">
              SK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#A7D56B] font-bold truncate">Shivam Groceries</p>
              <p className="text-[11px] text-emerald-200 truncate">Sector 14 Market</p>
            </div>
            <button
              title="Logout"
              className="text-emerald-300 hover:text-white text-xs font-semibold p-1"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-[#17231D]">Shop Dashboard</h2>
            <p className="text-xs text-gray-500 font-medium">Manage your storefront, inventory and live customer orders</p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            {/* Shop Online Status Toggle */}
            <div className="flex items-center gap-2 bg-[#F8FAF6] border border-gray-200 px-3 py-1.5 rounded-full shadow-inner">
              <span className={`w-2.5 h-2.5 rounded-full ${isShopOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-xs font-bold text-gray-700">
                {isShopOnline ? "Store Online" : "Store Offline"}
              </span>
              <button
                onClick={() => setIsShopOnline(!isShopOnline)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  isShopOnline ? "bg-[#22A06B]" : "bg-gray-300"
                }`}
                role="switch"
                aria-checked={isShopOnline}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    isShopOnline ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:text-[#0F5D3A] hover:bg-emerald-50 rounded-lg transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#0F5D3A] via-[#157248] to-[#22A06B] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="bg-[#A7D56B] text-[#0F5D3A] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                HYPERLOCAL MERCHANT
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-3">
                Good morning, Shivam! 👋
              </h3>
              <p className="text-emerald-100 text-sm mt-1 leading-relaxed">
                Here’s what’s happening with Shivam Groceries today. You have <span className="font-bold text-white underline decoration-[#A7D56B] underline-offset-4">2 pending orders</span> ready for packing.
              </p>
            </div>
            {/* Background Decorative Accent */}
            <div className="absolute right-4 -bottom-6 opacity-20 text-8xl pointer-events-none select-none">
              🥦
            </div>
          </div>

          {/* Metric KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Today's Revenue",
                value: "₹14,250",
                change: "+12.4% vs yesterday",
                isPositive: true,
                icon: "💰",
                bgColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
              },
              {
                title: "Today's Orders",
                value: "28 Orders",
                change: "24 fulfilled",
                isPositive: true,
                icon: "📦",
                bgColor: "bg-blue-50 text-blue-700 border-blue-100",
              },
              {
                title: "Pending Orders",
                value: "2 Orders",
                change: "Requires action",
                isPositive: false,
                icon: "⏳",
                bgColor: "bg-amber-50 text-amber-700 border-amber-100",
              },
              {
                title: "Store Rating",
                value: "4.8 ★",
                change: "Based on 142 reviews",
                isPositive: true,
                icon: "⭐",
                bgColor: "bg-purple-50 text-purple-700 border-purple-100",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.title}</span>
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border ${stat.bgColor}`}>
                    {stat.icon}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-black text-[#17231D]">{stat.value}</span>
                  <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1">
                    {stat.isPositive ? "▲" : "●"} {stat.change}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid: Orders Management Preview + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col (2 spans): Order Management Table */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-black text-lg text-[#17231D] flex items-center gap-2">
                    Recent Orders <span className="bg-emerald-100 text-[#0F5D3A] text-xs font-black px-2 py-0.5 rounded-full">Live</span>
                  </h4>
                  <p className="text-xs text-gray-500">Incoming grocery and fresh produce customer orders</p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filter by ID or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-56 text-xs bg-[#F8FAF6] border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#22A06B]"
                  />
                </div>
              </div>

              {/* Order List / Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items Summary</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-3 font-extrabold text-[#0F5D3A]">{order.id}</td>
                        <td className="py-3 px-3 font-semibold text-gray-900">
                          {order.customer}
                          <span className="block text-[10px] text-gray-400 font-normal">{order.time}</span>
                        </td>
                        <td className="py-3 px-3 text-gray-600 max-w-[200px] truncate">{order.items}</td>
                        <td className="py-3 px-3 font-black text-gray-900">{order.amount}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button className="bg-[#0F5D3A] hover:bg-[#22A06B] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                            Process
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Col: Quick Actions & Store Info */}
            <div className="space-y-6">
              {/* Quick Actions Panel */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                <h4 className="font-black text-base text-[#17231D]">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/70 rounded-xl text-left transition-colors group">
                    <span className="text-xl block mb-1">➕</span>
                    <span className="text-xs font-extrabold text-[#0F5D3A] group-hover:underline">Add Product</span>
                    <span className="text-[10px] text-gray-500 block">Add to store menu</span>
                  </button>
                  <button className="p-3 bg-blue-50 border border-blue-100 hover:bg-blue-100/70 rounded-xl text-left transition-colors group">
                    <span className="text-xl block mb-1">📦</span>
                    <span className="text-xs font-extrabold text-blue-900 group-hover:underline">Inventory</span>
                    <span className="text-[10px] text-gray-500 block">Update stock & price</span>
                  </button>
                  <button className="p-3 bg-purple-50 border border-purple-100 hover:bg-purple-100/70 rounded-xl text-left transition-colors group">
                    <span className="text-xl block mb-1">📋</span>
                    <span className="text-xs font-extrabold text-purple-900 group-hover:underline">View Orders</span>
                    <span className="text-[10px] text-gray-500 block">Manage all orders</span>
                  </button>
                  <button className="p-3 bg-amber-50 border border-amber-100 hover:bg-amber-100/70 rounded-xl text-left transition-colors group">
                    <span className="text-xl block mb-1">🏪</span>
                    <span className="text-xs font-extrabold text-amber-900 group-hover:underline">Shop Profile</span>
                    <span className="text-[10px] text-gray-500 block">Hours & delivery area</span>
                  </button>
                </div>
              </div>

              {/* Delivery Partner Assigned Box */}
              <div className="bg-[#F8FAF6] border border-[#22A06B]/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0F5D3A] uppercase tracking-wider">Assigned Delivery Rider</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F5D3A] text-white flex items-center justify-center font-bold text-sm">
                    RP
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-900">Rahul Prasad</h5>
                    <p className="text-[11px] text-gray-500">Assigned to order #ZN-1080 · 0.4 km away</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Management Preview Grid */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-black text-lg text-[#17231D]">Top Featured Products</h4>
                <p className="text-xs text-gray-500">Quick view of items listed in Shivam Groceries storefront</p>
              </div>
              <button className="text-xs font-bold text-[#0F5D3A] hover:text-[#22A06B] transition-colors">
                View All Products →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sampleProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="border border-gray-100 rounded-xl p-4 flex flex-col justify-between bg-gray-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${prod.bgColor}`}>
                      {prod.emoji}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prod.inStock ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                      {prod.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h5 className="font-black text-sm text-[#17231D]">{prod.name}</h5>
                    <span className="text-[11px] text-gray-500 font-medium block">{prod.category}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-[#0F5D3A]">{prod.price}</span>
                      <span className="text-[10px] text-gray-400 block">{prod.stock}</span>
                    </div>
                    <button className="text-xs font-bold text-gray-600 hover:text-[#0F5D3A] border border-gray-200 hover:border-[#0F5D3A] px-2.5 py-1 rounded-lg transition-colors">
                      Edit
                    </button>
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
