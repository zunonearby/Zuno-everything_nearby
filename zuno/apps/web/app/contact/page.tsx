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
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold mb-4">
            Operations & Inquiries
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight">
            Contact <span className="text-[#0F5D3A]">{brand.name}</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6B7A70] leading-relaxed max-w-2xl mx-auto">
            Get in touch with our Renukoot operations center for merchant onboarding, delivery
            partner registration, and general inquiries.
          </p>
        </div>

        {/* Verified Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Channel 1: Helpline */}
          <div className="p-8 rounded-3xl bg-white border border-[#EAEFEA] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAF4E5] flex items-center justify-center text-xl text-[#0F5D3A] font-bold mb-4">
                📞
              </div>
              <span className="text-xs font-bold text-[#6B7A70] uppercase tracking-wider block">
                Toll-Free Helpline
              </span>
              <h2 className="text-2xl font-black text-[#111827] mt-1">
                +91 1800 123 4567
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7A70] mt-2 leading-relaxed">
                Direct phone assistance for partner dispatch, store onboarding questions, and
                operational coordination.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EAEFEA] text-xs font-semibold text-[#0F5D3A]">
              Operating Hours: 7:00 AM – 11:00 PM Daily
            </div>
          </div>

          {/* Channel 2: Partner Email */}
          <div className="p-8 rounded-3xl bg-white border border-[#EAEFEA] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAF4E5] flex items-center justify-center text-xl text-[#0F5D3A] font-bold mb-4">
                ✉️
              </div>
              <span className="text-xs font-bold text-[#6B7A70] uppercase tracking-wider block">
                Partner Inquiries
              </span>
              <h2 className="text-2xl font-black text-[#111827] mt-1">
                partners@zuno.com
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7A70] mt-2 leading-relaxed">
                Written inquiries for local shopkeepers seeking to list their inventory or delivery
                partners requesting account assistance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EAEFEA] text-xs font-semibold text-[#0F5D3A]">
              Response Window: Within 24 Business Hours
            </div>
          </div>
        </div>

        {/* Local Hub Location */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAEFEA] shadow-sm mb-12">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4E5] flex items-center justify-center text-2xl shrink-0">
              📍
            </div>
            <div>
              <span className="text-xs font-bold text-[#6B7A70] uppercase tracking-wider block">
                Local Operations Center
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827] mt-1">
                ZUNO Partner Center — Renukoot
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-2 leading-relaxed">
                Near Hindalco Colony, Main Market Road, Renukoot, Sonbhadra, Uttar Pradesh 231217
              </p>
              <p className="text-xs text-[#6B7A70] mt-2">
                Walk-in hours for merchant document verification: Monday to Saturday, 10:00 AM – 6:00 PM.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Support Notice (Clearly Documenting Scope) */}
        <div className="p-6 rounded-2xl bg-[#F8FAF6] border border-[#EAEFEA] text-xs leading-relaxed text-[#6B7A70]">
          <div className="flex items-start gap-3">
            <span className="text-base">ℹ️</span>
            <div>
              <h3 className="font-bold text-[#111827] mb-1">Looking for Live Order Support?</h3>
              <p>
                To provide instantaneous resolutions with live GPS tracking, live customer order support
                is handled directly through the <Link href="/download" className="font-bold text-[#0F5D3A] underline">ZUNO Customer App</Link>.
                Please open your active order screen in the app for direct courier chat and assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
