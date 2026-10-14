"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerShopkeeper } from "../../features/auth/api";

export default function ShopRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Owner Info
  const [ownerFullName, setOwnerFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Shop Info
  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [locality, setLocality] = useState("Renukoot");
  const [pincode, setPincode] = useState("231217");
  const [loading, setLoading] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerFullName.trim().length < 2) {
      alert("Please enter full owner name.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      alert("Please enter your shop name.");
      return;
    }
    if (!addressLine.trim()) {
      alert("Please enter shop address.");
      return;
    }

    setLoading(true);
    try {
      await registerShopkeeper({
        ownerFullName: ownerFullName.trim(),
        phone: phone.replace(/\D/g, ""),
        shopName: shopName.trim(),
        description: description.trim(),
        addressLine: addressLine.trim(),
        locality: locality.trim(),
        pincode: pincode.trim(),
      });
      router.push(`/status?registered=true&phone=${phone.replace(/\D/g, "")}`);
    } catch (err: any) {
      alert(err.message || "Failed to register shop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF6] flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF4E5] border border-[#0F5D3A] rounded-full text-xs font-bold text-[#0F5D3A]">
            ZUNO Shop Registration
          </div>
          <h1 className="text-2xl font-extrabold text-[#17231D]">Register Your Shop</h1>
          <p className="text-xs text-gray-500">
            Join ZUNO to sell groceries and essentials nearby in PIN 231217, Renukoot.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2">
          <div className={`flex-1 py-1.5 rounded-full text-center text-xs font-bold ${step >= 1 ? "bg-[#0F5D3A] text-white" : "bg-gray-200 text-gray-600"}`}>
            1. Owner Details
          </div>
          <div className={`flex-1 py-1.5 rounded-full text-center text-xs font-bold ${step >= 2 ? "bg-[#0F5D3A] text-white" : "bg-gray-200 text-gray-600"}`}>
            2. Shop Info
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#17231D] mb-1">
                Owner Full Name
              </label>
              <input
                type="text"
                value={ownerFullName}
                onChange={(e) => setOwnerFullName(e.target.value)}
                placeholder="Owner full name"
                className="w-full px-3 py-2.5 text-sm font-bold border border-gray-300 rounded-xl outline-none focus:border-[#0F5D3A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231D] mb-1">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-[#0F5D3A]">
                <span className="bg-gray-100 px-3 py-2.5 text-sm font-bold text-gray-700 border-r border-gray-300">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="flex-1 px-3 py-2.5 text-sm font-bold text-[#17231D] outline-none"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0F5D3A] hover:bg-[#0c4b2e] text-white rounded-xl text-sm font-extrabold transition shadow-sm"
            >
              Continue to Shop Details →
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#17231D] mb-1">
                Shop Name
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Agarwal Kirana Store"
                className="w-full px-3 py-2.5 text-sm font-bold border border-gray-300 rounded-xl outline-none focus:border-[#0F5D3A]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231D] mb-1">
                Description / Categories Sold
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Fresh vegetables, fruits, dairy & groceries"
                className="w-full px-3 py-2.5 text-sm font-bold border border-gray-300 rounded-xl outline-none focus:border-[#0F5D3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231D] mb-1">
                Address & Locality
              </label>
              <input
                type="text"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Shop No, Street, Market Name"
                className="w-full px-3 py-2.5 text-sm font-bold border border-gray-300 rounded-xl outline-none focus:border-[#0F5D3A]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#17231D] mb-1">
                  City / Region
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm font-bold border border-gray-300 rounded-xl outline-none bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#17231D] mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm font-bold border border-gray-300 rounded-xl outline-none bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-bold transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 py-3 bg-[#0F5D3A] hover:bg-[#0c4b2e] text-white rounded-xl text-sm font-extrabold transition shadow-sm disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Shop Application"}
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link href="/login" className="text-xs text-gray-500 hover:underline">
            Already registered? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
