"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@zuno/config";

// Chevron Icon for Mobile Accordion
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
    </svg>
  );
}

// Professional Lucide-style outline icons
function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
      <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418-4.857-7-8.857-7-12a7 7 0 1114 0c0 3.143-2.582 7.143-7 12z" />
      <circle cx="12" cy="9" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SmartphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
      <rect x="6" y="2" width="12" height="20" rx="3" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 18h2" />
    </svg>
  );
}

function CircleHelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
      <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
    </svg>
  );
}

function PhoneCallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
      />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Social outline icons
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
      <rect x="2" y="2" width="20" height="20" rx="5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <footer className="bg-[#F8FAF6] border-t border-[#EAEFEA] pt-8 sm:pt-12 pb-6 sm:pb-8 text-[#17231D]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* =========================================================================
            MOBILE LAYOUT (sm:hidden): Compact Brand Header + Collapsible Accordions
            ========================================================================= */}
        <div className="sm:hidden mb-6">
          {/* Brand & Compact Info */}
          <div className="mb-4 pb-4 border-b border-[#EAEFEA]">
            <Link href="/" className="inline-block mb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5D3A] rounded-lg">
              <div className="relative w-28 h-8">
                <Image
                  src="/brandlogo.png"
                  alt="ZUNO — Everything nearby."
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-xs text-[#55695D] leading-relaxed mb-3 line-clamp-2">
              Hyperlocal commerce platform connecting you to verified neighborhood stores.
            </p>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF4E5] border border-[#D5E8CE]/60 text-[#0F5D3A] text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22A06B]" />
                <span>Active in PIN {brand.contact.pin}</span>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full border border-[#D5E8CE] bg-white flex items-center justify-center text-[#55695D]" aria-label="Instagram">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </span>
                <span className="w-7 h-7 rounded-full border border-[#D5E8CE] bg-white flex items-center justify-center text-[#55695D]" aria-label="Facebook">
                  <FacebookIcon className="w-3.5 h-3.5" />
                </span>
                <span className="w-7 h-7 rounded-full border border-[#D5E8CE] bg-white flex items-center justify-center text-[#55695D]" aria-label="YouTube">
                  <YouTubeIcon className="w-3.5 h-3.5" />
                </span>
                <span className="w-7 h-7 rounded-full border border-[#D5E8CE] bg-white flex items-center justify-center text-[#55695D]" aria-label="LinkedIn">
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Accordion Sections */}
          <div className="space-y-2">
            {/* Accordion 1: Explore ZUNO */}
            <div className="border border-[#EAEFEA] rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection("explore")}
                aria-expanded={openSection === "explore"}
                className="w-full flex items-center justify-between px-3.5 py-3 text-left text-xs font-black text-[#17231D] uppercase tracking-wider min-h-[44px]"
              >
                <span>Explore ZUNO</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-[#55695D] transition-transform duration-200 ${
                    openSection === "explore" ? "rotate-180 text-[#0F5D3A]" : ""
                  }`}
                />
              </button>
              {openSection === "explore" && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-[#F0F4F0]">
                  <ul className="space-y-2.5 text-xs font-medium text-[#55695D]">
                    <li>
                      <Link href="/about" className="flex items-center gap-2 hover:text-[#0F5D3A] py-1 min-h-[36px]">
                        <FileTextIcon className="w-4 h-4 text-[#55695D] shrink-0" />
                        <span>About Our Mission</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/categories" className="flex items-center gap-2 hover:text-[#0F5D3A] py-1 min-h-[36px]">
                        <GridIcon className="w-4 h-4 text-[#55695D] shrink-0" />
                        <span>Categories</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/service-area" className="flex items-center gap-2 hover:text-[#0F5D3A] py-1 min-h-[36px]">
                        <MapPinIcon className="w-4 h-4 text-[#55695D] shrink-0" />
                        <span>Service Area</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/download" className="flex items-center gap-2 hover:text-[#0F5D3A] py-1 min-h-[36px]">
                        <SmartphoneIcon className="w-4 h-4 text-[#55695D] shrink-0" />
                        <span>Customer Mobile App</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Accordion 2: Support & Contact */}
            <div className="border border-[#EAEFEA] rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection("support")}
                aria-expanded={openSection === "support"}
                className="w-full flex items-center justify-between px-3.5 py-3 text-left text-xs font-black text-[#17231D] uppercase tracking-wider min-h-[44px]"
              >
                <span>Support & Contact</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-[#55695D] transition-transform duration-200 ${
                    openSection === "support" ? "rotate-180 text-[#0F5D3A]" : ""
                  }`}
                />
              </button>
              {openSection === "support" && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-[#F0F4F0] space-y-3">
                  <ul className="space-y-2.5 text-xs font-medium text-[#55695D]">
                    <li>
                      <Link href="/help" className="flex items-center gap-2 hover:text-[#0F5D3A] py-1 min-h-[36px]">
                        <CircleHelpIcon className="w-4 h-4 text-[#55695D] shrink-0" />
                        <span>Help & FAQs</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="flex items-center gap-2 hover:text-[#0F5D3A] py-1 min-h-[36px]">
                        <MailIcon className="w-4 h-4 text-[#55695D] shrink-0" />
                        <span>Contact Information</span>
                      </Link>
                    </li>
                  </ul>

                  {/* Direct Contact Blocks */}
                  <div className="pt-2 border-t border-[#F0F4F0] space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#EAF4E5] border border-[#D5E8CE]/40 flex items-center justify-center shrink-0 text-[#0F5D3A]">
                        <PhoneCallIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-[#6B7A70] font-medium leading-none mb-0.5">Partner Helpline</div>
                        <a href={`tel:${brand.contact.phoneTel}`} className="text-xs font-bold text-[#17231D] hover:text-[#0F5D3A]">
                          {brand.contact.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#EAF4E5] border border-[#D5E8CE]/40 flex items-center justify-center shrink-0 text-[#0F5D3A]">
                        <MailIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-[#6B7A70] font-medium leading-none mb-0.5">Partner Desk Email</div>
                        <a href={`mailto:${brand.contact.email}`} className="text-xs font-bold text-[#17231D] hover:text-[#0F5D3A] break-all">
                          {brand.contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Legal & Safety */}
            <div className="border border-[#EAEFEA] rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection("legal")}
                aria-expanded={openSection === "legal"}
                className="w-full flex items-center justify-between px-3.5 py-3 text-left text-xs font-black text-[#17231D] uppercase tracking-wider min-h-[44px]"
              >
                <span>Legal & Safety</span>
                <ChevronDownIcon
                  className={`w-4 h-4 text-[#55695D] transition-transform duration-200 ${
                    openSection === "legal" ? "rotate-180 text-[#0F5D3A]" : ""
                  }`}
                />
              </button>
              {openSection === "legal" && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-[#F0F4F0] space-y-3">
                  <ul className="space-y-2.5 text-xs font-medium text-[#55695D]">
                    <li>
                      <Link href="/privacy" className="flex items-center gap-2 hover:text-[#0F5D3A] py-1 min-h-[36px]">
                        <ShieldCheckIcon className="w-4 h-4 text-[#55695D] shrink-0" />
                        <span>Privacy Policy</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="flex items-center gap-2 hover:text-[#0F5D3A] py-1 min-h-[36px]">
                        <FileTextIcon className="w-4 h-4 text-[#55695D] shrink-0" />
                        <span>Terms of Service</span>
                      </Link>
                    </li>
                  </ul>
                  <div className="p-2.5 rounded-lg bg-[#EAF4E5]/60 border border-[#D5E8CE] text-[11px] text-[#55695D] leading-relaxed">
                    <span className="font-bold text-[#17231D]">Notice: </span>
                    Ordering & cart checkout are fulfilled inside the official ZUNO Customer Mobile App.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            DESKTOP LAYOUT (hidden sm:grid): Exact Four-Column Grid Preserved
            ========================================================================= */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-10">
          {/* Column 1 — ZUNO Brand */}
          <div className="sm:col-span-1 lg:col-span-4 lg:pr-8 lg:border-r lg:border-[#EAEFEA]">
            <Link href="/" className="inline-block mb-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5D3A] rounded-lg">
              <div className="relative w-32 h-10">
                <Image
                  src="/brandlogo.png"
                  alt="ZUNO — Everything nearby."
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-xs text-[#55695D] leading-relaxed mb-4 max-w-sm">
              ZUNO is Renukoot’s dedicated hyperlocal commerce platform, connecting you to your favorite
              neighborhood grocery, vegetable, and essentials stores.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] border border-[#D5E8CE]/60 text-[#0F5D3A] text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A06B]" />
              <span>Active in PIN {brand.contact.pin}</span>
            </div>

            {/* Social media icons matching mockup */}
            <div className="flex items-center gap-2.5 mt-5">
              <span
                className="w-8 h-8 rounded-full border border-[#D5E8CE] bg-white/60 flex items-center justify-center text-[#55695D] hover:text-[#0F5D3A] hover:border-[#0F5D3A] transition cursor-pointer"
                aria-label="Instagram"
                title="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </span>
              <span
                className="w-8 h-8 rounded-full border border-[#D5E8CE] bg-white/60 flex items-center justify-center text-[#55695D] hover:text-[#0F5D3A] hover:border-[#0F5D3A] transition cursor-pointer"
                aria-label="Facebook"
                title="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </span>
              <span
                className="w-8 h-8 rounded-full border border-[#D5E8CE] bg-white/60 flex items-center justify-center text-[#55695D] hover:text-[#0F5D3A] hover:border-[#0F5D3A] transition cursor-pointer"
                aria-label="YouTube"
                title="YouTube"
              >
                <YouTubeIcon className="w-3.5 h-3.5" />
              </span>
              <span
                className="w-8 h-8 rounded-full border border-[#D5E8CE] bg-white/60 flex items-center justify-center text-[#55695D] hover:text-[#0F5D3A] hover:border-[#0F5D3A] transition cursor-pointer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Column 2 — Explore ZUNO */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="text-xs font-black text-[#17231D] uppercase tracking-wider mb-4">
              Explore ZUNO
            </h3>
            <ul className="space-y-3 text-xs font-medium text-[#55695D]">
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2.5 hover:text-[#0F5D3A] transition group"
                >
                  <FileTextIcon className="w-4 h-4 text-[#55695D] group-hover:text-[#0F5D3A] shrink-0 transition" />
                  <span>About Our Mission</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="flex items-center gap-2.5 hover:text-[#0F5D3A] transition group"
                >
                  <GridIcon className="w-4 h-4 text-[#55695D] group-hover:text-[#0F5D3A] shrink-0 transition" />
                  <span>Categories</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/service-area"
                  className="flex items-center gap-2.5 hover:text-[#0F5D3A] transition group"
                >
                  <MapPinIcon className="w-4 h-4 text-[#55695D] group-hover:text-[#0F5D3A] shrink-0 transition" />
                  <span>Service Area</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/download"
                  className="flex items-center gap-2.5 hover:text-[#0F5D3A] transition group"
                >
                  <SmartphoneIcon className="w-4 h-4 text-[#55695D] group-hover:text-[#0F5D3A] shrink-0 transition" />
                  <span>Customer Mobile App</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Support & Desk */}
          <div className="sm:col-span-1 lg:col-span-3">
            <h3 className="text-xs font-black text-[#17231D] uppercase tracking-wider mb-4">
              Support & Desk
            </h3>
            <ul className="space-y-3 text-xs font-medium text-[#55695D]">
              <li>
                <Link
                  href="/help"
                  className="flex items-center gap-2.5 hover:text-[#0F5D3A] transition group"
                >
                  <CircleHelpIcon className="w-4 h-4 text-[#55695D] group-hover:text-[#0F5D3A] shrink-0 transition" />
                  <span>Help & FAQs</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-2.5 hover:text-[#0F5D3A] transition group"
                >
                  <MailIcon className="w-4 h-4 text-[#55695D] group-hover:text-[#0F5D3A] shrink-0 transition" />
                  <span>Contact Information</span>
                </Link>
              </li>
            </ul>

            {/* Subtle Divider */}
            <div className="my-3.5 border-t border-[#EAEFEA]" />

            {/* Contact Blocks */}
            <div className="space-y-3">
              {/* Partner Helpline */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EAF4E5] border border-[#D5E8CE]/40 flex items-center justify-center shrink-0 text-[#0F5D3A]">
                  <PhoneCallIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-[#6B7A70] font-medium leading-none mb-1">
                    Partner Helpline
                  </div>
                  <a
                    href={`tel:${brand.contact.phoneTel}`}
                    className="text-xs font-extrabold text-[#17231D] hover:text-[#0F5D3A] transition leading-tight block"
                  >
                    {brand.contact.phone}
                  </a>
                  <div className="text-[10px] text-[#88988E] mt-0.5 leading-none">
                    {brand.contact.phoneHours}
                  </div>
                </div>
              </div>

              {/* Partner Desk Email */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EAF4E5] border border-[#D5E8CE]/40 flex items-center justify-center shrink-0 text-[#0F5D3A]">
                  <MailIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-[#6B7A70] font-medium leading-none mb-1">
                    Partner Desk Email
                  </div>
                  <a
                    href={`mailto:${brand.contact.email}`}
                    className="text-xs font-extrabold text-[#17231D] hover:text-[#0F5D3A] transition leading-tight block break-all"
                  >
                    {brand.contact.email}
                  </a>
                  <div className="text-[10px] text-[#88988E] mt-0.5 leading-none">
                    {brand.contact.emailHours}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4 — Legal & Safety */}
          <div className="sm:col-span-1 lg:col-span-3">
            <h3 className="text-xs font-black text-[#17231D] uppercase tracking-wider mb-4">
              Legal & Safety
            </h3>
            <ul className="space-y-3 text-xs font-medium text-[#55695D]">
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2.5 hover:text-[#0F5D3A] transition group"
                >
                  <ShieldCheckIcon className="w-4 h-4 text-[#55695D] group-hover:text-[#0F5D3A] shrink-0 transition" />
                  <span>Privacy Policy (Preview)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-2.5 hover:text-[#0F5D3A] transition group"
                >
                  <FileTextIcon className="w-4 h-4 text-[#55695D] group-hover:text-[#0F5D3A] shrink-0 transition" />
                  <span>Terms of Service (Preview)</span>
                </Link>
              </li>
            </ul>

            {/* Soft pale-green notice panel */}
            <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-[#EAF4E5]/60 border border-[#D5E8CE] flex items-start gap-2.5">
              <InfoIcon className="w-4 h-4 text-[#0F5D3A] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#17231D]">Notice</div>
                <p className="text-[11px] text-[#55695D] leading-relaxed mt-0.5">
                  Online shopping, cart, and payment transactions are strictly fulfilled inside the official ZUNO Customer Mobile App.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-5 sm:pt-6 border-t border-[#EAEFEA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7A70]">
          <div className="text-center sm:text-left text-[11px] sm:text-xs">
            © 2026 {brand.name} Hyperlocal Commerce. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-[#6B7A70]">
            <Link href="/privacy" className="hover:text-[#0F5D3A] transition">
              Privacy
            </Link>
            <span className="text-[#D5E8CE]">|</span>
            <Link href="/terms" className="hover:text-[#0F5D3A] transition">
              Terms
            </Link>
            <span className="text-[#D5E8CE]">|</span>
            <Link href="/contact" className="hover:text-[#0F5D3A] transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
