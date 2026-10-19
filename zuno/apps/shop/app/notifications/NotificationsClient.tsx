"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  RefreshCw,
  ShoppingBag,
  AlertTriangle,
  Info,
  ArrowRight,
} from "lucide-react";
import ShopLayoutShell from "../../components/ShopLayoutShell";
import {
  ShopNotification,
  getShopNotificationsAction,
} from "../../features/notifications/api";

export default function NotificationsClient({
  initialData,
}: {
  initialData: {
    shop: {
      id: string;
      name: string;
      locality: string;
      pincode: string;
      isActive: boolean;
    };
    pendingCount: number;
    notifications: ShopNotification[];
  };
}) {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);

  const refreshNotifications = async () => {
    try {
      setRefreshing(true);
      const refreshed = await getShopNotificationsAction();
      setData(refreshed);
    } catch (err: any) {
      alert(err?.message || "Failed to refresh notifications.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ShopLayoutShell
      shop={data.shop}
      pendingOrdersCount={data.pendingCount}
      title="Store Notifications"
      subtitle={`Live order dispatches, stock alerts and platform announcements for ${data.shop.name}`}
      actions={
        <button
          onClick={refreshNotifications}
          disabled={refreshing}
          title="Refresh notifications"
          aria-label="Refresh notifications"
          className="p-2 text-gray-600 hover:text-[#0F5D3A] hover:bg-emerald-50 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-[#A7D56B]"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin text-[#0F5D3A]" : ""}
          />
        </button>
      }
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-black text-base text-[#17231D]">Recent Alerts</h3>
          <span className="text-xs font-bold text-gray-500">
            {data.notifications.length} notifications
          </span>
        </div>

        {data.notifications.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-emerald-50 text-[#0F5D3A] rounded-2xl flex items-center justify-center">
              <Bell size={26} strokeWidth={1.75} />
            </div>
            <h4 className="text-sm font-bold text-gray-800">All caught up!</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              There are no new store alerts or pending customer order actions right now.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                  notif.isUnread
                    ? "bg-emerald-50/60 border-emerald-200"
                    : "bg-[#F8FAF6] border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      notif.type === "ORDER"
                        ? "bg-amber-100 text-amber-800"
                        : notif.type === "STOCK"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {notif.type === "ORDER" ? (
                      <ShoppingBag size={17} strokeWidth={2} />
                    ) : notif.type === "STOCK" ? (
                      <AlertTriangle size={17} strokeWidth={2} />
                    ) : (
                      <Info size={17} strokeWidth={2} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#17231D]">
                      {notif.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {notif.timeAgo}
                    </span>
                  </div>
                </div>

                {notif.linkHref && (
                  <Link
                    href={notif.linkHref}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0F5D3A] hover:bg-[#22A06B] text-white text-xs font-bold rounded-xl transition flex-shrink-0 shadow-sm"
                  >
                    <span>View</span>
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ShopLayoutShell>
  );
}
