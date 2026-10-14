import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@zuno/config";

export const metadata: Metadata = {
  title: "Get the ZUNO Customer App — Hyperlocal Mobile Experience",
  description:
    "Install the official ZUNO Customer App for Android and iOS. Place orders, verify fresh merchant stock in real-time, and track live deliveries in Renukoot Central.",
};

export default function DownloadPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold mb-4">
            Official Mobile Application
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight">
            Install the <span className="text-[#0F5D3A]">Customer App</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6B7A70] leading-relaxed max-w-2xl mx-auto">
            Discovering shops and exploring local essentials happens on our website, but ordering is
            exclusively completed inside the ZUNO Customer App.
          </p>
        </div>

        {/* Why App Only Explainer Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAEFEA] shadow-sm mb-10">
          <h2 className="text-xl sm:text-2xl font-black text-[#111827] mb-3">
            Why Orders Are Handled Exclusively in the App
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mb-6">
            Hyperlocal convenience requires three live elements that cannot be reliably guaranteed
            through static desktop web pages:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA]">
              <span className="text-xl">📍</span>
              <h3 className="font-bold text-sm text-[#111827] mt-2">Precise Geolocation</h3>
              <p className="text-xs text-[#6B7A70] mt-1 leading-relaxed">
                Matches your delivery doorstep to nearby stores within a strict kilometer radius.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA]">
              <span className="text-xl">⚡</span>
              <h3 className="font-bold text-sm text-[#111827] mt-2">Live Inventory Handshake</h3>
              <p className="text-xs text-[#6B7A70] mt-1 leading-relaxed">
                Connects directly to the shopkeeper’s terminal to prevent checkout of out-of-stock items.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA]">
              <span className="text-xl">🔐</span>
              <h3 className="font-bold text-sm text-[#111827] mt-2">Secure OTP Handover</h3>
              <p className="text-xs text-[#6B7A70] mt-1 leading-relaxed">
                Rider dispatch requires a 4-digit customer delivery OTP upon arrival to verify delivery.
              </p>
            </div>
          </div>
        </div>

        {/* App Store Availability Cards (With Clean "Coming Soon / Publication Pending" States) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Android Card */}
          <div className="bg-white rounded-3xl p-8 border border-[#EAEFEA] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF4E5] flex items-center justify-center text-2xl">
                  🤖
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E]">
                  Store Release Pending
                </span>
              </div>
              <h3 className="text-xl font-black text-[#111827]">Android Customer App</h3>
              <p className="text-xs sm:text-sm text-[#6B7A70] mt-2 leading-relaxed">
                Designed for Android devices. Featuring one-tap OTP login, quick reordering, and live
                order timeline notifications.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EAEFEA]">
              <div className="p-3.5 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA] text-center">
                <span className="text-xs font-bold text-[#6B7A70] block">
                  Google Play Store Link
                </span>
                <span className="text-xs text-[#9CA3AF] mt-0.5 block">
                  Official publication review in progress. Direct link will appear here upon store approval.
                </span>
              </div>
            </div>
          </div>

          {/* iOS Card */}
          <div className="bg-white rounded-3xl p-8 border border-[#EAEFEA] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF4E5] flex items-center justify-center text-2xl">
                  🍎
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E]">
                  Store Release Pending
                </span>
              </div>
              <h3 className="text-xl font-black text-[#111827]">iOS Customer App</h3>
              <p className="text-xs sm:text-sm text-[#6B7A70] mt-2 leading-relaxed">
                Native experience for Apple iPhone devices with smooth haptics and real-time delivery
                tracking.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EAEFEA]">
              <div className="p-3.5 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA] text-center">
                <span className="text-xs font-bold text-[#6B7A70] block">
                  Apple App Store Link
                </span>
                <span className="text-xs text-[#9CA3AF] mt-0.5 block">
                  Apple review submission in progress. Official App Store link will appear here upon release.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety & Anti-Fraud Notice */}
        <div className="p-6 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-xs leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="text-lg">🛡️</span>
            <div>
              <h4 className="font-bold text-[#78350F] mb-1">Notice on Software Safety</h4>
              <p>
                To safeguard your device and personal data, please do not download untrusted APK files
                or third-party install packages from unauthorized websites. ZUNO releases will be distributed
                strictly through verified store channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
