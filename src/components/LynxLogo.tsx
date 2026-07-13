import React from "react";

interface LynxLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  lightMode?: boolean;
}

export default function LynxLogo({ className = "", size = "md", lightMode = false }: LynxLogoProps) {
  let titleSize = "text-xl";
  let subtitleSize = "text-[8px]";
  let spacing = "tracking-[0.16em]";
  let gap = "gap-1";

  if (size === "sm") {
    titleSize = "text-lg";
    subtitleSize = "text-[7px]";
    spacing = "tracking-[0.14em]";
    gap = "gap-0.5";
  } else if (size === "lg") {
    titleSize = "text-3xl";
    subtitleSize = "text-[10px]";
    spacing = "tracking-[0.18em]";
    gap = "gap-1.5";
  } else if (size === "xl") {
    titleSize = "text-4xl md:text-5xl";
    subtitleSize = "text-[12px] md:text-[14px]";
    spacing = "tracking-[0.2em]";
    gap = "gap-2";
  }

  const textColor = lightMode ? "text-slate-900" : "text-white";
  const subtitleColor = lightMode ? "text-slate-500" : "text-white/90";
  const eduColor = "text-[#38bdf8]"; // Beautiful Sky Blue matching the logo image perfectly

  return (
    <div className={`flex flex-col select-none font-sans ${className}`} id="lynx-logo-container">
      <div className={`${titleSize} font-extrabold tracking-tight flex items-baseline leading-none ${textColor}`}>
        <span>LY</span>
        <span className="lowercase">nx</span>
        <span className={`${eduColor} ml-1.5 font-black`}>EDU</span>
      </div>
      <div className={`${subtitleSize} font-bold ${subtitleColor} ${spacing} uppercase mt-1.5 leading-none`}>
        SISTEMAS ESCOLARES INTELIGENTES
      </div>
    </div>
  );
}
