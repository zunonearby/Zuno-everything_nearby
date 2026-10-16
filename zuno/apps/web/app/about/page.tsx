import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { brand } from "@zuno/config";

export const metadata: Metadata = {
  title: "About ZUNO — Hyperlocal Mission & Story | Everything nearby.",
  description:
    "Learn about ZUNO's mission to bridge neighborhood families with trusted local shopkeepers in Renukoot Central. Preserving community commerce with speed, transparency, and personal care.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* =========================================================================
          SECTION A — ABOUT HERO
          Compact, visually balanced, and grounded in ZUNO's core mission
          ========================================================================= */}
      <section className="relative overflow-hidden py-6 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-18 bg-white border-b border-[#EAEFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#EAF4E5] border border-[#D5E8CE] text-[#0F5D3A] text-[11px] sm:text-xs font-bold tracking-wide mb-2.5 sm:mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#22A06B]" />
            <span>OUR STORY &amp; HYPERLOCAL MISSION</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-[26px] leading-[1.15] sm:text-5xl lg:text-6xl font-black text-[#17231D] tracking-tight">
            About <span className="text-[#0F5D3A]">{brand.name}</span>
          </h1>

          {/* Supporting Copy - Concise on mobile, full on desktop */}
          <p className="hidden sm:block mt-4 sm:mt-5 text-base sm:text-lg text-[#55695D] leading-relaxed max-w-2xl mx-auto">
            ZUNO connects customers with neighborhood essentials and trusted local merchants.
            We believe everyday commerce is strongest when it stays local, personal, and dependable.
          </p>
          <p className="sm:hidden mt-2 text-xs text-[#55695D] leading-relaxed max-w-xs mx-auto">
            Connecting households with trusted neighborhood stores in Renukoot Central.
          </p>

          {/* CTA Links - Desktop Row */}
          <div className="hidden sm:flex items-center justify-center gap-3.5 mt-7 sm:mt-8">
            <Link
              href="/#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F5D3A] group"
            >
              <span>Explore How It Works</span>
              <span className="group-hover:translate-x-0.5 transition font-normal">→</span>
            </Link>

            <Link
              href="/service-area"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white text-[#17231D] border border-[#EAEFEA] hover:bg-gray-50 transition shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F5D3A]"
            >
              <svg className="w-4 h-4 text-[#0F5D3A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Check Service Area</span>
            </Link>
          </div>

          {/* CTA Links - Mobile Compact Stack */}
          <div className="flex sm:hidden flex-col gap-2 mt-4 w-full max-w-xs mx-auto">
            <Link
              href="/#how-it-works"
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold bg-[#0F5D3A] text-white transition shadow-sm"
            >
              <span>Explore How It Works</span>
              <span>→</span>
            </Link>
            <Link
              href="/service-area"
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold bg-white text-[#17231D] border border-[#EAEFEA] transition shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-[#0F5D3A] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Check Service Area</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B — OUR MISSION
          Editorial-style 2-column layout on desktop, compact horizontal cards on mobile
          ========================================================================= */}
      <section className="py-6 sm:py-16 lg:py-20 bg-white border-b border-[#EAEFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center">
            {/* Left Column: Purpose & Narrative */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-2 sm:mb-3">
                <span>OUR MISSION</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#17231D] tracking-tight leading-tight">
                Making everyday shopping feel closer.
              </h2>

              {/* Desktop Narrative Copy */}
              <div className="hidden sm:block mt-4 space-y-3.5 text-sm sm:text-base text-[#55695D] leading-relaxed">
                <p>
                  Local neighborhood shops have always been the heartbeat of our communities.
                  From the familiar corner kirana to the daily vegetable stall, these independent
                  merchants know their patrons and provide dependable, attentive service every day.
                </p>
                <p>
                  ZUNO was founded to make neighborhood commerce easier to discover and access.
                  Rather than bypassing local stores, we provide a modern digital layer that connects
                  households directly to nearby shop inventories, keeping community ties strong and
                  familiar.
                </p>
              </div>

              {/* Mobile Concise Narrative */}
              <p className="sm:hidden mt-2 text-xs text-[#55695D] leading-relaxed">
                Local neighborhood stores are the heartbeat of our community. ZUNO provides a digital layer connecting families directly to nearby inventories — keeping ties personal and dependable.
              </p>

              {/* Desktop Three Purpose Pillars */}
              <div className="hidden sm:block mt-6 pt-6 border-t border-[#EAEFEA] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17231D]">Neighborhood Discovery</h3>
                    <p className="text-xs text-[#6B7A70] mt-0.5">
                      Help customers easily discover everyday essentials available right around them.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17231D]">Digital Presence for Merchants</h3>
                    <p className="text-xs text-[#6B7A70] mt-0.5">
                      Help local shopkeepers build a digital presence and showcase their offerings online.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17231D]">Accessible Local Commerce</h3>
                    <p className="text-xs text-[#6B7A70] mt-0.5">
                      Make neighborhood commerce simple, convenient, and accessible through the mobile app.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Horizontal Feature Row */}
              <div className="sm:hidden mt-3 pt-3 border-t border-[#EAEFEA] flex gap-2.5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-1 no-scrollbar">
                <div className="shrink-0 w-[190px] snap-start p-2.5 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F5D3A]">
                    <span className="w-4 h-4 rounded-full bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>Neighborhood Discovery</span>
                  </div>
                  <p className="text-[11px] text-[#6B7A70] mt-1 leading-snug">
                    Find daily essentials available right around you.
                  </p>
                </div>

                <div className="shrink-0 w-[190px] snap-start p-2.5 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F5D3A]">
                    <span className="w-4 h-4 rounded-full bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>Merchant Presence</span>
                  </div>
                  <p className="text-[11px] text-[#6B7A70] mt-1 leading-snug">
                    Help local stores showcase offerings digitally.
                  </p>
                </div>

                <div className="shrink-0 w-[190px] snap-start p-2.5 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F5D3A]">
                    <span className="w-4 h-4 rounded-full bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>Accessible Commerce</span>
                  </div>
                  <p className="text-[11px] text-[#6B7A70] mt-1 leading-snug">
                    Simple and convenient through the Customer App.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Presentation */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl sm:rounded-3xl border border-[#EAEFEA] overflow-hidden bg-white shadow-xs sm:shadow-md">
                <div className="relative aspect-[16/9] sm:aspect-[4/3] w-full">
                  <Image
                    src="/images/shop-fresh-mart.jpg"
                    alt="Authentic neighborhood store partner serving fresh groceries"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Floating Content Card Over Image (Desktop) */}
                <div className="hidden sm:block p-5 sm:p-6 bg-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F5D3A]">
                    <span className="w-2 h-2 rounded-full bg-[#22A06B]" />
                    <span>COMMUNITY GROUNDED</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#17231D] mt-1">
                    Rooted in Neighborhood Trust
                  </h3>
                  <p className="text-xs text-[#6B7A70] mt-1 leading-relaxed">
                    Designed to empower existing storefronts in Renukoot Central (PIN 231217)
                    rather than displacing them with remote dark warehouses.
                  </p>
                </div>

                {/* Compact Content Label (Mobile) */}
                <div className="sm:hidden p-3 bg-white">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0F5D3A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22A06B]" />
                    <span>COMMUNITY GROUNDED</span>
                  </div>
                  <p className="text-[11px] text-[#6B7A70] mt-0.5 leading-snug">
                    Empowering local storefronts in Renukoot Central (PIN 231217).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C — WHY ZUNO EXISTS
          Upgraded editorial layout with compact mobile chips
          ========================================================================= */}
      <section className="py-6 sm:py-16 bg-white border-b border-[#EAEFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-2">
              <span>WHY WE STARTED</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-[#17231D] tracking-tight">
              Local commerce, made easier.
            </h2>
          </div>

          {/* Editorial Content Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EAEFEA] p-4 sm:p-8 lg:p-10 shadow-xs sm:shadow-sm">
            {/* Desktop Paragraphs */}
            <div className="hidden sm:block space-y-4 text-sm sm:text-base text-[#55695D] leading-relaxed">
              <p>
                In town centers like Renukoot, Uttar Pradesh (PIN 231217), everyday commerce has
                always thrived on personal relationships. When households need daily cooking staples,
                fresh seasonal produce, or household supplies, they turn to local shopkeepers who
                know their preferences and have served the locality for years.
              </p>
              <p>
                However, busy family routines and the convenience of mobile technology have changed
                how people shop. While large centralized platforms rely on distant warehouses that
                disconnect buyers from their communities, local independent stores often lack a
                practical way to showcase their current inventory to digital shoppers.
              </p>
              <p>
                ZUNO bridges this gap. By creating an organized, neighborhood-focused discovery layer,
                we make it simple for residents to browse what is available nearby and order through
                our mobile application. The result is modern convenience paired with the personal trust
                of local shopping.
              </p>
            </div>

            {/* Mobile Condensed Copy */}
            <div className="sm:hidden space-y-2 text-xs text-[#55695D] leading-relaxed">
              <p>
                In town centers like Renukoot (PIN 231217), everyday commerce thrives on personal relationships with local shopkeepers.
              </p>
              <p>
                ZUNO bridges the digital gap with an organized neighborhood discovery layer — enabling residents to browse nearby store inventory and order through our mobile application.
              </p>
            </div>

            {/* Visual Highlight Bar: Desktop 3 columns */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-3.5 mt-8 pt-6 border-t border-[#EAEFEA]">
              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-[#EAEFEA]">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#6B7A70]">Launch Locality</div>
                <div className="text-sm font-extrabold text-[#0F5D3A] mt-0.5">Renukoot Central</div>
                <div className="text-[11px] text-[#6B7A70]">PIN 231217 Coverage</div>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-[#EAEFEA]">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#6B7A70]">Merchant Focus</div>
                <div className="text-sm font-extrabold text-[#17231D] mt-0.5">Local Neighborhood Stores</div>
                <div className="text-[11px] text-[#6B7A70]">Kirana, Produce &amp; Essentials</div>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50/80 border border-[#EAEFEA]">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#22A06B] mt-0.5">Fulfillment</div>
                <div className="text-sm font-extrabold text-[#22A06B] mt-0.5">Community Delivery</div>
                <div className="text-[11px] text-[#6B7A70]">Coordinated Local Partners</div>
              </div>
            </div>

            {/* Visual Highlight Bar: Mobile Horizontal Swipe Row */}
            <div className="sm:hidden mt-3 pt-3 border-t border-[#EAEFEA] flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-1 no-scrollbar">
              <div className="shrink-0 w-[150px] snap-start p-2.5 rounded-xl bg-gray-50/90 border border-[#EAEFEA]">
                <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7A70]">Launch Locality</div>
                <div className="text-xs font-extrabold text-[#0F5D3A] mt-0.5">Renukoot Central</div>
                <div className="text-[10px] text-[#6B7A70]">PIN 231217 Coverage</div>
              </div>
              <div className="shrink-0 w-[150px] snap-start p-2.5 rounded-xl bg-gray-50/90 border border-[#EAEFEA]">
                <div className="text-[10px] uppercase tracking-wider font-bold text-[#6B7A70]">Merchant Focus</div>
                <div className="text-xs font-extrabold text-[#17231D] mt-0.5">Local Stores</div>
                <div className="text-[10px] text-[#6B7A70]">Kirana &amp; Essentials</div>
              </div>
              <div className="shrink-0 w-[150px] snap-start p-2.5 rounded-xl bg-gray-50/90 border border-[#EAEFEA]">
                <div className="text-[10px] uppercase tracking-wider font-bold text-[#22A06B]">Fulfillment</div>
                <div className="text-xs font-extrabold text-[#22A06B] mt-0.5">Community Delivery</div>
                <div className="text-[10px] text-[#6B7A70]">Coordinated Partners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D — OUR CORE PRINCIPLES
          Tasteful 2x2 grid on desktop, horizontal snap carousel on mobile
          ========================================================================= */}
      <section className="py-6 sm:py-16 lg:py-20 bg-white border-b border-[#EAEFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-2">
              <span>OUR VALUES</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#17231D] tracking-tight">
              Our Core Principles
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#55695D] leading-relaxed">
              The fundamental guidelines that shape every aspect of the ZUNO platform.
            </p>
          </div>

          {/* Desktop 4 Cards Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-5 sm:gap-6">
            {/* Principle 1: Community First */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs hover:border-[#22A06B]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#17231D] group-hover:text-[#0F5D3A] transition-colors">
                  1. Community First
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#55695D] leading-relaxed">
                  Support the discovery of local merchants and neighborhood businesses. We prioritize keeping
                  commerce sustainable and beneficial for the independent stores that define our town.
                </p>
              </div>
            </div>

            {/* Principle 2: Everyday Convenience */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs hover:border-[#22A06B]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#17231D] group-hover:text-[#0F5D3A] transition-colors">
                  2. Everyday Convenience
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#55695D] leading-relaxed">
                  Make everyday essentials easier to find. From grocery staples and fresh produce to daily
                  household items, find what you need close to home without unnecessary hassle.
                </p>
              </div>
            </div>

            {/* Principle 3: Trust & Transparency */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs hover:border-[#22A06B]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#17231D] group-hover:text-[#0F5D3A] transition-colors">
                  3. Trust &amp; Transparency
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#55695D] leading-relaxed">
                  Communicate availability, service radius, and platform policies clearly. We believe that
                  honest information builds long-lasting customer and merchant confidence.
                </p>
              </div>
            </div>

            {/* Principle 4: Technology With Purpose */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs hover:border-[#22A06B]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#17231D] group-hover:text-[#0F5D3A] transition-colors">
                  4. Technology With Purpose
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#55695D] leading-relaxed">
                  Use the official ZUNO Customer App for active shopping and order-related actions. We design
                  clean software tailored to make local discovery effortless and reliable.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Horizontal Snap Carousel */}
          <div className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 no-scrollbar">
            {/* Card 1 */}
            <div className="shrink-0 w-[240px] snap-start p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mb-2.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-extrabold text-[#17231D]">1. Community First</h3>
                <p className="mt-1.5 text-xs text-[#55695D] leading-relaxed">
                  Support local stores and keep neighborhood commerce sustainable and beneficial for independent businesses.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="shrink-0 w-[240px] snap-start p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mb-2.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-sm font-extrabold text-[#17231D]">2. Everyday Convenience</h3>
                <p className="mt-1.5 text-xs text-[#55695D] leading-relaxed">
                  Make groceries, produce, and household essentials effortless to find close to home.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="shrink-0 w-[240px] snap-start p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mb-2.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-sm font-extrabold text-[#17231D]">3. Trust &amp; Transparency</h3>
                <p className="mt-1.5 text-xs text-[#55695D] leading-relaxed">
                  Honest availability, clear service radius, and straightforward platform policies build customer confidence.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="shrink-0 w-[240px] snap-start p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 mb-2.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-extrabold text-[#17231D]">4. Technology With Purpose</h3>
                <p className="mt-1.5 text-xs text-[#55695D] leading-relaxed">
                  Clean software in the official Customer App tailored to make local discovery effortless and dependable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E — HOW ZUNO FITS INTO YOUR DAY
          Compact 3-step guide clarifying website vs mobile app boundaries
          ========================================================================= */}
      <section className="py-6 sm:py-16 bg-white border-t border-[#EAEFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-2">
              <span>HOW IT WORKS</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-[#17231D] tracking-tight">
              How ZUNO Fits Into Your Day
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#55695D] leading-relaxed">
              Three simple steps to experience neighborhood shopping at your fingertips.
            </p>
          </div>

          {/* Desktop 3 Step Cards */}
          <div className="hidden md:grid md:grid-cols-3 gap-5 sm:gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs relative flex flex-col justify-between hover:border-[#22A06B]/40 hover:shadow-sm transition">
              <div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0F5D3A] text-white text-xs font-black mb-4">
                  01
                </div>
                <h3 className="text-base font-extrabold text-[#17231D]">1. Discover</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#55695D] leading-relaxed">
                  Learn about ZUNO, our community mission, and the everyday categories served in your neighborhood
                  through this public website.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-[#EAEFEA]/80 text-[11px] font-semibold text-[#0F5D3A]">
                Explore on the Web
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs relative flex flex-col justify-between hover:border-[#22A06B]/40 hover:shadow-sm transition">
              <div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0F5D3A] text-white text-xs font-black mb-4">
                  02
                </div>
                <h3 className="text-base font-extrabold text-[#17231D]">2. Open the Customer App</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#55695D] leading-relaxed">
                  Use the official ZUNO Customer App on your mobile device to explore active shops, live catalogs,
                  and item pricing.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-[#EAEFEA]/80 text-[11px] font-semibold text-[#0F5D3A]">
                Dedicated Mobile Experience
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs relative flex flex-col justify-between hover:border-[#22A06B]/40 hover:shadow-sm transition">
              <div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0F5D3A] text-white text-xs font-black mb-4">
                  03
                </div>
                <h3 className="text-base font-extrabold text-[#17231D]">3. Shop Through the App</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#55695D] leading-relaxed">
                  Complete shopping, manage cart items, coordinate doorstep delivery, and receive updates directly
                  within the Customer App.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-[#EAEFEA]/80 text-[11px] font-semibold text-[#0F5D3A]">
                Fulfillment Inside the App
              </div>
            </div>
          </div>

          {/* Mobile Horizontal Snap Stepper Cards */}
          <div className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 no-scrollbar">
            {/* Step 1 */}
            <div className="shrink-0 w-[230px] snap-start p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F5D3A] text-white text-[11px] font-black flex items-center justify-center">01</span>
                  <h3 className="text-sm font-extrabold text-[#17231D]">Discover</h3>
                </div>
                <p className="text-xs text-[#55695D] leading-relaxed">
                  Learn about local categories and check delivery coverage on this website.
                </p>
              </div>
              <div className="mt-3 text-[10px] font-bold text-[#0F5D3A]">On the Web</div>
            </div>

            {/* Step 2 */}
            <div className="shrink-0 w-[230px] snap-start p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F5D3A] text-white text-[11px] font-black flex items-center justify-center">02</span>
                  <h3 className="text-sm font-extrabold text-[#17231D]">Customer App</h3>
                </div>
                <p className="text-xs text-[#55695D] leading-relaxed">
                  Explore active stores, real-time catalogs, and pricing in the mobile app.
                </p>
              </div>
              <div className="mt-3 text-[10px] font-bold text-[#0F5D3A]">In the App</div>
            </div>

            {/* Step 3 */}
            <div className="shrink-0 w-[230px] snap-start p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F5D3A] text-white text-[11px] font-black flex items-center justify-center">03</span>
                  <h3 className="text-sm font-extrabold text-[#17231D]">Doorstep Delivery</h3>
                </div>
                <p className="text-xs text-[#55695D] leading-relaxed">
                  Manage cart and receive swift delivery coordinated by community partners.
                </p>
              </div>
              <div className="mt-3 text-[10px] font-bold text-[#0F5D3A]">Doorstep Fulfillment</div>
            </div>
          </div>

          {/* Operational Clarification Note */}
          <div className="mt-4 sm:mt-8 p-3 sm:p-4 rounded-xl bg-[#F8FAF6] border border-[#EAEFEA] shadow-xs text-xs text-[#55695D] flex items-start sm:items-center gap-2.5">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F5D3A] shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">
              <strong>Platform Notice:</strong> The ZUNO website provides brand information, service coverage verification, and support FAQs. Shopping transactions, cart management, and order placement take place exclusively within the official Customer App.
            </span>
            <span className="sm:hidden text-[11px] leading-relaxed">
              <strong>Platform Notice:</strong> Website provides coverage info and FAQs. Shopping, cart, and orders occur in the official Customer App.
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F — WHO ZUNO SERVES
          Two balanced panels on desktop, swipeable cards on mobile
          ========================================================================= */}
      <section className="py-6 sm:py-16 lg:py-20 bg-white border-t border-[#EAEFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-2">
              <span>COMMUNITY PARTNERS</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#17231D] tracking-tight">
              Who ZUNO Serves
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#55695D] leading-relaxed">
              Connecting two essential sides of the local economy.
            </p>
          </div>

          {/* Desktop Two-Panel Grid */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            {/* Panel 1: For Customers */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold mb-4">
                  FOR RESIDENTS &amp; FAMILIES
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#17231D]">
                  For Neighborhood Shoppers
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-[#55695D] leading-relaxed">
                  Discover fresh fruits, vegetables, groceries, and daily necessities from the shops you know
                  and trust, right in your locality.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-[#55695D]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0F5D3A] font-bold mt-0.5">✓</span>
                    <span>Discover trusted local merchants and daily product categories</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0F5D3A] font-bold mt-0.5">✓</span>
                    <span>Verify active delivery coverage for your specific postal PIN</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0F5D3A] font-bold mt-0.5">✓</span>
                    <span>Access the Customer App for simple, convenient everyday shopping</span>
                  </li>
                </ul>
              </div>

              <div className="mt-7 pt-5 border-t border-[#EAEFEA] flex flex-wrap items-center gap-4">
                <Link
                  href="/service-area"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F5D3A] hover:text-[#0B482D] transition group"
                >
                  <span>Check Delivery Coverage</span>
                  <span className="group-hover:translate-x-0.5 transition">→</span>
                </Link>
                <Link
                  href="/download"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#55695D] hover:text-[#17231D] transition"
                >
                  <span>Install App</span>
                </Link>
              </div>
            </div>

            {/* Panel 2: For Local Shopkeepers */}
            <div className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold mb-4">
                  FOR INDEPENDENT MERCHANTS
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#17231D]">
                  For Local Shopkeepers
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-[#55695D] leading-relaxed">
                  Join a modern platform built to empower independent store owners with digital presence,
                  helping you serve local households more effectively.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-[#55695D]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0F5D3A] font-bold mt-0.5">✓</span>
                    <span>Learn about ZUNO’s mission to preserve neighborhood retail</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0F5D3A] font-bold mt-0.5">✓</span>
                    <span>Understand the potential reach of an organized online storefront</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#0F5D3A] font-bold mt-0.5">✓</span>
                    <span>Connect directly with our operations team for merchant inquiries</span>
                  </li>
                </ul>
              </div>

              <div className="mt-7 pt-5 border-t border-[#EAEFEA] flex items-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F5D3A] hover:text-[#0B482D] transition group"
                >
                  <span>Merchant &amp; Partner Inquiries</span>
                  <span className="group-hover:translate-x-0.5 transition">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Horizontal Snap Cards */}
          <div className="lg:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2 no-scrollbar">
            {/* Card 1: Shoppers */}
            <div className="shrink-0 w-[265px] snap-start p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-[10px] font-bold mb-2.5">
                  FOR RESIDENTS
                </div>
                <h3 className="text-base font-extrabold text-[#17231D]">
                  Neighborhood Shoppers
                </h3>
                <p className="mt-1.5 text-xs text-[#55695D] leading-relaxed">
                  Fresh fruits, groceries, and daily essentials from trusted local shops nearby.
                </p>

                <ul className="mt-3 space-y-1.5 text-xs text-[#55695D]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0F5D3A] font-bold">✓</span>
                    <span>Discover local stores &amp; categories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0F5D3A] font-bold">✓</span>
                    <span>Verify delivery coverage for PIN 231217</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAEFEA] flex items-center justify-between">
                <Link
                  href="/service-area"
                  className="text-xs font-bold text-[#0F5D3A]"
                >
                  Check Coverage →
                </Link>
                <Link
                  href="/download"
                  className="text-xs font-bold text-[#55695D]"
                >
                  Install App
                </Link>
              </div>
            </div>

            {/* Card 2: Shopkeepers */}
            <div className="shrink-0 w-[265px] snap-start p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-[10px] font-bold mb-2.5">
                  FOR MERCHANTS
                </div>
                <h3 className="text-base font-extrabold text-[#17231D]">
                  Local Shopkeepers
                </h3>
                <p className="mt-1.5 text-xs text-[#55695D] leading-relaxed">
                  Build a digital presence and showcase store inventory to nearby families.
                </p>

                <ul className="mt-3 space-y-1.5 text-xs text-[#55695D]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0F5D3A] font-bold">✓</span>
                    <span>Preserve neighborhood retail commerce</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0F5D3A] font-bold">✓</span>
                    <span>Reach local digital households</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAEFEA] flex items-center">
                <Link
                  href="/contact"
                  className="text-xs font-bold text-[#0F5D3A]"
                >
                  Partner Inquiries →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION G — SERVICE AREA CTA
          Refined green CTA banner with clean button hierarchy & working destinations
          ========================================================================= */}
      <section className="py-6 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#0F5D3A] text-white p-5 sm:p-12 lg:p-14 text-center shadow-xl border border-white/10 overflow-hidden">
            {/* Subtle radial ambient lighting */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              {/* Heading */}
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Everything nearby starts here.
              </h2>

              {/* Supporting Text */}
              <p className="hidden sm:block mt-3 sm:mt-4 text-xs sm:text-base text-white/90 leading-relaxed max-w-2xl mx-auto">
                Find out whether ZUNO is available in your neighborhood, or discover the Customer App
                to start exploring local essentials.
              </p>
              <p className="sm:hidden mt-2 text-xs text-white/90 leading-relaxed max-w-xs mx-auto">
                Check delivery coverage or get the official Customer App.
              </p>

              {/* Action Buttons: Desktop */}
              <div className="hidden sm:flex items-center justify-center gap-3.5 mt-7 sm:mt-8">
                <Link
                  href="/service-area"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-[#A7D56B] text-[#07361E] hover:bg-[#b8e57e] transition shadow-md w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 text-[#07361E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Check Service Area</span>
                </Link>

                <Link
                  href="/download"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition backdrop-blur-xs w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Get the Customer App</span>
                </Link>
              </div>

              {/* Action Buttons: Mobile */}
              <div className="flex sm:hidden flex-col gap-2 mt-4 w-full max-w-xs mx-auto">
                <Link
                  href="/service-area"
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold bg-[#A7D56B] text-[#07361E] transition shadow-md"
                >
                  <svg className="w-3.5 h-3.5 text-[#07361E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Check Service Area</span>
                </Link>

                <Link
                  href="/download"
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold bg-white/10 text-white border border-white/20 transition"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Get Customer App</span>
                </Link>
              </div>

              {/* Notice text */}
              <div className="mt-4 sm:mt-6 text-[10px] sm:text-[11px] text-white/70">
                Operating in Renukoot Central (PIN 231217) · Expanding responsibly by neighborhood
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

