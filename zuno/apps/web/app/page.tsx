import Link from "next/link";
import Image from "next/image";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { MagneticElement } from "@/components/ui/MagneticElement";
import { TiltCard } from "@/components/ui/TiltCard";
import { HowZunoWorks } from "@/components/sections/HowZunoWorks";

// Category data aligned with design mockup
const CATEGORIES = [
  {
    name: "Grocery Staples",
    slug: "grocery-staples",
    image: "/images/cat-staples.jpg",
  },
  {
    name: "Fruits & Vegetables",
    slug: "fruits-vegetables",
    image: "/images/cat-fruits-veg.jpg",
  },
  {
    name: "Dairy & Eggs",
    slug: "dairy-eggs",
    image: "/images/cat-dairy-eggs.jpg",
  },
  {
    name: "Snacks & Beverages",
    slug: "snacks-beverages",
    image: "/images/cat-snacks-bev.jpg",
  },
  {
    name: "Household & Cleaning",
    slug: "household-cleaning",
    image: "/images/cat-household.jpg",
  },
  {
    name: "Personal Care",
    slug: "personal-care",
    image: "/images/cat-personal-care.jpg",
  },
  {
    name: "Bakery",
    slug: "bakery",
    image: "/images/cat-bakery.png",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* =========================================================================
          HERO SECTION — REALISTIC LIFESTYLE & 3D INTERACTIVE VISUAL
          ========================================================================= */}
      <section className="relative overflow-hidden pt-4 pb-8 sm:pt-8 md:pt-10 sm:pb-10 md:pb-12 lg:pt-14 lg:pb-18 bg-white">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start z-10">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white border border-[#D5E8CE] text-[#0F5D3A] text-[10px] sm:text-xs font-bold tracking-wide mb-3 sm:mb-5 shadow-xs max-w-full">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#22A06B] animate-pulse shrink-0" />
                <span className="truncate">LIVE IN RENUKOOT CENTRAL · PIN 231217</span>
              </div>

              {/* Headline */}
              <h1 className="text-[28px] sm:text-5xl lg:text-6xl font-black tracking-tight text-[#17231D] leading-[1.12] sm:leading-[1.08]">
                Everything <span className="text-[#0F5D3A]">nearby.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="mt-2.5 sm:mt-5 text-xs sm:text-base lg:text-lg text-[#55695D] leading-relaxed max-w-xl">
                Discover trusted local grocery, fruits &amp; vegetables, and everyday essentials from shops in your neighborhood.
              </p>

              {/* Action Buttons */}
              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
                <MagneticElement className="w-full sm:w-auto">
                  <Link
                    href="/download"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition shadow-md shadow-[#0F5D3A]/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F5D3A] min-h-[44px] w-full sm:w-auto group"
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Get the ZUNO App</span>
                    <span className="group-hover:translate-x-0.5 transition font-normal">→</span>
                  </Link>
                </MagneticElement>

                <MagneticElement className="w-full sm:w-auto">
                  <Link
                    href="/service-area"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-[#17231D] border border-[#EAEFEA] hover:bg-gray-50 transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F5D3A] min-h-[44px] w-full sm:w-auto"
                  >
                    <svg
                      className="w-4 h-4 text-[#0F5D3A] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Check Service Area</span>
                  </Link>
                </MagneticElement>
              </div>

              {/* Ordering Policy Notice */}
              <div className="mt-4 sm:mt-7 flex items-center gap-2 text-[11px] sm:text-xs font-medium text-[#6B7A70]">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0F5D3A] shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>Browse on web · Order inside the ZUNO Customer App</span>
              </div>
            </div>

            {/* Right Hero Visual Column (Interactive 3D & Lifestyle Photography) */}
            <div className="lg:col-span-6 xl:col-span-6 relative mt-1 sm:mt-0">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION A — FOUR FEATURE HIGHLIGHTS (TRUST & PLATFORM BENEFITS)
          ========================================================================= */}
      <section className="py-4 sm:py-6 md:py-6 lg:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {/* Feature 1 */}
            <TiltCard maxTilt={2.5}>
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 hover:border-[#22A06B]/40 hover:shadow-sm transition group h-full">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-base text-[#17231D]">Neighborhood Stores</h3>
                  <p className="text-[10px] sm:text-xs text-[#6B7A70] mt-0.5 leading-snug">
                    Trusted stores in your locality
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Feature 2 */}
            <TiltCard maxTilt={2.5}>
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 hover:border-[#22A06B]/40 hover:shadow-sm transition group h-full">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 21l7.03-3.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9zm0 4a5 5 0 015 5c0 1.95-.9 3.65-2.29 4.47L12 18l-2.71-1.53C7.9 15.65 7 13.95 7 12a5 5 0 015-5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-base text-[#17231D]">Fresh Essentials</h3>
                  <p className="text-[10px] sm:text-xs text-[#6B7A70] mt-0.5 leading-snug">
                    Groceries, fruits &amp; veggies
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Feature 3 */}
            <TiltCard maxTilt={2.5}>
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 hover:border-[#22A06B]/40 hover:shadow-sm transition group h-full">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-base text-[#17231D]">Service Area</h3>
                  <p className="text-[10px] sm:text-xs text-[#6B7A70] mt-0.5 leading-snug">
                    Renukoot Central (231217)
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Feature 4 */}
            <TiltCard maxTilt={2.5}>
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-[#EAEFEA] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 hover:border-[#22A06B]/40 hover:shadow-sm transition group h-full">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-base text-[#17231D]">Order via App</h3>
                  <p className="text-[10px] sm:text-xs text-[#6B7A70] mt-0.5 leading-snug">
                    Easy ordering &amp; fast delivery
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B — SHOP BY CATEGORY (EVERYDAY ESSENTIALS)
          ========================================================================= */}
      <section id="categories" className="py-8 sm:py-10 md:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 md:mb-8 lg:mb-10">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-2 sm:mb-2.5">
                <span>SHOP BY CATEGORY</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#17231D] tracking-tight">
                Explore everyday essentials
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#55695D] max-w-2xl leading-relaxed">
                From fresh produce and groceries to daily snacks and home essentials nearby.
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F5D3A] hover:text-[#0B482D] transition shrink-0 group self-start sm:self-end"
            >
              <span>View all categories</span>
              <span className="group-hover:translate-x-0.5 transition">→</span>
            </Link>
          </div>

          {/* Mobile Horizontal Carousel (< sm: 640px) */}
          <div className="sm:hidden">
            <div className="flex overflow-x-auto pb-3 gap-2.5 -mx-3.5 px-3.5 scrollbar-thin snap-x snap-mandatory">
              {CATEGORIES.map((category) => (
                <div key={category.slug} className="snap-start shrink-0 w-[130px]">
                  <Link
                    href="/categories"
                    className="bg-white rounded-xl border border-[#EAEFEA] p-2 hover:border-[#22A06B]/50 transition shadow-xs flex flex-col justify-between h-[130px] block"
                  >
                    <div className="relative w-full h-[76px] rounded-lg overflow-hidden bg-gray-50 mb-1.5 border border-[#F0F4F0]">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-contain p-1"
                        sizes="130px"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-1 pt-0.5">
                      <span className="font-extrabold text-[11px] text-[#17231D] leading-tight truncate">
                        {category.name}
                      </span>
                      <span className="text-[#0F5D3A] text-[10px] font-bold shrink-0">→</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#0F5D3A] px-1 mt-1">
              <span>Swipe to explore 7 categories</span>
              <span>→</span>
            </div>
          </div>

          {/* Desktop 7-Card Category Responsive Layout (≥ sm: 640px) */}
          <div className="hidden sm:flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-4 lg:gap-6">
            {CATEGORIES.map((category) => (
              <div
                key={category.slug}
                className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
              >
                <TiltCard maxTilt={3} className="h-full">
                  <Link
                    href="/categories"
                    className="bg-white rounded-2xl border border-[#EAEFEA] p-2.5 sm:p-4 hover:border-[#22A06B]/50 hover:shadow-md transition-all duration-300 group flex flex-col justify-between h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5D3A]"
                  >
                    {/* Category Image Visual Focus */}
                    <div className="relative aspect-[3/2] w-full rounded-xl overflow-hidden bg-[#F8FAF6] mb-2 sm:mb-3 border border-[#F0F4F0]">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>

                    {/* Category Name & Subtle Arrow */}
                    <div className="flex items-center justify-between pt-0.5 sm:pt-1 gap-1.5 sm:gap-2">
                      <span className="font-extrabold text-xs md:text-sm text-[#17231D] group-hover:text-[#0F5D3A] transition-colors duration-200 truncate">
                        {category.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0 text-[10px] sm:text-xs font-bold group-hover:bg-[#0F5D3A] group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D — HOW ZUNO WORKS (INTERACTIVE 4-STAGE PANORAMA & EXPLORER)
          ========================================================================= */}
      <HowZunoWorks />

      {/* =========================================================================
          SECTION E — SERVICE AREA PIN COVERAGE
          ========================================================================= */}
      <section id="service-area" className="py-8 sm:py-10 md:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="rounded-2xl lg:rounded-3xl border border-[#EAEFEA] p-4 sm:p-6 md:p-7 lg:p-10 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 lg:gap-8 items-center">
              {/* Left Column: Information & PIN Highlight */}
              <div className="md:col-span-7">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-[10px] sm:text-xs font-bold tracking-wide mb-2 sm:mb-3">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#22A06B] animate-pulse" />
                  <span>ACTIVE LOCAL DELIVERY ZONE</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-[#17231D] tracking-tight">
                  Delivering across Renukoot Central
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-[#55695D] leading-relaxed max-w-xl">
                  We are currently operating in <strong>Renukoot Central (PIN 231217)</strong>, providing residents with fast doorstep access to verified local grocery and fruit &amp; vegetable merchants.
                </p>

                {/* PIN Feature Highlights */}
                <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3.5">
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50/70 border border-[#EAEFEA] text-center sm:text-left">
                    <div className="text-[10px] sm:text-xs font-bold text-[#6B7A70]">Postal Code</div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#0F5D3A] mt-0.5">PIN 231217</div>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50/70 border border-[#EAEFEA] text-center sm:text-left">
                    <div className="text-[10px] sm:text-xs font-bold text-[#6B7A70]">Zone Status</div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#22A06B] mt-0.5">Live &amp; Active</div>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50/70 border border-[#EAEFEA] text-center sm:text-left">
                    <div className="text-[10px] sm:text-xs font-bold text-[#6B7A70]">Fulfillment</div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#17231D] mt-0.5">Local Riders</div>
                  </div>
                </div>

                {/* Service Area Link Action */}
                <div className="mt-4 sm:mt-6">
                  <MagneticElement>
                    <Link
                      href="/service-area"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition shadow-sm min-h-[44px] group w-full sm:w-auto"
                    >
                      <span>Check Service Area Coverage</span>
                      <span className="group-hover:translate-x-0.5 transition">→</span>
                    </Link>
                  </MagneticElement>
                </div>
              </div>

              {/* Right Column: Visual Verification Card */}
              <div className="md:col-span-5">
                <div className="rounded-xl sm:rounded-2xl border border-[#D5E8CE] p-3.5 sm:p-6 bg-[#F9FAF8]">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#EAEFEA]">
                    <span className="text-xs font-extrabold text-[#17231D]">Coverage Summary</span>
                    <span className="text-[10px] sm:text-xs font-bold text-[#0F5D3A] bg-[#EAF4E5] px-2 py-0.5 rounded-full">
                      Verified Area
                    </span>
                  </div>

                  <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-[11px] sm:text-xs text-[#55695D]">
                    <li className="flex items-start gap-2 sm:gap-2.5">
                      <span className="text-[#0F5D3A] font-bold mt-0.5">✓</span>
                      <span>Renukoot Central market hubs &amp; residential zones</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-2.5">
                      <span className="text-[#0F5D3A] font-bold mt-0.5">✓</span>
                      <span>Verified neighborhood kirana &amp; grocery partners</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-2.5">
                      <span className="text-[#0F5D3A] font-bold mt-0.5">✓</span>
                      <span>Direct-from-store pricing without long-distance surcharges</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-2.5">
                      <span className="text-[#0F5D3A] font-bold mt-0.5">✓</span>
                      <span>Real-time delivery coordination via dedicated local app</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION F — APP DOWNLOAD BANNER (PREMIUM 2-COLUMN LAYERED COMPOSITION)
          ========================================================================= */}
      <section id="download" className="py-8 sm:py-10 md:py-12 lg:py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div
            className="relative rounded-2xl sm:rounded-3xl bg-[#07361E] bg-cover bg-center text-white shadow-2xl border border-white/10 overflow-hidden"
            style={{ backgroundImage: "url('/images/download-banner-bg.png')" }}
          >
            {/* Subtle radial ambient lighting */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-4 sm:p-7 md:p-8 lg:p-14 gap-6 sm:gap-7 md:gap-8 lg:gap-10">
              {/* Left Column: Product Artwork */}
              <div className="w-full lg:w-[42%] relative flex items-center justify-center shrink-0">
                {/* Layer 2: Decorative Circular Green Background behind product visual */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="relative w-full aspect-[1024/831] scale-105 sm:scale-115 lg:scale-120">
                    <Image
                      src="/images/download-banner-circle.png"
                      alt=""
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>
                </div>

                {/* Layer 1: Foreground Product Visual (Phone + Groceries + Basket) */}
                <div className="relative z-10 w-full max-w-[240px] sm:max-w-[340px] md:max-w-[300px] lg:max-w-none aspect-[1024/831]">
                  <Image
                    src="/images/download-banner-foreground.png"
                    alt="ZUNO Customer Mobile App displaying fresh produce catalog with shopping bag and basket"
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 90vw, 42vw"
                  />
                </div>
              </div>

              {/* Right Column: Download Content & Benefits */}
              <div className="w-full lg:w-[58%] flex flex-col items-center lg:items-start text-center lg:text-left z-20">
                {/* Heading */}
                <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                  Get the <span className="text-[#A7D56B]">ZUNO</span>
                  <br className="hidden sm:inline" />{" "}
                  Customer App
                </h2>

                {/* Supporting Copy */}
                <p className="mt-2 sm:mt-4 text-xs sm:text-base text-white/90 leading-relaxed max-w-lg">
                  Order from local shops, check live availability, and enjoy doorstep delivery in Renukoot Central.
                </p>

                {/* Store Buttons */}
                <div className="mt-4 sm:mt-7 flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-5 w-full sm:w-auto">
                  {/* Google Play Button */}
                  <div className="flex flex-col items-center flex-1 sm:flex-initial">
                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed opacity-95 inline-flex items-center justify-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3 rounded-xl bg-black/90 hover:bg-black border border-white/20 text-white shadow-lg transition min-h-[44px] w-full sm:w-auto"
                      title="Android app coming soon"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M3.609 1.814L13.793 12 3.61 22.186a2.016 2.016 0 01-.61-1.464V3.278c0-.568.225-1.09.609-1.464zm11.238 11.24l2.127-2.127-11.45-6.611 9.323 8.738zm0 1.892L5.524 23.684l11.45-6.611-2.127-2.127zm1.096-1.096l3.432 1.982a1.442 1.442 0 001.442 0l.006-.003c.513-.296.828-.842.828-1.434s-.315-1.138-.828-1.434l-3.432-1.982-1.448 2.871z" />
                      </svg>
                      <div className="text-left">
                        <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-300 font-semibold leading-none">
                          GET IT ON
                        </div>
                        <div className="text-xs sm:text-sm font-bold leading-tight mt-0.5">Google Play</div>
                      </div>
                    </button>
                    <span className="mt-1 sm:mt-2 text-[10px] sm:text-[11px] font-semibold text-[#A7D56B] bg-[#07361E]/90 border border-[#22A06B]/30 px-2 py-0.5 rounded-full">
                      Coming soon
                    </span>
                  </div>

                  {/* App Store Button */}
                  <div className="flex flex-col items-center flex-1 sm:flex-initial">
                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed opacity-95 inline-flex items-center justify-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3 rounded-xl bg-black/90 hover:bg-black border border-white/20 text-white shadow-lg transition min-h-[44px] w-full sm:w-auto"
                      title="iOS app coming soon"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.93.04-2.02.63-2.66 1.38-.56.65-1.06 1.71-.92 2.74 1.05.08 2.06-.52 2.66-1.25z" />
                      </svg>
                      <div className="text-left">
                        <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-300 font-semibold leading-none">
                          DOWNLOAD ON
                        </div>
                        <div className="text-xs sm:text-sm font-bold leading-tight mt-0.5">App Store</div>
                      </div>
                    </button>
                    <span className="mt-1 sm:mt-2 text-[10px] sm:text-[11px] font-semibold text-[#A7D56B] bg-[#07361E]/90 border border-[#22A06B]/30 px-2 py-0.5 rounded-full">
                      Coming soon
                    </span>
                  </div>
                </div>

                {/* Restrained Feature Information Group */}
                <div className="mt-5 sm:mt-8 w-full max-w-xl rounded-xl sm:rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-3 sm:p-5">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    {/* Benefit 1 */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#A7D56B]/20 border border-[#A7D56B]/30 text-[#A7D56B] flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <span className="text-[11px] sm:text-sm font-semibold text-white">Local shops</span>
                    </div>

                    {/* Benefit 2 */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#A7D56B]/20 border border-[#A7D56B]/30 text-[#A7D56B] flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <span className="text-[11px] sm:text-sm font-semibold text-white">Secure pay</span>
                    </div>

                    {/* Benefit 3 */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#A7D56B]/20 border border-[#A7D56B]/30 text-[#A7D56B] flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"
                          />
                        </svg>
                      </div>
                      <span className="text-[11px] sm:text-sm font-semibold text-white">Fast delivery</span>
                    </div>

                    {/* Benefit 4 */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#A7D56B]/20 border border-[#A7D56B]/30 text-[#A7D56B] flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-[11px] sm:text-sm font-semibold text-white">Nearby stores</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
