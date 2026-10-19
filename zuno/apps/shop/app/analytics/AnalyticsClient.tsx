"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Boxes,
  RefreshCw,
  BarChart3,
  Layers,
} from "lucide-react";
import ShopLayoutShell from "../../components/ShopLayoutShell";
import {
  AnalyticsData,
  getShopAnalyticsAction,
} from "../../features/analytics/api";

export default function AnalyticsClient({
  initialData,
}: {
  initialData: AnalyticsData;
}) {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);

  const refreshAnalytics = async () => {
    try {
      setRefreshing(true);
      const refreshed = await getShopAnalyticsAction();
      setData(refreshed);
    } catch (err: any) {
      alert(err?.message || "Failed to refresh analytics.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ShopLayoutShell
      shop={data.shop}
      pendingOrdersCount={data.pendingCount}
      title="Store Analytics"
      subtitle={`Operational performance and inventory distribution for ${data.shop.name}`}
      actions={
        <button
          onClick={refreshAnalytics}
          disabled={refreshing}
          title="Refresh analytics"
          aria-label="Refresh analytics"
          className="p-2 text-gray-600 hover:text-[#0F5D3A] hover:bg-emerald-50 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-[#A7D56B]"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin text-[#0F5D3A]" : ""}
          />
        </button>
      }
    >
      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F5D3A] flex items-center justify-center">
              <ShoppingBag size={16} strokeWidth={2} />
            </span>
          </div>
          <span className="text-2xl font-black text-[#17231D] mt-2 block">
            {data.metrics.totalOrders}
          </span>
          <p className="text-xs text-gray-400 mt-1">Lifetime customer orders</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Fulfillment Rate
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={16} strokeWidth={2} />
            </span>
          </div>
          <span className="text-2xl font-black text-emerald-600 mt-2 block">
            {data.metrics.fulfillmentRate}%
          </span>
          <p className="text-xs text-gray-400 mt-1">
            {data.metrics.deliveredOrders} delivered successfully
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
              Active / Processing
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock size={16} strokeWidth={2} />
            </span>
          </div>
          <span className="text-2xl font-black text-blue-600 mt-2 block">
            {data.metrics.activeOrders}
          </span>
          <p className="text-xs text-gray-400 mt-1">In fulfillment pipeline</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
              Total Stock Units
            </span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Boxes size={16} strokeWidth={2} />
            </span>
          </div>
          <span className="text-2xl font-black text-purple-600 mt-2 block">
            {data.metrics.totalStockUnits} Units
          </span>
          <p className="text-xs text-gray-400 mt-1">Available in store inventory</p>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-black text-base text-[#17231D] flex items-center gap-2">
            <BarChart3 size={16} className="text-[#0F5D3A]" />
            <span>Order Status Breakdown</span>
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Delivered & Fulfilled",
                count: data.metrics.deliveredOrders,
                color: "bg-emerald-500",
                textColor: "text-emerald-700",
              },
              {
                label: "Active In Pipeline",
                count: data.metrics.activeOrders,
                color: "bg-blue-500",
                textColor: "text-blue-700",
              },
              {
                label: "Cancelled / Rejected",
                count: data.metrics.cancelledOrders,
                color: "bg-red-500",
                textColor: "text-red-700",
              },
            ].map((stat, i) => {
              const pct =
                data.metrics.totalOrders > 0
                  ? Math.round((stat.count / data.metrics.totalOrders) * 100)
                  : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-700">{stat.label}</span>
                    <span className={stat.textColor}>
                      {stat.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${stat.color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-black text-base text-[#17231D] flex items-center gap-2">
            <Layers size={16} className="text-[#0F5D3A]" />
            <span>Inventory by Category</span>
          </h3>
          {data.categoryDistribution.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">
              No inventory categorized yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.categoryDistribution.map((cat, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-800 block">{cat.category}</span>
                    <span className="text-[10px] text-gray-400">
                      {cat.itemCount} unique products listed
                    </span>
                  </div>
                  <span className="font-black text-[#0F5D3A] bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {cat.totalStock} units in stock
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ShopLayoutShell>
  );
}
