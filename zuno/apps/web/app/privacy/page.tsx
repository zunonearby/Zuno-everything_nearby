import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@zuno/config";

export const metadata: Metadata = {
  title: "Privacy Policy (Informational Preview) — ZUNO",
  description:
    "Preview of ZUNO's privacy commitments and data handling principles for customers, merchants, and website visitors in Renukoot Central.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold mb-4">
            Compliance & Transparency
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight">
            Privacy Policy
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
                This document serves as an informational preview outlining ZUNO’s architecture and data
                handling principles. The formal, binding statutory Privacy Policy is currently undergoing
                final legal counsel review. The presence of this page does not constitute a legal certification
                of statutory compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Structured Outline of Privacy Practices */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAEFEA] shadow-sm space-y-8 text-[#374151]">
          {/* Section 1 */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] mb-3">
              1. Information We Collect
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              <p>
                When you interact with the ZUNO ecosystem, data collection is strictly purpose-bound:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#6B7A70]">
                <li>
                  <strong className="text-[#111827]">Account Identification:</strong> Mobile phone number for
                  one-time password (OTP) verification in the Customer App.
                </li>
                <li>
                  <strong className="text-[#111827]">Delivery Address & Geolocation:</strong> Doorstep address and
                  precise device coordinates required to calculate delivery radii to local stores.
                </li>
                <li>
                  <strong className="text-[#111827]">Public Web Browsing:</strong> Anonymous telemetry (page views,
                  PIN code availability queries) to optimize site speed and SEO. No financial credentials or
                  payment data are collected on this website.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] mb-3">
              2. How We Use Collected Data
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              <p>Your information is used exclusively for operational fulfillment:</p>
              <ul className="list-disc pl-5 space-y-1 text-[#6B7A70]">
                <li>Dispatching orders to verified neighborhood merchants and delivery partners.</li>
                <li>Communicating live delivery milestones and 4-digit verification OTPs.</li>
                <li>Preventing unauthorized transactions and account takeovers.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] mb-3">
              3. Data Security & Row Level Security (RLS)
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              All backend customer and order data resides in our PostgreSQL database protected by strict
              Supabase Row Level Security (RLS) policies. Only authenticated participants involved in an
              active order lifecycle may view fulfillment details. We never sell or lease user data to
              third-party advertising brokers.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] mb-3">
              4. Non-Transactional Web Boundary
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              This public website does not store cart items, process credit cards, or store banking
              information. All transactional authentication takes place within the Customer App environment.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#111827] mb-3">
              5. Privacy Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              For questions regarding our privacy framework, please contact our administrative desk at{" "}
              <a href="mailto:zunonearby@gmail.com" className="font-bold text-[#0F5D3A] underline">
                zunonearby@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
