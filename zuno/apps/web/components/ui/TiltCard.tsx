"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation in degrees (default: 3.5 deg)
  perspective?: number; // Perspective distance (default: 1000px)
  scaleOnHover?: number; // Subtle hover scale (default: 1.015)
  dataCursorHover?: boolean;
}

/**
 * TiltCard for Categories, Local Shops & Feature Cards
 *
 * Provides restrained 3D perspective tilt reacting to cursor coordinates,
 * enhancing physical tactility while maintaining clarity and legibility.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 3.5,
  perspective = 1000,
  scaleOnHover = 1.012,
  dataCursorHover = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEnabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2; // -1 to 1
    const normalizedY = (y / rect.height - 0.5) * 2; // -1 to 1

    const rotX = -normalizedY * maxTilt;
    const rotY = normalizedX * maxTilt;

    cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scaleOnHover})`;
    cardRef.current.style.transition = "transform 0.1s ease-out";
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    cardRef.current.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-cursor-hover={dataCursorHover ? "true" : undefined}
      className={`will-change-transform ${className}`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

export default TiltCard;
