"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  LogOut,
  MapPin,
  ShieldCheck,
  Truck,
  Store,
} from "lucide-react";
import ShopLayoutShell from "../../components/ShopLayoutShell";
import {
  getShopSettingsAction,
  toggleStoreActiveSettingAction,
} from "../../features/settings/api";

export default function SettingsClient({
  initialData,
}: {
  initialData: {
    shop: {
      id: string;
      name: string;
      locality: string;
      pincode: string;
      phone: string;
      isActive: boolean;
      approvalStatus: string;
    };
    pendingCount: number;
  };
}) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [isOnline, setIsOnline] = useState(data.shop.isActive);
  const [toggling, setToggling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refreshSettings = async () => {
    try {
      setRefreshing(true);
      const refreshed = await getShopSettingsAction();
      setData(refreshed);
      setIsOnline(refreshed.shop.isActive);
    } catch (err: any) {
      alert(err?.message || "Failed to refresh settings.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleOnline = async () => {
    if (toggling) return;
    const nextStatus = !isOnline;
    setToggling(true);
    try {
      await toggleStoreActiveSettingAction(nextStatus);
      setIsOnline(nextStatus);
      await refreshSettings();
    } catch (err: any) {
      alert(err?.message || "Failed to toggle status.");
    } finally {
      setToggling(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };

  return (
    <ShopLayoutShell
      shop={data.shop}
      pendingOrdersCount={data.pendingCount}
      title="Store Settings"
      subtitle="Operational preferences, online availability and account configuration"
      actions={
        <button
          onClick={refreshSettings}
          disabled={refreshing}
          title="Refresh settings"
          aria-label="Refresh settings"
          className="p-2 text-gray-600 hover:text-[#0F5D3A] hover:bg-emerald-50 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-[#A7D56B]"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin text-[#0F5D3A]" : ""}
          />
        </button>
      }
    >
      <div className="space-y-6">
        {/* Operational Status Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-base text-[#17231D] flex items-center gap-2">
                <Store size={18} className="text-[#0F5D3A]" />
                <span>Storefront Availability</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                When online, customers nearby in Renukoot can see your storefront and place live orders.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-black px-3 py-1 rounded-full ${
                  isOnline
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {isOnline ? "● Live Online" : "○ Offline"}
              </span>

              <button
                type="button"
                onClick={handleToggleOnline}
                disabled={toggling}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition shadow-sm disabled:opacity-50 ${
                  isOnline
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-[#0F5D3A] hover:bg-[#22A06B]"
                }`}
              >
                {toggling
                  ? "Updating..."
                  : isOnline
                  ? "Set Store Offline"
                  : "Go Online Now"}
              </button>
            </div>
          </div>
        </div>

        {/* Hyperlocal Service Area Settings */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-black text-base text-[#17231D] flex items-center gap-2">
            <MapPin size={18} className="text-[#0F5D3A]" />
            <span>Hyperlocal Delivery Zone</span>
          </h3>
          <p className="text-xs text-gray-500">
            ZUNO matches you automatically with customers and registered delivery partners in your town.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#F8FAF6] border border-gray-200 rounded-xl p-4">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Primary Town
              </span>
              <span className="text-sm font-black text-gray-900 mt-1 block">
                {data.shop.locality || "Renukoot"}
              </span>
            </div>

            <div className="bg-[#F8FAF6] border border-gray-200 rounded-xl p-4">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                PIN Code
              </span>
              <span className="text-sm font-black text-gray-900 mt-1 block">
                {data.shop.pincode || "231217"}
              </span>
            </div>

            <div className="bg-[#F8FAF6] border border-gray-200 rounded-xl p-4">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Delivery Fleet
              </span>
              <span className="text-sm font-black text-[#0F5D3A] mt-1 flex items-center gap-1.5">
                <Truck size={14} />
                <span>ZUNO Fleet Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Account and Sign Out */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-black text-base text-[#17231D] flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#0F5D3A]" />
            <span>Account & Security</span>
          </h3>
          <p className="text-xs text-gray-500">
            Authenticated as registered merchant owner for {data.shop.name}.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <div className="text-xs">
              <span className="text-gray-500">Registered Phone: </span>
              <span className="font-bold text-gray-900">{data.shop.phone || "On file"}</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <span>Sign Out of Dashboard</span>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </ShopLayoutShell>
  );
}
