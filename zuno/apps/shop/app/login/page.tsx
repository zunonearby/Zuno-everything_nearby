"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { requestShopkeeperOtp, verifyShopkeeperOtp } from "../../features/auth/api";
import { createClient } from "../../lib/supabase";
import { isDevMockAuthEnabled } from "@zuno/config";

function ShopLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectDestination = searchParams.get("redirect") || "/dashboard";
  const initialPhone = searchParams.get("phone") || "";

  const [phone, setPhone] = useState(initialPhone.replace(/\D/g, "").slice(-10));
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const devMockActive = isDevMockAuthEnabled();

  const handleDevMockLogin = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/dev-mock-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Development mock login failed.");
        setLoading(false);
        return;
      }

      router.refresh();
      if (data.isApproved) {
        router.push(redirectDestination);
      } else {
        router.push(data.redirect || `/status?phone=${phone.replace(/\D/g, "").slice(-10)}`);
      }
    } catch (err: any) {
      setError(err?.message || "Development login failed.");
      setLoading(false);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);
    // Requirement 4: Ensure resend requests fresh OTP and does not retain expired code
    setOtp("");

    try {
      const res = await requestShopkeeperOtp(cleanPhone);
      setOtpSent(true);
      setMessage(res.message);
    } catch (err: any) {
      setError(err?.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await verifyShopkeeperOtp(phone, cleanOtp);
      if (!res.success || !res.user) {
        setError(res.error || "Invalid verification code.");
        setOtp("");
        setLoading(false);
        return;
      }

      // Check shop registration and approval status server-side
      const supabase = createClient();
      const { data: shop } = await supabase
        .from("shops")
        .select("id, is_approved, approval_status, owner_id")
        .eq("owner_id", res.user.id)
        .maybeSingle();

      router.refresh();

      if (!shop) {
        router.push("/register");
        return;
      }

      if (shop.is_approved && shop.approval_status === "APPROVED") {
        router.push(redirectDestination);
      } else {
        router.push(`/status?phone=${phone.replace(/\D/g, "").slice(-10)}`);
      }
    } catch (err: any) {
      setError(err?.message || "Verification failed. Please try again.");
      setOtp("");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF4E5] border border-[#0F5D3A] rounded-full text-xs font-bold text-[#0F5D3A]">
          ZUNO Shopkeeper Portal
        </div>
        <h1 className="text-2xl font-extrabold text-[#17231D]">
          {otpSent ? "Verify Mobile Number" : "Welcome Back"}
        </h1>
        <p className="text-xs text-gray-500">
          {otpSent
            ? `Enter the 6-digit code sent to +91 ${phone.replace(/\D/g, "").slice(-10)}`
            : "Sign in to manage inventory, catalog prices, and customer orders."}
        </p>
      </div>

      {devMockActive && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-left">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
            <span>⚠️</span>
            <span>DEV MOCK AUTH MODE ACTIVE (Local Testing)</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-tight">
            SMS provider is bypassed for local development. Authenticates against your approved shop in Supabase without sending SMS.
          </p>
          <button
            type="button"
            onClick={handleDevMockLogin}
            disabled={loading}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>⚡</span>
            <span>{loading ? "Authenticating..." : "Development Login (No SMS)"}</span>
          </button>
        </div>
      )}

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold text-center">
          {error}
        </div>
      )}

      {!otpSent ? (
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
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
                className="flex-1 px-3 py-2.5 text-sm font-bold text-[#17231D] outline-none"
                maxLength={10}
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || phone.replace(/\D/g, "").length < 10}
            className="w-full py-3 bg-[#0F5D3A] hover:bg-[#0c4b2e] text-white rounded-xl text-sm font-extrabold transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Sign In with OTP →"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#17231D] mb-1">
              6-Digit Verification Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              className="w-full text-center tracking-widest text-lg font-black py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#0F5D3A]"
              maxLength={6}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.trim().length < 6}
            className="w-full py-3 bg-[#0F5D3A] hover:bg-[#0c4b2e] text-white rounded-xl text-sm font-extrabold transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Enter Dashboard →"}
          </button>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setError(null);
                setMessage(null);
              }}
              className="font-semibold text-gray-600 hover:text-gray-900 underline"
            >
              Change Mobile Number
            </button>
            <button
              type="button"
              onClick={() => handleSendOtp()}
              disabled={loading}
              className="font-semibold text-[#0F5D3A] hover:underline disabled:opacity-50"
            >
              {loading ? "Sending fresh OTP..." : "Resend OTP"}
            </button>
          </div>

          {devMockActive && (
            <div className="pt-2 border-t border-dashed border-gray-200">
              <button
                type="button"
                onClick={handleDevMockLogin}
                disabled={loading}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black transition"
              >
                ⚡ Development Login (No SMS)
              </button>
            </div>
          )}
        </form>
      )}

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
  );
}

export default function ShopLoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF6] flex flex-col justify-center items-center p-4 font-sans">
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-gray-500">
            Loading login portal...
          </div>
        }
      >
        <ShopLoginForm />
      </Suspense>
    </div>
  );
}
