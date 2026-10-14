import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@zuno/config";

export const metadata: Metadata = {
  title: "About ZUNO — Hyperlocal Mission & Story | Everything nearby.",
  description:
    "Learn about ZUNO's mission to bridge neighborhood families with trusted local shopkeepers in Renukoot Central. Preserving community commerce with speed and transparency.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold mb-4">
            Our Story & Hyperlocal Mission
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight">
            About <span className="text-[#0F5D3A]">{brand.name}</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6B7A70] leading-relaxed max-w-2xl mx-auto">
            {brand.name} — “{brand.tagline}”. We believe that the best products, freshest vegetables,
            and most dependable service come from the neighborhood merchants who know you best.
          </p>
        </div>

        {/* Origin & Vision Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-[#EAEFEA] shadow-sm mb-12">
          <h2 className="text-2xl font-black text-[#111827] mb-4">
            The Hyperlocal Imperative
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-[#4B5563] leading-relaxed">
            <p>
              In town centers like Renukoot, Uttar Pradesh (PIN 231217), traditional commerce has
              always been built on personal trust. When families need groceries, fresh seasonal
              vegetables, dairy, or daily medicine, they turn to local shopkeepers who have served the
              colony for decades.
            </p>
            <p>
              Rather than replacing neighborhood stores with impersonal, centralized dark stores,
              ZUNO provides a modern technology layer that empowers existing merchants. We connect
              local consumers directly to verified neighborhood inventories, backed by a dedicated
              fleet of trained local delivery partners.
            </p>
          </div>
        </div>

        {/* Core Principles Grid */}
        <div className="mb-14">
          <h2 className="text-2xl font-black text-[#111827] text-center mb-8">
            Our Core Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#EAEFEA] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4E5] flex items-center justify-center text-[#0F5D3A] text-xl font-bold mb-3">
                🌱
              </div>
              <h3 className="font-extrabold text-lg text-[#111827]">Community-First Economics</h3>
              <p className="mt-2 text-sm text-[#6B7A70] leading-relaxed">
                Every rupee spent on ZUNO supports real local merchants and delivery partners in your
                town. We champion local business sustainability over predatory extraction.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAEFEA] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4E5] flex items-center justify-center text-[#0F5D3A] text-xl font-bold mb-3">
                ⚡
              </div>
              <h3 className="font-extrabold text-lg text-[#111827]">Speed Without Compromise</h3>
              <p className="mt-2 text-sm text-[#6B7A70] leading-relaxed">
                By dispatching from stores right around the corner, deliveries arrive faster, fresher,
                and with minimal transit time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAEFEA] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4E5] flex items-center justify-center text-[#0F5D3A] text-xl font-bold mb-3">
                🛡️
              </div>
              <h3 className="font-extrabold text-lg text-[#111827]">Verified Quality & OTP Safety</h3>
              <p className="mt-2 text-sm text-[#6B7A70] leading-relaxed">
                All shops and delivery partners undergo verification. Every delivery requires physical
                OTP confirmation to eliminate confusion and protect customer orders.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAEFEA] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#EAF4E5] flex items-center justify-center text-[#0F5D3A] text-xl font-bold mb-3">
                📱
              </div>
              <h3 className="font-extrabold text-lg text-[#111827]">App-Driven Precision</h3>
              <p className="mt-2 text-sm text-[#6B7A70] leading-relaxed">
                While our public website is open for discovery and service checking, live ordering takes
                place in the Customer App to ensure real-time inventory checks and live rider tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action card */}
        <div className="bg-[#0F5D3A] text-white rounded-3xl p-8 sm:p-10 text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-black">Ready to explore what’s nearby?</h2>
          <p className="mt-3 text-sm sm:text-base text-gray-200 max-w-xl mx-auto">
            Check your neighborhood coverage in Renukoot Central or download the Customer App to
            start ordering today.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/service-area"
              className="px-6 py-3 rounded-xl text-sm font-bold bg-[#A7D56B] text-[#0F5D3A] hover:bg-[#91c54e] transition shadow-sm"
            >
              Check Service Area (PIN 231217)
            </Link>
            <Link
              href="/download"
              className="px-6 py-3 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
            >
              Get Customer App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
