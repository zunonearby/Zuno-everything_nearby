"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestShopkeeperOtp } from "../../features/auth/api";

export default function ShopLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await requestShopkeeperOtp(cleanPhone);
      setMessage(res.message);
      router.push(`/status?phone=${cleanPhone}`);
    } catch (err: any) {
      alert(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF4E5] border border-[#0F5D3A] rounded-full text-xs font-bold text-[#0F5D3A]">
            ZUNO Shopkeeper Portal
          </div>
          <h1 className="text-2xl font-extrabold text-[#17231D]">Welcome Back</h1>
          <p className="text-xs text-gray-500">
            Sign in to manage inventory, catalog prices, and customer orders.
          </p>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#17231D] mb-1">
              Mobile Number
            </label>
            <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-[#0F5D3A]">
              <span className="bg-gray-100 px-3 py-2.5 text-sm font-bold text-gray-700 border-r border-gray-300">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="flex-1 px-3 py-2.5 text-sm font-bold text-[#17231D] outline-none"
                maxLength={10}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0F5D3A] hover:bg-[#0c4b2e] text-white rounded-xl text-sm font-extrabold transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Sign In with OTP"}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center space-y-2">
          <p className="text-xs text-gray-500">Want to sell your products on ZUNO?</p>
          <Link
            href="/register"
            className="inline-block px-4 py-2 bg-[#EAF4E5] hover:bg-[#d8ebd2] text-[#0F5D3A] text-xs font-bold rounded-xl transition"
          >
            Register New Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
