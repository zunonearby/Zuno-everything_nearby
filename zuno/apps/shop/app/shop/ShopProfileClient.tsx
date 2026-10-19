"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Pencil,
  CheckCircle2,
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
import ShopLayoutShell from "../../components/ShopLayoutShell";
import {
  ShopProfileData,
  getShopProfileAction,
  updateShopProfileAction,
} from "../../features/shop/api";

export default function ShopProfileClient({
  initialData,
}: {
  initialData: {
    shop: ShopProfileData;
    pendingCount: number;
  };
}) {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData.shop.name,
    description: initialData.shop.description,
    phone: initialData.shop.phone,
    addressLine: initialData.shop.addressLine,
    locality: initialData.shop.locality,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refreshProfile = async () => {
    try {
      setRefreshing(true);
      const refreshed = await getShopProfileAction();
      setData(refreshed);
    } catch (err: any) {
      alert(err?.message || "Failed to refresh profile.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    try {
      await updateShopProfileAction(formData);
      setSuccessMessage("Shop profile updated successfully!");
      setIsEditing(false);
      await refreshProfile();
    } catch (err: any) {
      alert(err?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const shopInitials = (data.shop.name || "SK")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ShopLayoutShell
      shop={data.shop}
      pendingOrdersCount={data.pendingCount}
      title="Shop Profile"
      subtitle="Storefront identity, registration status and local business details"
      actions={
        <button
          onClick={refreshProfile}
          disabled={refreshing}
          title="Refresh shop profile"
          aria-label="Refresh shop profile"
          className="p-2 text-gray-600 hover:text-[#0F5D3A] hover:bg-emerald-50 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-[#A7D56B]"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin text-[#0F5D3A]" : ""}
          />
        </button>
      }
    >
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-700" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-800 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Profile Header Hero */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-[#0F5D3A] text-[#A7D56B] flex items-center justify-center text-3xl font-black shadow-md flex-shrink-0">
            {shopInitials}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#17231D]">
                {data.shop.name}
              </h2>
              <span className="bg-emerald-100 text-[#0F5D3A] border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                {data.shop.approvalStatus}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  data.shop.isActive
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {data.shop.isActive ? "Store Online" : "Store Offline"}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {data.shop.locality} • PIN {data.shop.pincode} • Registered on{" "}
              {new Date(data.shop.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            {data.shop.description && (
              <p className="text-xs text-gray-600 max-w-lg pt-1">
                {data.shop.description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
            isEditing
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-[#0F5D3A] hover:bg-[#22A06B] text-white"
          }`}
        >
          <Pencil size={14} />
          <span>{isEditing ? "Cancel Editing" : "Edit Store Profile"}</span>
        </button>
      </div>

      {/* Main Grid: Details or Edit Form */}
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5"
        >
          <h3 className="font-black text-base text-[#17231D]">
            Edit Storefront Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Store / Shop Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F8FAF6] border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-semibold focus:outline-none focus:border-[#22A06B]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Owner Contact Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#F8FAF6] border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-semibold focus:outline-none focus:border-[#22A06B]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-gray-700 block mb-1">
                Shop Description / Bio
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Fresh dairy, groceries, daily essentials..."
                className="w-full bg-[#F8FAF6] border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-semibold focus:outline-none focus:border-[#22A06B]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Address Line / Landmark
              </label>
              <input
                type="text"
                required
                value={formData.addressLine}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine: e.target.value })
                }
                className="w-full bg-[#F8FAF6] border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-semibold focus:outline-none focus:border-[#22A06B]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">
                Locality / Area (Renukoot)
              </label>
              <input
                type="text"
                required
                value={formData.locality}
                onChange={(e) =>
                  setFormData({ ...formData, locality: e.target.value })
                }
                className="w-full bg-[#F8FAF6] border border-gray-200 rounded-xl p-3 text-sm text-gray-900 font-semibold focus:outline-none focus:border-[#22A06B]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#0F5D3A] hover:bg-[#22A06B] rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <CheckCircle2 size={14} />
              <span>{isSaving ? "Saving Changes..." : "Save Profile Changes"}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-[#17231D] uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Building2 size={16} className="text-[#0F5D3A]" />
              <span>Business Information</span>
            </h3>
            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Store Name:</span>
                <span className="font-bold text-gray-900">{data.shop.name}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Contact Phone:</span>
                <span className="font-bold text-gray-900">{data.shop.phone || "Not set"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Address:</span>
                <span className="font-bold text-gray-900">{data.shop.addressLine || "Renukoot Market"}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Locality:</span>
                <span className="font-bold text-gray-900">{data.shop.locality}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">PIN Code:</span>
                <span className="font-bold text-gray-900">{data.shop.pincode}</span>
              </div>
            </div>
          </div>

          {/* Verification & Compliance */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-[#17231D] uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#0F5D3A]" />
              <span>Verification & Compliance</span>
            </h3>
            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-gray-500">Super Admin Approval:</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 size={12} />
                  <span>{data.shop.approvalStatus}</span>
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Hyperlocal Service Area:</span>
                <span className="font-bold text-gray-900">Renukoot (PIN 231217)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Database Role:</span>
                <span className="font-bold text-gray-900">Authorized Merchant Owner</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">Security & Isolation:</span>
                <span className="font-bold text-emerald-700">PostgreSQL RLS Protected</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </ShopLayoutShell>
  );
}
