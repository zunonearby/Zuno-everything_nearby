import Link from "next/link";
import Image from "next/image";

const SHOPS = [
  {
    id: "gupta-kirana",
    name: "Gupta Kirana Store",
    category: "Kirana & Grocery",
    locality: "Renukoot Central",
    image: "/images/shop-gupta-kirana.jpg",
    description: "Daily grocery staples, pulses, grains, branded spices, and packaged necessities.",
  },
  {
    id: "fresh-mart",
    name: "Fresh Mart",
    category: "Fruits & Vegetables",
    locality: "Renukoot Central",
    image: "/images/shop-fresh-mart.jpg",
    description: "Farm-fresh daily harvest vegetables, fresh seasonal fruits, and greens.",
  },
  {
    id: "sharma-general",
    name: "Sharma General Store",
    category: "Daily Essentials",
    locality: "Renukoot Central",
    image: "/images/shop-sharma-general.jpg",
    description: "Household cleaning supplies, toiletries, dairy essentials, and snacks.",
  },
];

export default function ShopsPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7A70] mb-3">
            <Link href="/" className="hover:text-[#0F5D3A] transition">Home</Link>
            <span>/</span>
            <span className="text-[#0F5D3A]">Local Shops</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#17231D] tracking-tight">
            Local Shops Around Renukoot
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6B7A70] max-w-2xl">
            Verified neighborhood retailers offering authentic products with fast delivery in Renukoot Central (PIN 231217).
          </p>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHOPS.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-2xl border border-[#EAEFEA] p-4 sm:p-5 flex flex-col justify-between hover:border-[#22A06B]/50 hover:shadow-md transition group"
            >
              <div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#F8FAF6] mb-4">
                  <Image
                    src={shop.image}
                    alt={shop.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#17231D] group-hover:text-[#0F5D3A] transition">
                      {shop.name}
                    </h2>
                    <span className="text-xs font-medium text-[#6B7A70] block mt-0.5">
                      {shop.category}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F5D3A] bg-[#EAF4E5] px-2 py-0.5 rounded-full whitespace-nowrap">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#6B7A70] mt-2.5 leading-relaxed">
                  {shop.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-[#6B7A70] mt-3">
                  <svg className="w-3.5 h-3.5 text-[#0F5D3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{shop.locality}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#EAEFEA] flex items-center justify-between">
                <span className="text-xs text-[#6B7A70]">Order via Customer App</span>
                <Link
                  href="/download"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EAF4E5] text-[#0F5D3A] hover:bg-[#d5ebd0] transition"
                >
                  <span>Discover shop</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
