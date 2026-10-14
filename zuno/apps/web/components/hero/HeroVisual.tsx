"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import Three.js / React Three Fiber scene with SSR disabled
const HeroScene3D = dynamic(() => import("@/components/3d/HeroScene3D"), {
  ssr: false,
});

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Parallax state with Lerp interpolation
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visualMode, setVisualMode] = useState<"basket" | "lifestyle">("lifestyle");

  // 1. Detect device & reduced motion
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // 2. IntersectionObserver to pause when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3. Smooth Mouse Parallax Animation for DOM Card
  useEffect(() => {
    if (reducedMotion || isMobile) return;

    const card = cardRef.current;
    if (!card) return;

    const tick = () => {
      animFrameRef.current = requestAnimationFrame(tick);
      if (!isVisibleRef.current) return;

      // Lerp mouse coordinates towards target
      const ease = 0.08;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * ease;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * ease;

      // Restrained, elegant 3D perspective tilt
      const rotY = mouseRef.current.x * 4; // max ±4 deg
      const rotX = -mouseRef.current.y * 4; // max ±4 deg
      const transX = mouseRef.current.x * 7;
      const transY = mouseRef.current.y * 7 + scrollRef.current * -0.04;

      card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 0)`;
    };

    tick();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [reducedMotion, isMobile]);

  // 4. Scroll tracking
  useEffect(() => {
    if (reducedMotion || isMobile) return;
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion, isMobile]);

  // 5. Pointer Handlers
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion || isMobile) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const targetX = (x - 0.5) * 2;
      const targetY = (y - 0.5) * 2;
      mouseRef.current.targetX = targetX;
      mouseRef.current.targetY = targetY;

      setPointer({ x: targetX, y: targetY });
    },
    [reducedMotion, isMobile]
  );

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    setPointer({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full select-none"
    >
      {/* 3D WebGL Ambient Layer: Floating organic leaves & light motes */}
      {!reducedMotion && !isMobile && (
        <HeroScene3D pointerX={pointer.x} pointerY={pointer.y} />
      )}

      {/* Main Perspective Hero Visual Container */}
      <div
        ref={cardRef}
        className="relative z-10 w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden bg-white shadow-xl shadow-green-950/5 border border-[#EAEFEA] transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-950/10"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Visual Content: Fresh Grocery Basket vs Lifestyle Scene */}
        {visualMode === "basket" ? (
          <Image
            src="/images/hero-basket.jpg"
            alt="Fresh grocery harvest in ZUNO branded tote bag with fruits, vegetables and ZUNO Customer mobile app"
            fill
            unoptimized
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-opacity duration-500"
          />
        ) : (
          <Image
            src="/images/hero-lifestyle.jpg"
            alt="Indian adult comfortably seated on sofa browsing ZUNO with fresh groceries nearby"
            fill
            unoptimized
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-opacity duration-500"
          />
        )}

        {/* Soft Vignette / Lighting Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-transparent"
        />

        {/* Floating Depth Badge 1 (Top Left): Verified Neighborhood Stores */}
        <div
          className="hidden sm:flex absolute top-4 left-4 sm:top-5 sm:left-5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-md text-xs font-bold text-[#17231D] items-center gap-2 pointer-events-none transition-transform duration-300"
          style={{
            transform: "translateZ(35px)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#0F5D3A]" />
          <span>Verified Neighborhood Stores</span>
        </div>

        {/* Floating Depth Badge 2 (Bottom Left): Fresh Harvest & Daily Staples */}
        <div
          className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 max-w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/80 shadow-md text-xs font-semibold text-[#17231D] flex items-center gap-2.5 transition-transform duration-300 pointer-events-none"
          style={{
            transform: "translateZ(45px)",
          }}
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAF4E5] text-[#0F5D3A] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="font-extrabold text-[#17231D] leading-tight">Everyday Essentials</div>
            <div className="text-[11px] text-[#55695D] leading-tight">Fresh harvest &amp; local kirana</div>
          </div>
        </div>

        {/* Interactive Visual Mode Switcher (Top Right) */}
        <div
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex items-center p-0.5 rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-md text-[11px] font-bold text-[#55695D]"
          style={{
            transform: "translateZ(40px)",
          }}
        >
          <button
            type="button"
            onClick={() => setVisualMode("lifestyle")}
            className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
              visualMode === "lifestyle"
                ? "bg-[#0F5D3A] text-white shadow-xs"
                : "text-[#55695D] hover:text-[#17231D]"
            }`}
            title="Neighborhood Lifestyle visual"
          >
            Lifestyle
          </button>
          <button
            type="button"
            onClick={() => setVisualMode("basket")}
            className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
              visualMode === "basket"
                ? "bg-[#0F5D3A] text-white shadow-xs"
                : "text-[#55695D] hover:text-[#17231D]"
            }`}
            title="Fresh Grocery Harvest visual"
          >
            Fresh Market
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroVisual;
