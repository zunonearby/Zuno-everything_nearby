import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@zuno/config";

export const metadata: Metadata = {
  title: "Terms of Service (Informational Preview) — ZUNO",
  description:
    "Preview of ZUNO's terms of service, platform usage terms, and delivery guidelines for customers and merchants in Renukoot Central.",
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold mb-4">
            Platform Guidelines
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6B7A70]">
            Last updated: October 2026 · ZUNO Hyperlocal Platform
          </p>
        </div>

        {/* Mandatory Legal Status Disclaimer Banner */}
        <div className="p-6 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] mb-10 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h2 className="font-extrabold text-[#78350F] mb-1">
                Notice: Publication Pending Approved Legal Content
              </h2>
              <p>
                This document serves as an informational preview outlining ZUNO’s terms of service structure.
                The official, legally binding customer terms of service are currently undergoing final
                counsel review. The presence of this page does not constitute a legal certification of
                statutory compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Structured Outline of Terms */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAEFEA] shadow-sm space-y-8 text-[#374151]">
          {/* Section 1 */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] mb-3">
              1. Platform Nature & Transaction Scope
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              ZUNO operates as a technology facilitator bridging independent local stores in Renukoot with
              neighborhood consumers. The public website is informational only. All binding contracts for
              the sale, purchase, and dispatch of products are concluded solely within the ZUNO Customer
              Mobile App.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] mb-3">
              2. Merchant Catalog & Inventory Availability
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              <p>
                Products, pricing, and stock displayed on the platform are provided directly by participating
                local merchants. While ZUNO actively audits merchant listings:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#6B7A70]">
                <li>Prices vary across different shops based on localized market conditions.</li>
                <li>Actual physical availability is confirmed live when placing an order in the mobile app.</li>
                <li>Perishable agricultural produce (vegetables, fruits) may exhibit natural variations in shape and weight.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] mb-3">
              3. Delivery Verification & OTP Requirement
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              To prevent misplacement or fraudulent claims, orders delivered by ZUNO partner couriers require
              the customer to communicate the 4-digit verification OTP provided in the mobile app. Once the
              OTP is successfully entered into the delivery partner’s terminal, the delivery is deemed
              concluded.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] mb-3">
              4. User Conduct & Abuse Prevention
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Users agree not to submit fraudulent addresses, harass local delivery personnel, or tamper
              with the platform’s security mechanisms. ZUNO reserves the right to deactivate accounts that
              violate community safety policies.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] mb-3">
              5. Governing Law & Jurisdiction
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              These platform terms are governed by the laws of India, with courts in Sonbhadra, Uttar
              Pradesh having appropriate jurisdiction over unresolved disputes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
