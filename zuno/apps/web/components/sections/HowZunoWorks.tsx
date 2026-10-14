"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { TiltCard } from "@/components/ui/TiltCard";

export interface StageStep {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  details: string;
  badge: string;
  image: string;
  alt: string;
  actionLabel: string;
  actionHref: string;
  highlights: string[];
  stats: { label: string; value: string };
}

const STAGES: StageStep[] = [
  {
    id: "install",
    number: "01",
    title: "Install the ZUNO App",
    shortTitle: "Install App",
    description: "Download the ZUNO Customer App on Android or iOS.",
    details:
      "Get started in seconds. Browse neighborhood kirana stores, fresh vegetable vendors, and daily essentials right from your smartphone.",
    badge: "Quick Onboarding",
    image: "/images/step-1-install.jpg",
    alt: "Young woman seated smiling using smartphone with ZUNO Customer App install screen and store options",
    actionLabel: "View App Details",
    actionHref: "/download",
    highlights: [
      "Lightweight app with instant OTP login",
      "Automatic Renukoot Central (PIN 231217) detection",
      "Real-time local inventory without surge prices",
    ],
    stats: { label: "Setup Time", value: "< 1 Min" },
  },
  {
    id: "order",
    number: "02",
    title: "Order from local shops",
    shortTitle: "Order Locally",
    description: "Browse nearby shops, add your favourite products to the cart, and place your order.",
    details:
      "Explore verified merchant inventories from trusted neighborhood stores. Add fresh vegetables, dairy, pulses, and pantry essentials directly to your cart at authentic store prices.",
    badge: "Live Merchant Catalog",
    image: "/images/step-2-order.jpg",
    alt: "Smartphone shopping screen showing Renukoot Central stores with floating cart preview and grocery basket",
    actionLabel: "Explore Local Shops",
    actionHref: "/shops",
    highlights: [
      "Gupta Kirana, Fresh Mart & Sharma General Store",
      "Direct from store shelves with transparent pricing",
      "One-tap quantity controls and clear cart summary",
    ],
    stats: { label: "Store Variety", value: "100+ Essentials" },
  },
  {
    id: "track",
    number: "03",
    title: "Track your delivery",
    shortTitle: "Track Delivery",
    description: "Your order is prepared by the shop and delivered by a local rider. Track live on the app.",
    details:
      "Stay informed at every milestone. Watch your order progress seamlessly from shop packing to doorstep arrival with live rider route coordinates.",
    badge: "Live Milestones",
    image: "/images/step-3-track.jpg",
    alt: "Delivery rider in green ZUNO jacket on scooter with live milestone status timeline",
    actionLabel: "Check Service Area",
    actionHref: "/service-area",
    highlights: [
      "Milestones: Confirmed → Preparing → Out for Delivery",
      "Dedicated local delivery partners who know your locality",
      "Accurate arrival estimates (typically 15-30 mins)",
    ],
    stats: { label: "Average Delivery", value: "15-30 Mins" },
  },
  {
    id: "enjoy",
    number: "04",
    title: "Receive & enjoy",
    shortTitle: "Receive & Enjoy",
    description: "Get fresh, quality products at your doorstep and enjoy hassle-free shopping.",
    details:
      "Unpack hand-picked fresh harvest and daily staples delivered safely to your home. Enjoy supporting independent neighborhood stores while saving valuable time.",
    badge: "Fresh & Guaranteed",
    image: "/images/step-4-enjoy.jpg",
    alt: "Smiling customer unpacking fresh bell pepper and vegetables from ZUNO bag at home",
    actionLabel: "Learn About ZUNO",
    actionHref: "/about",
    highlights: [
      "Hand-picked freshness verified before packing",
      "Zero hidden markups or inflated delivery fees",
      "Direct customer support from your local community",
    ],
    stats: { label: "Satisfaction", value: "100% Guaranteed" },
  },
];

// Auto-animation timing configuration
const STEP_DURATION_MS = 3400; // 3.4s per step

