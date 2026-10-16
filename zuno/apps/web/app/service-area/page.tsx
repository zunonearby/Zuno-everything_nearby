"use client";

import React, { useState } from "react";
import Link from "next/link";
import { checkServiceAreaAvailability, ServiceAreaCheckResult } from "@/lib/serviceArea";

type FormState = "IDLE" | "LOADING" | "SUBMITTED";

export default function ServiceAreaPage() {
  const [pinInput, setPinInput] = useState("231217");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>("IDLE");
  const [checkResult, setCheckResult] = useState<ServiceAreaCheckResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric digits, up to 6 digits max
    const sanitized = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPinInput(sanitized);

    if (validationError) {
      setValidationError(null);
    }
    if (checkResult) {
      setCheckResult(null);
      setFormState("IDLE");
    }
  };

  const handleInputBlur = () => {
    if (pinInput.length > 0 && pinInput.length < 6) {
      setValidationError("PIN code must be exactly 6 digits (e.g. 231217).");
    }
  };

  const handleCheckPincode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = pinInput.trim();

    // 1. Validate exactly 6 digits
    if (!/^\d{6}$/.test(trimmed)) {
      setValidationError("Please enter a valid 6-digit Indian PIN code (e.g. 231217).");
      setCheckResult(null);
      setFormState("IDLE");
      return;
    }

    setValidationError(null);
    setFormState("LOADING");

    try {
      // 2. Perform availability verification against database & approved configuration
      const result = await checkServiceAreaAvailability(trimmed);
      setCheckResult(result);
      setFormState("SUBMITTED");
    } catch (err: any) {
      // If unexpected error occurs during check, treat as UNKNOWN per guidelines
      setCheckResult({
        status: "UNKNOWN",
        pincode: trimmed,
        source: "unconfigured",
      });
      setFormState("SUBMITTED");
    }
  };

  const isSubmitDisabled = pinInput.length !== 6 || formState === "LOADING";

  return (
    <div className="py-6 sm:py-10 bg-[#F8FAF6] min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold mb-3 border border-[#D5E8CE] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22A06B] animate-pulse" />
            <span>Hyperlocal Service Area Checker</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#17231D] tracking-tight leading-tight">
            Is ZUNO available near you?
          </h1>

          <p className="mt-2.5 text-xs sm:text-sm lg:text-base text-[#55695D] leading-relaxed max-w-2xl mx-auto">
            Enter your 6-digit PIN code to check service availability.
          </p>
        </div>

        {/* Interactive PIN Checker Card */}
        <div
          id="service-checker"
          className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#EAEFEA] shadow-xs mb-6 sm:mb-8 scroll-mt-24"
        >
          <form onSubmit={handleCheckPincode} className="max-w-xl mx-auto" noValidate>
            <label
              htmlFor="pincode-input"
              className="block text-xs font-bold text-[#17231D] uppercase tracking-wider mb-2.5 text-center sm:text-left"
            >
              Delivery PIN Code
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  id="pincode-input"
                  name="pincode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="postal-code"
                  maxLength={6}
                  value={pinInput}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="e.g. 231217"
                  className={`w-full px-4 py-3.5 rounded-xl border text-center sm:text-left text-lg font-bold text-[#17231D] focus:outline-none focus:ring-2 focus:ring-[#0F5D3A] transition tracking-wider ${
                    validationError
                      ? "border-red-400 bg-red-50/30 focus:ring-red-500"
                      : "border-[#D1D5DB] bg-[#F9FAFB] focus:border-[#0F5D3A]"
                  }`}
                  aria-invalid={!!validationError}
                  aria-describedby={validationError ? "pincode-validation-msg" : undefined}
                />
                {pinInput.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setPinInput("");
                      setValidationError(null);
                      setCheckResult(null);
                      setFormState("IDLE");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#9CA3AF] hover:text-[#4B5563] px-1.5 py-0.5 rounded"
                    aria-label="Clear PIN code"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 min-w-[170px]"
              >
                {formState === "LOADING" ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Check Availability</span>
                )}
              </button>
            </div>

            {/* Validation Message */}
            {validationError && (
              <p
                id="pincode-validation-msg"
                role="alert"
                className="mt-2.5 text-xs font-semibold text-red-600 text-center sm:text-left flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{validationError}</span>
              </p>
            )}

            {/* Quick Test / Reference Helpers */}
            <div className="mt-4 pt-3 border-t border-[#F3F4F6] text-xs text-[#6B7A70] flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-medium">Quick Test Examples:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setPinInput("231217");
                    setValidationError(null);
                    setCheckResult(null);
                    setFormState("IDLE");
                  }}
                  className="px-2 py-0.5 rounded bg-[#EAF4E5] text-[#0F5D3A] font-bold hover:bg-[#D5E8CE] transition"
                  title="Approved initial launch PIN"
                >
                  231217 (Launch Hub)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPinInput("231222");
                    setValidationError(null);
                    setCheckResult(null);
                    setFormState("IDLE");
                  }}
                  className="px-2 py-0.5 rounded bg-gray-100 text-[#4B5563] font-semibold hover:bg-gray-200 transition"
                  title="Configured unserviced PIN"
                >
                  231222 (Configured Inactive)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPinInput("110001");
                    setValidationError(null);
                    setCheckResult(null);
                    setFormState("IDLE");
                  }}
                  className="px-2 py-0.5 rounded bg-gray-100 text-[#4B5563] font-semibold hover:bg-gray-200 transition"
                  title="Unconfigured PIN"
                >
                  110001 (Unconfigured)
                </button>
              </div>
            </div>
          </form>

          {/* Result States Presentation */}
          <div className="mt-8 pt-6 border-t border-[#EAEFEA]" aria-live="polite">
            {/* -------------------------------------------------------------
                RESULT STATE 1: AVAILABLE
                - Green check icon
                - Heading: “ZUNO is available in your area!”
                - Matched PIN code and confirmed service data
                - CTA: “Get the Customer App” linking to /download
               ------------------------------------------------------------- */}
            {checkResult?.status === "AVAILABLE" && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F0F8EC] border border-[#C2E2B8] text-[#17231D] shadow-sm">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#0F5D3A] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0F5D3A] text-white text-[11px] font-bold mb-2">
                      <span>✓ Verified Hyperlocal Zone</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-[#17231D] tracking-tight">
                      ZUNO is available in your area!
                    </h2>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F5D3A]">
                      <span className="px-2.5 py-1 rounded-md bg-white border border-[#C2E2B8] font-mono font-bold text-[#0F5D3A]">
                        PIN {checkResult.pincode}
                      </span>
                      <span>•</span>
                      <span>
                        {checkResult.details?.name || "Renukoot Central"} · {checkResult.details?.city || "Renukoot"}, {checkResult.details?.state || "Uttar Pradesh"}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#2D5A3E] mt-3 leading-relaxed">
                      Doorstep delivery is active in this zone! You can access verified neighborhood grocery,
                      daily essentials, dairy, and fresh produce merchants with fast local rider fulfillment.
                    </p>

                    {checkResult.details?.hub_address && (
                      <p className="text-xs text-[#527962] mt-1.5">
                        <strong className="text-[#0F5D3A]">Fulfillment Hub:</strong> {checkResult.details.hub_address}
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3 items-center">
                      <Link
                        href="/download"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition shadow-sm group"
                      >
                        <span>Get the Customer App</span>
                        <span className="group-hover:translate-x-0.5 transition">→</span>
                      </Link>
                      <Link
                        href="/categories"
                        className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-[#0F5D3A] hover:bg-white/60 transition"
                      >
                        Explore 7 Categories
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                RESULT STATE 2: NOT AVAILABLE
                - Neutral informational icon
                - Heading: “ZUNO isn't available in your area yet.”
                - Explain service area may expand in the future
                - Do not promise launch date or allow orders from unsupported areas
               ------------------------------------------------------------- */}
            {checkResult?.status === "NOT_AVAILABLE" && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F9FAF8] border border-[#E5E7EB] text-[#17231D] shadow-sm">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#E5E7EB] text-[#4B5563] flex items-center justify-center font-bold text-xl shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5E7EB] text-[#4B5563] text-[11px] font-bold mb-2">
                      <span>Outside Current Operating Radius</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-[#17231D] tracking-tight">
                      ZUNO isn&apos;t available in your area yet.
                    </h2>

                    <div className="mt-2.5 flex items-center gap-2 text-xs sm:text-sm text-[#4B5563]">
                      <span className="px-2.5 py-1 rounded-md bg-white border border-[#E5E7EB] font-mono font-bold text-[#17231D]">
                        PIN {checkResult.pincode}
                      </span>
                      {checkResult.details?.name && (
                        <span>• {checkResult.details.name} ({checkResult.details.city}, {checkResult.details.state})</span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#55695D] mt-3 leading-relaxed">
                      ZUNO operates within strict hyperlocal dispatch zones to guarantee item freshness and fast
                      fulfillment. We are currently operational in <strong>Renukoot Central (PIN 231217)</strong>.
                      While our service area may expand to additional sectors in the future, orders are not
                      currently supported for this PIN code.
                    </p>

                    <div className="mt-4 p-3 rounded-xl bg-white border border-[#EAEFEA] text-xs text-[#6B7A70]">
                      <span className="font-bold text-[#17231D]">Ordering Policy:</span> In order to preserve
                      cold-chain freshness and realistic rider delivery times, orders cannot be placed from unsupported
                      locations. We do not provide advance launch commitments or speculative delivery estimates.
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 items-center">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#17231D] text-white hover:bg-black transition shadow-sm"
                      >
                        <span>Local Shopkeeper Inquiries</span>
                        <span>→</span>
                      </Link>
                      <Link
                        href="/about"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#6B7A70] hover:text-[#17231D] transition"
                      >
                        About Our Mission
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                RESULT STATE 3: UNKNOWN / UNCONFIGURED
                - Heading: “We couldn't confirm availability for this PIN code.”
                - If PIN code cannot be checked against reliable service-area data
                - Do not incorrectly classify unknown PIN codes as unavailable
               ------------------------------------------------------------- */}
            {checkResult?.status === "UNKNOWN" && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#1E293B] shadow-sm">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center font-bold text-xl shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E2E8F0] text-[#475569] text-[11px] font-bold mb-2">
                      <span>Unconfirmed Service Area Record</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
                      We couldn&apos;t confirm availability for this PIN code.
                    </h2>

                    <div className="mt-2.5 flex items-center gap-2 text-xs sm:text-sm text-[#475569]">
                      <span className="px-2.5 py-1 rounded-md bg-white border border-[#CBD5E1] font-mono font-bold text-[#1E293B]">
                        PIN {checkResult.pincode}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#475569] mt-3 leading-relaxed">
                      We were unable to confirm delivery coverage against reliable service-area data for PIN {checkResult.pincode}.
                      This postal code is not currently indexed in ZUNO&apos;s verified launch directory.
                    </p>

                    <div className="mt-4 p-3 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#64748B]">
                      <span className="font-bold text-[#334155]">Policy on Unconfirmed Codes:</span> We do not
                      classify unknown or unverified PIN codes as unavailable. If your location is within or adjacent
                      to Renukoot Central, please confirm your 6-digit postal code with your local post office or
                      contact our team to check manual eligibility.
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 items-center">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#334155] text-white hover:bg-[#1E293B] transition shadow-sm"
                      >
                        <span>Contact Support Desk</span>
                        <span>→</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setPinInput("231217");
                          setValidationError(null);
                          setCheckResult(null);
                          setFormState("IDLE");
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#0F5D3A] hover:bg-emerald-50 transition"
                      >
                        Check Launch PIN 231217
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                RESULT STATE 4: IDLE
               ------------------------------------------------------------- */}
            {formState === "IDLE" && (
              <div className="text-center py-6 text-xs text-[#6B7A70]">
                Enter your 6-digit PIN code above and click <span className="font-bold text-[#0F5D3A]">Check Availability</span> to verify live coverage.
              </div>
            )}
          </div>
        </div>

        {/* Coverage Clarifications & Operational Principles */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#EAEFEA] space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAEFEA]">
            <h2 className="text-lg sm:text-xl font-black text-[#17231D]">
              Service Area Policies &amp; Operational Boundaries
            </h2>
            <span className="text-xs font-bold text-[#0F5D3A] bg-[#EAF4E5] px-2.5 py-1 rounded-full border border-[#D5E8CE]">
              Hyperlocal Radius
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-[#4B5563]">
            <div className="space-y-1.5">
              <h3 className="font-bold text-[#17231D] flex items-center gap-2">
                <svg className="w-4 h-4 text-[#0F5D3A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Active Operating Hub — Renukoot Central</span>
              </h3>
              <p className="leading-relaxed text-[#6B7A70]">
                Our initial launch operations and partner merchant network are centered in <strong>Renukoot Central (PIN 231217)</strong>,
                Uttar Pradesh, covering residential colonies and market zones.
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-[#17231D] flex items-center gap-2">
                <svg className="w-4 h-4 text-[#0F5D3A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <span>Independent Ordering Verification</span>
              </h3>
              <p className="leading-relaxed text-[#6B7A70]">
                The website checker is informational. Client-provided PIN codes cannot be used to bypass service-area
                restrictions during actual ordering; the ZUNO Customer App and backend enforce availability independently.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA] text-xs text-[#6B7A70] flex items-start gap-3">
            <div className="w-5 h-5 rounded-md bg-[#EAF4E5] border border-[#D5E8CE] flex items-center justify-center shrink-0 text-[#0F5D3A] mt-0.5">
              <svg className="w-3.5 h-3.5 text-[#0F5D3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
            </div>
            <div>
              <strong className="text-[#17231D]">Informational Notice:</strong> ZUNO does not support cart checkout
              or order placement on the public website. To order from verified neighborhood stores, please install
              the official <Link href="/download" className="text-[#0F5D3A] font-bold underline hover:text-[#0B482D] transition">ZUNO Customer App</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
