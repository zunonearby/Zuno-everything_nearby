"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Living Green Orb Custom Cursor for ZUNO
 *
 * - Precision primary green dot (#0F5D3A) tracking immediate pointer coordinates.
 * - Soft, translucent emerald glow (#22A06B / #A7D56B) trailing with smooth Lerp damping.
 * - Interactive expansion when hovering links, buttons, inputs, and cards.
 * - Settle detection: automatically pauses animation frames when pointer is stationary.
 * - Only mounts on fine-pointer desktop devices; completely disabled on touch and reduced-motion.
 * - Native cursor remains fully visible and functional as fallback; zero event interception (`pointer-events: none`).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  // Position tracking refs
  const mousePos = useRef({ x: -100, y: -100 });
  const orbPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const isVisible = useRef(false);
  const isLoopRunning = useRef(false);
  const animFrameId = useRef<number | null>(null);

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 1. Feature & accessibility detection
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const checkSupport = () => {
      setIsSupported(finePointer.matches && !reducedMotion.matches);
    };

    checkSupport();

    finePointer.addEventListener("change", checkSupport);
    reducedMotion.addEventListener("change", checkSupport);

    return () => {
      finePointer.removeEventListener("change", checkSupport);
      reducedMotion.removeEventListener("change", checkSupport);
    };
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const dot = dotRef.current;
    const orb = orbRef.current;
    if (!dot || !orb) return;

    // 2. Animation loop with Lerp damping and idle pausing
    const tick = () => {
      const dx = mousePos.current.x - orbPos.current.x;
      const dy = mousePos.current.y - orbPos.current.y;

      // Lerp easing towards mouse (0.16 = smooth, responsive follow)
      orbPos.current.x += dx * 0.16;
      orbPos.current.y += dy * 0.16;

      // Update orb transform
      const scale = isHovering.current ? 1.5 : 1.0;
      orb.style.transform = `translate3d(${orbPos.current.x}px, ${orbPos.current.y}px, 0) scale(${scale})`;

      // Update dot transform directly
      dot.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) scale(${isHovering.current ? 0.8 : 1.0})`;

      // Idle detection: if settled within 0.1px, stop the RAF loop until next pointer move
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        animFrameId.current = requestAnimationFrame(tick);
      } else {
        isLoopRunning.current = false;
        animFrameId.current = null;
      }
    };

    const startLoop = () => {
      if (!isLoopRunning.current) {
        isLoopRunning.current = true;
        animFrameId.current = requestAnimationFrame(tick);
      }
    };

    // 3. Pointer tracking handler
    const handlePointerMove = (e: PointerEvent) => {
      if (!isVisible.current) {
        isVisible.current = true;
        dot.style.opacity = "1";
        orb.style.opacity = "1";
      }

      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Initialize orb position instantly on first entrance
      if (orbPos.current.x < 0) {
        orbPos.current.x = e.clientX;
        orbPos.current.y = e.clientY;
      }

      // Context-aware interactive element detection
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "a, button, input, select, textarea, [role='button'], [data-cursor-hover]"
        );
        isHovering.current = Boolean(interactive);
      }

      startLoop();
    };

    // 4. Window boundary handlers
    const handleMouseLeave = () => {
      isVisible.current = false;
      if (dot) dot.style.opacity = "0";
      if (orb) orb.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
      if (dot) dot.style.opacity = "1";
      if (orb) orb.style.opacity = "1";
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isSupported]);

  if (!isSupported) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    >
      {/* Living Green Outer Glow Orb (Trails with smooth damping) */}
      <div
        ref={orbRef}
        style={{
          width: "36px",
          height: "36px",
          marginLeft: "-18px",
          marginTop: "-18px",
          opacity: 0,
          willChange: "transform, opacity",
          transition: "opacity 0.25s ease-out, border-color 0.2s ease, background 0.2s ease",
          background:
            "radial-gradient(circle, rgba(167, 213, 107, 0.28) 0%, rgba(34, 160, 107, 0.12) 50%, rgba(15, 93, 58, 0) 75%)",
          boxShadow: "0 0 14px rgba(34, 160, 107, 0.22)",
        }}
        className="rounded-full border border-[#22A06B]/35"
      />

      {/* Living Green Inner Dot (Pinned to exact coordinates) */}
      <div
        ref={dotRef}
        style={{
          width: "6px",
          height: "6px",
          marginLeft: "-3px",
          marginTop: "-3px",
          opacity: 0,
          willChange: "transform, opacity",
          transition: "opacity 0.2s ease-out",
          backgroundColor: "#0F5D3A",
          boxShadow: "0 0 6px rgba(15, 93, 58, 0.45)",
        }}
        className="rounded-full"
      />
    </div>
  );
}

export default CustomCursor;
