import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@zuno/config";

export const metadata: Metadata = {
  title: "Help & Frequently Asked Questions — ZUNO Support",
  description:
    "Find answers to common questions about ordering, delivery coverage, participating local shops, and customer safety on ZUNO in Renukoot Central.",
};

const FAQ_SECTIONS = [
  {
    category: "Ordering & Delivery",
    items: [
      {
        question: "Can I place an order directly on this website?",
        answer:
          "No. The public website is designed strictly for local shop discovery, catalog exploration, and checking delivery coverage. To ensure real-time inventory verification and live GPS rider tracking, all orders are placed through the official ZUNO Customer Mobile App.",
      },
      {
        question: "What areas are currently served?",
        answer:
          "ZUNO is actively operational in Renukoot Central (PIN 231217) and adjacent residential colonies in Sonbhadra, Uttar Pradesh. You can test your specific PIN on our Service Area page.",
      },
      {
        question: "How fast is delivery?",
        answer:
          "Because ZUNO operates on a hyperlocal model where delivery partners pick up directly from stores right in your neighborhood, orders typically reach your doorstep within minutes of packaging.",
      },
    ],
  },
  {
    category: "Local Shops & Products",
    items: [
      {
        question: "Are products coming from warehouses or local stores?",
        answer:
          "100% of products come directly from verified independent shops, kirana merchants, and local vegetable and fruit vendors located within your town.",
      },
      {
        question: "Are prices higher than buying in person?",
        answer:
          "ZUNO partners with merchants to maintain fair, transparent local pricing without arbitrary platform markups. Prices reflect the shop’s active inventory catalog.",
      },
      {
        question: "What if an item is temporarily out of stock?",
        answer:
          "Before confirming your order in the mobile app, the system checks real-time inventory. In the rare event of a substitution need, the store will contact you before dispatch.",
      },
    ],
  },
  {
    category: "Safety & Payments",
    items: [
      {
        question: "What payment methods are supported?",
        answer:
          "The Customer App supports Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and major online payment cards.",
      },
      {
        question: "How does OTP verification protect my delivery?",
        answer:
          "Every order generated in the Customer App produces a unique 4-digit delivery PIN. The delivery partner cannot mark your order as delivered until you physically provide this code, guaranteeing that handovers cannot be falsified.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF4E5] border border-[#D5E8CE] text-[#0F5D3A] text-xs font-bold mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22A06B]" />
            <span>Help Center &amp; Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#17231D] tracking-tight leading-tight">
            Frequently Asked <span className="text-[#0F5D3A]">Questions</span>
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm lg:text-base text-[#55695D] leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about ZUNO’s hyperlocal shopping experience in Renukoot.
          </p>
        </div>

        {/* FAQ Groups */}
        <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
          {FAQ_SECTIONS.map((section) => (
            <div
              key={section.category}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 border border-[#EAEFEA] shadow-xs"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#F0F4F0]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F5D3A]" />
                  <h2 className="text-lg sm:text-xl font-black text-[#17231D] tracking-tight">
                    {section.category}
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-[#6B7A70] bg-[#F8FAF6] px-2.5 py-0.5 rounded-full border border-[#EAEFEA]">
                  {section.items.length} {section.items.length === 1 ? "Question" : "Questions"}
                </span>
              </div>

              {/* FAQ Items */}
              <div className="space-y-3.5 sm:space-y-4">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="pb-3.5 sm:pb-4 border-b border-[#F4F6F4] last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-extrabold text-sm sm:text-base text-[#17231D]">
                      {item.question}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#55695D] leading-relaxed max-w-4xl">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Assistance Channel Box */}
        <div className="p-5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-[#EAF4E5] border border-[#D5E8CE] text-[#0F5D3A]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#17231D]">
                Still need assistance?
              </h2>
              <p className="text-xs sm:text-sm text-[#246142] mt-1 leading-relaxed max-w-2xl">
                For operational inquiries or partner support, reach out directly through our verified
                channels. Active customer order support is managed directly within the Customer App.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5D3A]"
              >
                <span>Complete Contact Details</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <a
              href="tel:8887602317"
              className="p-4 rounded-xl bg-white border border-[#D5E8CE] hover:border-[#22A06B] transition shadow-xs group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B7A70] block">Toll-Free Partner Helpline</span>
                <span className="text-xs font-bold text-[#0F5D3A] group-hover:translate-x-0.5 transition">Call ↗</span>
              </div>
              <span className="text-sm sm:text-base font-extrabold text-[#17231D] mt-0.5 block group-hover:text-[#0F5D3A] transition-colors">
                8887602317
              </span>
              <span className="text-[11px] text-[#246142] mt-1 block">Hours: 7:00 AM – 11:00 PM Daily</span>
            </a>

            <a
              href="mailto:zunonearby@gmail.com"
              className="p-4 rounded-xl bg-white border border-[#D5E8CE] hover:border-[#22A06B] transition shadow-xs group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B7A70] block">Partner Desk Email</span>
                <span className="text-xs font-bold text-[#0F5D3A] group-hover:translate-x-0.5 transition">Email ↗</span>
              </div>
              <span className="text-sm sm:text-base font-extrabold text-[#17231D] mt-0.5 block group-hover:text-[#0F5D3A] transition-colors">
                zunonearby@gmail.com
              </span>
              <span className="text-[11px] text-[#246142] mt-1 block">For shop and delivery partner inquiries</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
