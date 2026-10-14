"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MagneticElement } from "@/components/ui/MagneticElement";

const NAV_LINKS = [
  { name: "Categories", href: "/categories" },
  { name: "About", href: "/about" },
  { name: "Service Area", href: "/service-area" },
  { name: "Help & FAQs", href: "/help" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAEFEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Location Selector */}
        <div className="flex items-center gap-3 lg:gap-4">
          <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5D3A] rounded-lg">
            <div className="relative w-28 h-9 sm:w-32 sm:h-10">
              <Image
                src="/brandlogo.png"
                alt="ZUNO — Everything nearby."
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Location Selector Pill */}
          <Link
            href="/service-area"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F8F2] border border-[#D5E8CE] text-xs font-semibold text-[#17231D] hover:bg-[#EAF4E5] transition"
            title="Service Area: Renukoot Central"
          >
            <svg
              className="w-3.5 h-3.5 text-[#0F5D3A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
            <span>Renukoot Central · 231217</span>
            <svg
              className="w-3.5 h-3.5 text-[#6B7A70]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative py-2 text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5D3A] rounded-sm ${
                  isActive
                    ? "text-[#0F5D3A] font-bold"
                    : "text-[#55695D] font-medium hover:text-[#0F5D3A]"
                }`}
              >
                <span>{link.name}</span>
                {/* Thin, premium ZUNO-green underline directly beneath the text */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#0F5D3A] transition-all duration-300 ease-out origin-center ${
                    isActive
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-75"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <MagneticElement>
            <Link
              href="/download"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F5D3A]"
            >
              <svg
                className="w-4 h-4"
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
              <span>Get the App</span>
            </Link>
          </MagneticElement>

          {/* Mobile Drawer Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#17231D] hover:bg-[#F3F4F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5D3A]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="fixed inset-y-0 right-0 max-w-[280px] sm:max-w-xs w-full bg-white shadow-xl flex flex-col justify-between p-5 sm:p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAEFEA]">
                <div className="relative w-24 h-8">
                  <Image src="/brandlogo.png" alt="ZUNO" fill className="object-contain" />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#6B7A70] hover:bg-[#F3F4F6] focus:outline-none"
                  aria-label="Close navigation menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 px-2.5 py-1.5 rounded-lg bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold inline-block mb-4">
                Renukoot Central (PIN 231217)
              </div>

              <nav className="flex flex-col gap-1.5">
                <Link
                  href="/"
                  aria-current={pathname === "/" ? "page" : undefined}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    pathname === "/"
                      ? "bg-[#EAF4E5] text-[#0F5D3A] font-bold"
                      : "text-[#17231D] hover:bg-gray-50 hover:text-[#0F5D3A]"
                  }`}
                >
                  <span className="relative">
                    Home
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-[#0F5D3A] transition-all duration-300 ${
                        pathname === "/" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                      }`}
                    />
                  </span>
                  {pathname === "/" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F5D3A]" />
                  )}
                </Link>
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-[#EAF4E5] text-[#0F5D3A] font-bold"
                          : "text-[#17231D] hover:bg-gray-50 hover:text-[#0F5D3A]"
                      }`}
                    >
                      <span className="relative">
                        {link.name}
                        <span
                          aria-hidden="true"
                          className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-[#0F5D3A] transition-all duration-300 ${
                            isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                          }`}
                        />
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F5D3A]" />
                      )}
                    </Link>
                  );
                })}
                <div className="border-t border-[#EAEFEA] my-2 pt-2">
                  <Link
                    href="/privacy"
                    className="block px-3 py-2 text-xs font-medium text-[#6B7A70] hover:text-[#0F5D3A]"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="block px-3 py-2 text-xs font-medium text-[#6B7A70] hover:text-[#0F5D3A]"
                  >
                    Terms of Service
                  </Link>
                </div>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#EAEFEA]">
              <Link
                href="/download"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Install Customer App</span>
              </Link>
              <p className="text-[11px] text-[#6B7A70] text-center mt-2">
                Order fulfillment occurs inside the Customer App
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
