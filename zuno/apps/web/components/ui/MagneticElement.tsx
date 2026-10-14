"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";

interface MagneticElementProps {
  children: ReactNode;
  className?: string;
  maxDistance?: number; // Maximum translation in pixels (default: 4px)
  strength?: number; // Attraction strength factor (default: 0.2)
  as?: React.ElementType;
}

/**
 * MagneticElement for Primary Buttons & Action Pills
 *
 * Provides restrained, organic magnetic pull towards the cursor when the pointer
 * is within the element boundaries, resetting smoothly with an ease-out spring
 * curve upon pointer leave.
 */
export function MagneticElement({
  children,
  className = "",
  maxDistance = 4,
  strength = 0.22,
  as: Component = "div",
}: MagneticElementProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateState = () => {
      setIsEnabled(finePointer.matches && !reducedMotion.matches);
    };

    updateState();
    finePointer.addEventListener("change", updateState);
    reducedMotion.addEventListener("change", updateState);

    return () => {
      finePointer.removeEventListener("change", updateState);
      reducedMotion.removeEventListener("change", updateState);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isEnabled || !elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    // Clamp translation to maxDistance
    const clampedX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
    const clampedY = Math.max(-maxDistance, Math.min(maxDistance, deltaY));

    elementRef.current.style.transform = `translate3d(${clampedX.toFixed(2)}px, ${clampedY.toFixed(2)}px, 0)`;
    elementRef.current.style.transition = "transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)";
  };

  const handlePointerLeave = () => {
    if (!elementRef.current) return;
    elementRef.current.style.transform = "translate3d(0px, 0px, 0)";
    elementRef.current.style.transition = "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)";
  };

  return (
    <Component
      ref={elementRef as unknown as React.Ref<never>}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </Component>
  );
}

export default MagneticElement;
