"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone}`;
      const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
      if (error) {
        setErrorMessage(error.message);
      } else {
        setOtpSent(true);
        setInfoMessage(`Verification OTP sent to ${formattedPhone}.`);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMessage("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone}`;
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp.trim(),
        type: "sms",
      });

      if (error || !data.user) {
        setErrorMessage(error?.message || "Invalid or expired OTP.");
        return;
      }

      await checkAdminRoleAndRedirect(data.user.id);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        setErrorMessage(error?.message || "Invalid credentials.");
        return;
      }

      await checkAdminRoleAndRedirect(data.user.id);
    } catch (err: any) {
      setErrorMessage(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const checkAdminRoleAndRedirect = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", userId)
      .maybeSingle();

    if (error || !profile) {
      await supabase.auth.signOut();
      setErrorMessage("Profile record not found for this administrator.");
      return;
    }

    if (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN") {
      await supabase.auth.signOut();
      setErrorMessage(
        "Access Denied: Your account role is not authorized for Super Admin Control Center."
      );
      return;
    }

    router.push("/shops");
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] text-[#17231D] flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF4E5] border border-[#0F5D3A] rounded-full text-xs font-bold text-[#0F5D3A]">
            <span>🛡️</span>
            <span>Super Admin Portal</span>
          </div>
          <h1 className="text-2xl font-black text-[#17231D]">Platform Control Sign In</h1>
          <p className="text-xs text-gray-500 font-medium">
            Restricted access for ZUNO Platform Administrators & Governance
          </p>
        </div>

        {/* Method Toggle */}
        <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("phone");
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition ${
              authMethod === "phone"
                ? "bg-white text-[#0F5D3A] shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Mobile OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("email");
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition ${
              authMethod === "email"
                ? "bg-white text-[#0F5D3A] shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Email / Password
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold">
            {errorMessage}
          </div>
        )}

        {infoMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
            {infoMessage}
          </div>
        )}

        {/* Phone OTP Form */}
        {authMethod === "phone" && (
          <>
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Registered Admin Phone
                  </label>
                  <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-[#0F5D3A]">
                    <span className="bg-gray-100 px-3 py-2.5 text-xs font-bold text-gray-700 border-r border-gray-300">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit administrator mobile"
                      className="flex-1 px-3 py-2 text-xs font-bold text-gray-900 outline-none"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0F5D3A] hover:bg-[#157248] text-white rounded-xl text-xs font-extrabold transition shadow-sm disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : "Send Verification OTP →"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2.5 text-center tracking-widest text-lg font-mono font-black border border-gray-300 rounded-xl outline-none focus:border-[#0F5D3A]"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0F5D3A] hover:bg-[#157248] text-white rounded-xl text-xs font-extrabold transition shadow-sm disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Access Super Admin →"}
                </button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-center text-[11px] font-bold text-gray-500 hover:text-gray-800"
                >
                  Change phone number
                </button>
              </form>
            )}
          </>
        )}

        {/* Email Form */}
        {authMethod === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zuno.in"
                className="w-full px-3 py-2 text-xs font-bold border border-gray-300 rounded-xl outline-none focus:border-[#0F5D3A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs font-bold border border-gray-300 rounded-xl outline-none focus:border-[#0F5D3A]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0F5D3A] hover:bg-[#157248] text-white rounded-xl text-xs font-extrabold transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In to Control Center →"}
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 leading-normal">
            Unauthorized login attempts are audited and logged with IP, timestamp, and client user-agent.
          </p>
        </div>
      </div>
    </div>
  );
}
