"use client";

import React, { useState } from "react";
import Link from "next/link";
import { pincodeSchema } from "@zuno/validation";
import { createPublicClient } from "@/lib/supabase";
import type { ServiceArea } from "@zuno/types";

type CheckStatus = "IDLE" | "LOADING" | "SERVICEABLE" | "UNSUPPORTED" | "ERROR";

export default function ServiceAreaPage() {
  const [pinInput, setPinInput] = useState("231217");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [status, setStatus] = useState<CheckStatus>("IDLE");
  const [resultArea, setResultArea] = useState<ServiceArea | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckPincode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);
    setErrorMessage(null);
    setResultArea(null);

    const trimmed = pinInput.trim();

    // 1. Validate PIN code format using @zuno/validation
    const validationResult = pincodeSchema.safeParse(trimmed);
    if (!validationResult.success) {
      setValidationError("Please enter a valid 6-digit Indian PIN code (e.g. 231217).");
      setStatus("IDLE");
      return;
    }

    // 2. Query Supabase service_areas table
    setStatus("LOADING");
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("service_areas")
        .select("*")
        .eq("pincode", trimmed)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("[ServiceArea] Query error:", error);
        setStatus("ERROR");
        setErrorMessage("Unable to verify PIN code coverage right now. Please try again.");
        return;
      }

      if (data) {
        setResultArea(data as ServiceArea);
        setStatus("SERVICEABLE");
      } else {
        setStatus("UNSUPPORTED");
      }
    } catch (err: any) {
      console.error("[ServiceArea] Unexpected exception:", err);
      setStatus("ERROR");
      setErrorMessage(err?.message || "Connection error. Please check your internet connection.");
    }
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold mb-4">
            Hyperlocal Delivery Radius Checker
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight">
            Check Your <span className="text-[#0F5D3A]">Service Area</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6B7A70] leading-relaxed max-w-2xl mx-auto">
            ZUNO delivers from neighborhood stores to your doorstep within a dedicated radius.
            Verify if your postal PIN code is currently active on our platform.
          </p>
        </div>

        {/* Interactive PIN Checker Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-[#EAEFEA] shadow-md mb-12">
          <form onSubmit={handleCheckPincode} className="max-w-xl mx-auto">
            <label htmlFor="pincode-input" className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-2 text-center">
              Enter 6-Digit Delivery PIN Code
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="pincode-input"
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value.replace(/\D/g, ""));
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="e.g. 231217"
                  className="w-full px-4 py-3.5 rounded-xl border border-[#D1D5DB] text-center sm:text-left text-lg font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0F5D3A] focus:border-transparent transition bg-[#F9FAFB]"
                  aria-describedby={validationError ? "pincode-error" : undefined}
                />
              </div>

              <button
                type="submit"
                disabled={status === "LOADING"}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === "LOADING" ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Check Availability</span>
                )}
              </button>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <p id="pincode-error" className="mt-2.5 text-xs font-semibold text-red-600 text-center">
                {validationError}
              </p>
            )}

            <p className="mt-3 text-xs text-[#9CA3AF] text-center">
              Example starting PIN: <button type="button" onClick={() => { setPinInput("231217"); }} className="font-bold text-[#0F5D3A] underline">231217</button> (Renukoot Central)
            </p>
          </form>

          {/* Result States */}
          <div className="mt-8 pt-6 border-t border-[#EAEFEA]">
            {/* Status: SERVICEABLE */}
            {status === "SERVICEABLE" && resultArea && (
              <div className="p-6 rounded-2xl bg-[#EAF4E5] border border-[#CDE3C4] text-[#0F5D3A]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0F5D3A] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#0F5D3A] text-white text-[11px] font-bold mb-2">
                      Active Hyperlocal Delivery Zone
                    </div>
                    <h3 className="text-lg font-black text-[#111827]">
                      {resultArea.name} ({resultArea.pincode})
                    </h3>
                    <p className="text-xs sm:text-sm text-[#246142] mt-1 leading-relaxed">
                      Great news! ZUNO is currently operational in {resultArea.city}, {resultArea.state}.
                      Verified neighborhood grocery, fruit, and vegetable stores are active in this zone.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href="/download"
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition shadow-sm"
                      >
                        Install Customer App to Order →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status: UNSUPPORTED */}
            {status === "UNSUPPORTED" && (
              <div className="p-6 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    !
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#F59E0B] text-white text-[11px] font-bold mb-2">
                      Service Not Yet Available
                    </div>
                    <h3 className="text-lg font-black text-[#111827]">
                      PIN {pinInput} is not currently active
                    </h3>
                    <p className="text-xs sm:text-sm text-[#78350F] mt-1 leading-relaxed">
                      We currently service Renukoot Central (PIN 231217) and are systematically expanding to
                      neighboring residential colonies. If you are a local shopkeeper interested in partnering,
                      please contact our team.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href="/contact"
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#92400E] text-white hover:bg-[#78350F] transition"
                      >
                        Merchant Partnership Inquiries →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status: ERROR */}
            {status === "ERROR" && (
              <div className="p-6 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <h4 className="font-bold text-sm">Lookup Failed</h4>
                    <p className="text-xs text-[#7F1D1D] mt-0.5">
                      {errorMessage || "Database verification was unsuccessful. Please verify your connection."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Status: IDLE */}
            {status === "IDLE" && (
              <div className="text-center py-4 text-xs text-[#6B7A70]">
                Enter your PIN code above to verify real-time coverage from the official ZUNO database.
              </div>
            )}
          </div>
        </div>

        {/* Coverage Clarifications */}
        <div className="bg-white rounded-3xl p-8 border border-[#EAEFEA] space-y-6">
          <h2 className="text-xl font-black text-[#111827]">Coverage Details & Principles</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-[#4B5563]">
            <div>
              <h3 className="font-bold text-[#111827] mb-1">📍 Local Hub Presence</h3>
              <p className="leading-relaxed text-[#6B7A70]">
                Our active operations hub is stationed in Renukoot Central, ensuring swift rider dispatch
                and continuous order handover from merchant counters.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#111827] mb-1">⚡ Freshness Over Distance</h3>
              <p className="leading-relaxed text-[#6B7A70]">
                We deliberately constrain dispatch radii to keep vegetable, dairy, and grocery items fresh,
                preventing multi-kilometer delays.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA] text-xs text-[#6B7A70]">
            <span className="font-bold text-[#0F5D3A]">Note on Order Dispatch:</span> Final delivery eligibility
            and store availability are calculated based on your precise device coordinates inside the
            ZUNO Customer Mobile App.
          </div>
        </div>
      </div>
    </div>
  );
}
