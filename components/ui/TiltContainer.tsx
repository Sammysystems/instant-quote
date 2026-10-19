import React, { useRef, useState, MouseEvent } from "react";

interface TiltContainerProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number; // maximum rotation degrees, default 5
  scale?: number;     // scale on hover, default 1.02
}

export function TiltContainer({
  children,
  className = "",
  maxRotate = 6,
  scale = 1.02,
}: TiltContainerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>("");
  const [transitionStyle, setTransitionStyle] = useState<string>("all 0.3s cubic-bezier(0.25, 1, 0.5, 1)");

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate normalized rotation values between -1 and 1
    const rotateY = ((x - centerX) / centerX) * maxRotate;
    const rotateX = -((y - centerY) / centerY) * maxRotate;

    setTransitionStyle("none"); // disable transitions during tracking for smooth 1:1 feel
    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    );
  };

  const handleMouseLeave = () => {
    // Reset back to original with smooth transition
    setTransitionStyle("all 0.5s cubic-bezier(0.25, 1, 0.5, 1)");
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: transitionStyle,
        transformStyle: "preserve-3d",
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
