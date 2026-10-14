import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    name: "Grocery Staples",
    slug: "grocery-staples",
    description: "Lentils, basmati rice, whole wheat flour, spices, and daily cooking oils.",
    image: "/images/cat-staples.jpg",
  },
  {
    name: "Fruits & Vegetables",
    slug: "fruits-vegetables",
    description: "Farm-fresh green vegetables, crisp fruits, onions, potatoes, and herbs.",
    image: "/images/cat-fruits-veg.jpg",
  },
  {
    name: "Dairy & Eggs",
    slug: "dairy-eggs",
    description: "Fresh farm milk, artisanal paneer, butter, curd, and farm eggs.",
    image: "/images/cat-dairy-eggs.jpg",
  },
  {
    name: "Snacks & Beverages",
    slug: "snacks-beverages",
    description: "Chips, authentic Indian namkeen, cold beverages, tea, and biscuits.",
    image: "/images/cat-snacks-bev.jpg",
  },
  {
    name: "Household & Cleaning",
    slug: "household-cleaning",
    description: "Detergents, surface cleaners, dishwash bars, and daily home essentials.",
    image: "/images/cat-household.jpg",
  },
  {
    name: "Personal Care",
    slug: "personal-care",
    description: "Oral care, soaps, shampoos, skincare, lotions, and grooming essentials.",
    image: "/images/cat-personal-care.jpg",
  },
  {
    name: "Bakery",
    slug: "bakery",
    description: "Freshly baked artisan breads, cookies, buns, muffins, and tea cakes.",
    image: "/images/cat-bakery.png",
  },
];

export default function CategoriesPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7A70] mb-3">
            <Link href="/" className="hover:text-[#0F5D3A] transition">Home</Link>
            <span>/</span>
            <span className="text-[#0F5D3A]">Categories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#17231D] tracking-tight">
            Explore Everyday Essentials
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6B7A70] max-w-2xl">
            Browse all available product categories sourced from verified neighborhood merchants across Renukoot Central.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.slug}
              className="bg-white rounded-2xl border border-[#EAEFEA] overflow-hidden p-4 hover:border-[#22A06B]/50 hover:shadow-md transition group"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F8FAF6] mb-4">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-extrabold text-lg text-[#17231D] group-hover:text-[#0F5D3A] transition">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-[#6B7A70] mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#EAEFEA] flex items-center justify-between text-xs font-bold text-[#0F5D3A]">
                <span>Order in Customer App</span>
                <span className="group-hover:translate-x-1 transition">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mt-12 p-6 rounded-2xl bg-[#EAF4E5] border border-[#D5E8CE] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-[#0F5D3A]">Ready to shop?</h3>
            <p className="text-xs text-[#416B4D] mt-0.5">
              Browse on the web, then install the ZUNO Customer App to build your cart and place orders.
            </p>
          </div>
          <Link
            href="/download"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0F5D3A] text-white hover:bg-[#0B482D] transition whitespace-nowrap shadow-sm"
          >
            Get the App →
          </Link>
        </div>
      </div>
    </div>
  );
}
