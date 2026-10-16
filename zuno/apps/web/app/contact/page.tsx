import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@zuno/config";

export const metadata: Metadata = {
  title: "Contact ZUNO — Operations Hub & Support Desk | Renukoot",
  description:
    "Official contact information for ZUNO in Renukoot Central. Operations helpline, partner inquiry desk, and local partner center location.",
};

export default function ContactPage() {
  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] border border-[#D5E8CE] text-[#0F5D3A] text-xs font-bold mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22A06B]" />
            <span>Operations &amp; Inquiries</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#17231D] tracking-tight leading-tight">
            Contact <span className="text-[#0F5D3A]">{brand.name}</span>
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm lg:text-base text-[#55695D] leading-relaxed max-w-2xl mx-auto">
            Get in touch with our Renukoot operations center for merchant onboarding, delivery
            partner registration, and general inquiries.
          </p>
        </div>

        {/* Primary Contact Channels Grid (2 Balanced Columns on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-6">
          {/* Channel 1: Helpline Card */}
          <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between group hover:border-[#22A06B]/50 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#EAF4E5] border border-[#D5E8CE] flex items-center justify-center text-[#0F5D3A] group-hover:scale-105 transition-transform">
                  <svg
                    className="w-5 h-5 text-[#0F5D3A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <a
                  href="tel:8887602317"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold hover:bg-[#d8edd1] transition"
                >
                  <span>Call Now</span>
                  <span>↗</span>
                </a>
              </div>

              <span className="text-[11px] font-bold text-[#6B7A70] uppercase tracking-wider block">
                Toll-Free Helpline
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#17231D] mt-0.5 tracking-tight">
                <a href="tel:8887602317" className="hover:text-[#0F5D3A] transition-colors">
                  8887602317
                </a>
              </h2>
              <p className="text-xs sm:text-sm text-[#55695D] mt-2 leading-relaxed">
                Direct phone assistance for partner dispatch, store onboarding questions, and
                operational coordination.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F0F4F0] flex items-center gap-2 text-xs font-semibold text-[#0F5D3A]">
              <svg
                className="w-4 h-4 text-[#0F5D3A] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Operating Hours: 7:00 AM – 11:00 PM Daily</span>
            </div>
          </div>

          {/* Channel 2: Partner Email Card */}
          <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between group hover:border-[#22A06B]/50 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#EAF4E5] border border-[#D5E8CE] flex items-center justify-center text-[#0F5D3A] group-hover:scale-105 transition-transform">
                  <svg
                    className="w-5 h-5 text-[#0F5D3A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <a
                  href="mailto:zunonearby@gmail.com"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold hover:bg-[#d8edd1] transition"
                >
                  <span>Send Email</span>
                  <span>↗</span>
                </a>
              </div>

              <span className="text-[11px] font-bold text-[#6B7A70] uppercase tracking-wider block">
                Partner Desk
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#17231D] mt-0.5 tracking-tight break-all">
                <a href="mailto:zunonearby@gmail.com" className="hover:text-[#0F5D3A] transition-colors">
                  zunonearby@gmail.com
                </a>
              </h2>
              <p className="text-xs sm:text-sm text-[#55695D] mt-2 leading-relaxed">
                Written inquiries for local shopkeepers seeking to list their inventory or delivery
                partners requesting account assistance.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F0F4F0] flex items-center gap-2 text-xs font-semibold text-[#0F5D3A]">
              <svg
                className="w-4 h-4 text-[#0F5D3A] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Response Window: Within 24 Business Hours</span>
            </div>
          </div>
        </div>

        {/* Local Operations Center Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#EAEFEA] shadow-xs mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 rounded-xl bg-[#EAF4E5] border border-[#D5E8CE] flex items-center justify-center shrink-0 text-[#0F5D3A]">
              <svg
                className="w-6 h-6 text-[#0F5D3A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#6B7A70] uppercase tracking-wider">
                  Local Operations Center
                </span>
                <span className="text-[10px] font-extrabold text-[#0F5D3A] bg-[#EAF4E5] px-2 py-0.5 rounded-full border border-[#D5E8CE]">
                  PIN 231217
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#17231D] mt-0.5">
                ZUNO Partner Center — Renukoot
              </h2>
              <p className="text-xs sm:text-sm text-[#55695D] mt-1 leading-relaxed">
                Near Hindalco Colony, Main Market Road, Renukoot, Sonbhadra, Uttar Pradesh 231217
              </p>
            </div>
            <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0F4F0] w-full sm:w-auto">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#0F5D3A] bg-[#F8FAF6] border border-[#EAEFEA] px-3 py-1.5 rounded-xl font-semibold">
                <svg
                  className="w-3.5 h-3.5 text-[#0F5D3A] shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Walk-in: Mon – Sat, 10 AM – 6 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Order Support Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF4E5]/60 border border-[#D5E8CE] text-xs leading-relaxed text-[#55695D]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#D5E8CE] flex items-center justify-center shrink-0 text-[#0F5D3A] mt-0.5">
              <svg
                className="w-4 h-4 text-[#0F5D3A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#17231D] text-xs sm:text-sm mb-0.5">
                Looking for Live Order Support?
              </h3>
              <p className="text-xs text-[#55695D]">
                To provide instantaneous resolutions with live GPS tracking, active customer order support
                is handled directly through the{" "}
                <Link
                  href="/download"
                  className="font-bold text-[#0F5D3A] underline hover:text-[#0B482D] transition"
                >
                  ZUNO Customer App
                </Link>
                . Please open your active order screen in the app for direct courier chat and assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
