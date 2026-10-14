import React from "react";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@zuno/config";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#EAEFEA] pt-12 pb-8 text-[#17231D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <div className="relative w-28 h-9">
                <Image src="/brandlogo.png" alt="ZUNO" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-xs text-[#6B7A70] leading-relaxed mb-4">
              ZUNO is Renukoot’s dedicated hyperlocal commerce platform, connecting you to your favorite
              neighborhood grocery, vegetable, and essentials stores.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EAF4E5] text-[#0F5D3A] text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A06B]" />
              Active in PIN 231217
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">
              Explore ZUNO
            </h3>
            <ul className="space-y-2 text-xs font-medium text-[#6B7A70]">
              <li>
                <Link href="/about" className="hover:text-[#0F5D3A] transition">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/service-area" className="hover:text-[#0F5D3A] transition">
                  Delivery Coverage (PIN Check)
                </Link>
              </li>
              <li>
                <Link href="/download" className="hover:text-[#0F5D3A] transition">
                  Customer Mobile App
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">
              Support & Desk
            </h3>
            <ul className="space-y-2 text-xs font-medium text-[#6B7A70]">
              <li>
                <Link href="/help" className="hover:text-[#0F5D3A] transition">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0F5D3A] transition">
                  Contact Information
                </Link>
              </li>
              <li className="pt-1 text-[11px] text-[#9CA3AF]">
                Partner Helpline: <span className="font-semibold text-[#17231D]">+918887602317</span>
              </li>
              <li className="text-[11px] text-[#9CA3AF]">
                Partner Desk: <span className="font-semibold text-[#17231D]">zunonearby@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Notice */}
          <div>
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">
              Legal & Safety
            </h3>
            <ul className="space-y-2 text-xs font-medium text-[#6B7A70]">
              <li>
                <Link href="/privacy" className="hover:text-[#0F5D3A] transition">
                  Privacy Policy (Preview)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0F5D3A] transition">
                  Terms of Service (Preview)
                </Link>
              </li>
            </ul>
            <div className="mt-4 p-2.5 rounded-lg bg-[#F8FAF6] border border-[#EAEFEA] text-[11px] text-[#6B7A70]">
              <span className="font-bold text-[#0F5D3A]">Notice:</span> Online shopping, cart, and payment transactions are strictly fulfilled inside the official ZUNO Customer Mobile App.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#EAEFEA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <div>
            © {new Date().getFullYear()} {brand.name} Hyperlocal Commerce. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-[#6B7A70]">
            <Link href="/privacy" className="hover:text-[#0F5D3A]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#0F5D3A]">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-[#0F5D3A]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