export function HowZunoWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goToStep = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(STAGES.length - 1, index));
    setActiveStep(clamped);
  }, []);

  // Continuous, uninterrupted infinite loop auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STAGES.length);
    }, STEP_DURATION_MS);

    return () => clearInterval(timer);
  }, [activeStep]);

  // Keyboard navigation for tablist
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToStep(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToStep(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goToStep(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goToStep(STAGES.length - 1);
    }
  };

  // Touch Swipe Gesture for mobile / tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveStep((prev) => (prev + 1) % STAGES.length);
      } else {
        setActiveStep((prev) => (prev - 1 + STAGES.length) % STAGES.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      ref={containerRef}
      aria-label="How ZUNO Works"
      className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden"
    >
      {/* Hardware-accelerated CSS Keyframes for buttery-smooth 60fps linear progress bar */}
      <style>{`
        @keyframes zunoStageProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            SECTION HEADER (Exact match with reference mockup)
            ========================================================================= */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-black uppercase tracking-wider mb-3">
            <span>SIMPLE HYPERLOCAL FLOW</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17231D] tracking-tight">
            How <span className="text-[#0F5D3A]">ZUNO</span> Works
          </h2>

          {/* Subtitle */}
          <p className="mt-3 text-sm sm:text-base text-[#55695D] leading-relaxed">
            From app install to fresh groceries at your doorstep — in just a few simple steps.
          </p>
        </div>

        {/* =========================================================================
            INTERACTIVE STEP CONTROLS (Pills with synced progress bars)
            ========================================================================= */}
        <div className="mb-8 lg:mb-10 max-w-3xl mx-auto">
          {/* Step Pill Selectors (Tablist) */}
          <div
            role="tablist"
            aria-label="How ZUNO works step selector"
            className="flex items-center justify-between p-1.5 rounded-2xl bg-[#F8FAF6] border border-[#EAEFEA] gap-1 sm:gap-2"
          >
            {STAGES.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.id}
                  role="tab"
                  id={`stage-tab-${idx}`}
                  aria-selected={isActive}
                  aria-controls={`stage-panel-${idx}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goToStep(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`relative flex-1 flex flex-col items-center justify-between pt-2 pb-1.5 px-2 sm:px-3 rounded-xl text-xs font-extrabold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5D3A] overflow-hidden ${
                    isActive
                      ? "bg-[#0F5D3A] text-white shadow-md shadow-[#0F5D3A]/20 scale-[1.02]"
                      : "text-[#55695D] hover:text-[#17231D] hover:bg-white/70"
                  }`}
                >
                  {/* Pill label & icon */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full mb-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isActive
                          ? "bg-white text-[#0F5D3A]"
                          : "bg-[#EAF4E5] text-[#0F5D3A]"
                      }`}
                    >
                      {step.number}
                    </span>
                    <span className="hidden sm:inline truncate">{step.shortTitle}</span>
                    <span className="hidden min-[380px]:inline sm:hidden text-[11px] truncate">Step {step.number}</span>
                  </div>

                  {/* Bottom progress bar line with CSS GPU acceleration */}
                  <div className="w-full h-1 rounded-full overflow-hidden bg-black/10">
                    {isActive ? (
                      <div
                        key={`active-progress-${activeStep}`}
                        className="h-full rounded-full bg-white shadow-xs"
                        style={{
                          animation: `zunoStageProgress ${STEP_DURATION_MS}ms linear forwards`,
                        }}
                      />
                    ) : idx < activeStep ? (
                      <div className="h-full rounded-full bg-[#22A06B] w-full" />
                    ) : (
                      <div className="h-full rounded-full bg-transparent w-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            CONNECTED 4-STAGE PANORAMA (Exact layout from reference mockup!)
            ========================================================================= */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative"
        >
          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5 relative">
            {STAGES.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div key={step.id} className="relative flex flex-col">
                  {/* Card Container */}
                  <TiltCard maxTilt={isActive ? 3 : 2} className="h-full flex flex-col">
                    <div
                      onClick={() => goToStep(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          goToStep(idx);
                        }
                      }}
                      className={`relative flex-1 flex flex-col justify-between rounded-2xl lg:rounded-3xl bg-white border p-4 sm:p-5 transition-all duration-500 cursor-pointer overflow-hidden ${
                        isActive
                          ? "border-[#22A06B] shadow-xl shadow-[#0F5D3A]/15 ring-2 ring-[#22A06B]/30 -translate-y-1.5"
                          : "border-[#EAEFEA] shadow-sm hover:border-[#22A06B]/50 hover:shadow-md hover:-translate-y-0.5 opacity-90 hover:opacity-100"
                      }`}
                    >
                      {/* Top Header Row of Card */}
                      <div>
                        {/* Number badge and status indicator */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${
                                isActive
                                  ? "bg-[#22A06B] text-white shadow-md shadow-[#22A06B]/30 scale-105"
                                  : "bg-[#EAF4E5] text-[#0F5D3A]"
                              }`}
                            >
                              {step.number}
                            </span>
                            <span className="text-xs font-bold text-[#55695D]">
                              Stage {step.number}
                            </span>
                          </div>

                          {/* Active state badge */}
                          {isActive && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-[10px] font-black animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#22A06B]" />
                              ACTIVE STAGE
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          className={`font-black text-base sm:text-lg leading-snug transition-colors duration-200 ${
                            isActive ? "text-[#0F5D3A]" : "text-[#17231D]"
                          }`}
                        >
                          {step.title}
                        </h3>

                        {/* Short Description */}
                        <p className="mt-1.5 text-xs text-[#55695D] leading-relaxed line-clamp-3">
                          {step.description}
                        </p>
                      </div>

                      {/* Visual Artwork Container */}
                      <div className="mt-4 relative w-full aspect-[4/5] rounded-xl lg:rounded-2xl overflow-hidden bg-[#F9FAF8] border border-[#EAEFEA] group/art">
                        <Image
                          src={step.image}
                          alt={step.alt}
                          fill
                          unoptimized
                          priority
                          className={`object-cover object-center transition-transform duration-700 ${
                            isActive
                              ? "scale-105"
                              : "group-hover/art:scale-103 opacity-95"
                          }`}
                        />

                        {/* Soft overlay gradient at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                        {/* Floating stage badge */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-bold text-white drop-shadow">
                          <span className="bg-black/55 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
                            {step.badge}
                          </span>
                          <span className="bg-[#0F5D3A]/85 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px]">
                            {step.stats.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>

                  {/* Connecting Flow Arrow to Next Step (Desktop only, for steps 0, 1, 2) */}
                  {idx < STAGES.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                          isActive
                            ? "bg-[#0F5D3A] text-white shadow-md shadow-[#0F5D3A]/30 scale-110 ring-2 ring-[#22A06B]/30"
                            : "bg-[#EAF4E5] text-[#0F5D3A] border-2 border-white shadow-xs"
                        }`}
                      >
                        →
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default HowZunoWorks;
