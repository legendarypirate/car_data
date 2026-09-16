import React from "react";

export function BrandLogo({
  brand,
  className = "",
  theme = "dark",
}: {
  brand: string;
  className?: string;
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";
  const textColor = isLight ? "text-white" : "text-ink";
  const subColor = isLight ? "text-white/70" : "text-mute";
  const strokeColor = isLight ? "currentColor" : "currentColor";

  switch (brand) {
    case "Toyota":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <svg
            className={`h-5 w-5 ${textColor}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 5.58 2 10c0 3.84 3.39 7.03 8 7.78V16c-3.72-.69-6-3.13-6-6 0-3.31 3.58-6 8-6s8 2.69 8 6c0 2.87-2.28 5.31-6 6v1.78c4.61-.75 8-3.94 8-7.78 0-4.42-4.48-8-10-8zm0 4c-2.76 0-5 2.24-5 5 0 2.45 1.77 4.47 4.1 4.88.29.05.59.08.9.08.31 0 .61-.03.9-.08 2.33-.41 4.1-2.43 4.1-4.88 0-2.76-2.24-5-5-5zm0 1.8c1.77 0 3.2 1.43 3.2 3.2 0 1.77-1.43 3.2-3.2 3.2-1.77 0-3.2-1.43-3.2-3.2 0-1.77 1.43-3.2 3.2-3.2zm-.9 7.9c-.3 0-.6-.02-.9-.06V19c.3.02.6.03.9.03.3 0 .6-.01.9-.03v-3.3c-.3.04-.6.06-.9.06z" />
          </svg>
          <span className={`text-[15px] font-bold tracking-tight ${textColor}`}>
            Toyota
          </span>
        </div>
      );
    case "BYD":
      return (
        <div className={`flex items-center ${className}`}>
          <span
            className={`text-[18px] font-black italic tracking-widest font-mono border-b-2 pb-0.5 leading-none ${textColor} ${
              isLight ? "border-white" : "border-ink"
            }`}
          >
            BYD
          </span>
        </div>
      );
    case "Tesla":
      return (
        <div className={`flex items-center gap-1.5 ${className}`}>
          <svg
            className={`h-5 w-5 ${textColor}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 4.5c-3.1 0-6.1.8-8.5 2.3L2 5.2C4.9 3.2 8.3 2 12 2s7.1 1.2 10 3.2l-1.5 1.6C18.1 5.3 15.1 4.5 12 4.5zm0 3.2c1.7 0 3.3.4 4.7 1.1L12 22 7.3 8.8c1.4-.7 3-1.1 4.7-1.1zm-8.8 4.6l-1.7-.8c.4-1 .9-1.9 1.6-2.7l1.4 1.1c-.5.7-.9 1.5-1.3 2.4zm17.6 0c-.4-.9-.8-1.7-1.3-2.4l1.4-1.1c.7.8 1.2 1.7 1.6 2.7l-1.7.8z" />
          </svg>
          <span className={`text-[15px] font-bold tracking-tight ${textColor}`}>
            Tesla
          </span>
        </div>
      );
    case "Zeekr":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div
            className={`flex h-4 w-4 items-center justify-center border-2 ${
              isLight ? "border-white" : "border-ink"
            }`}
          >
            <div className={`h-1.5 w-1.5 ${isLight ? "bg-white" : "bg-ink"}`} />
          </div>
          <span
            className={`text-[14px] font-black tracking-[0.2em] uppercase ${textColor}`}
          >
            ZEEKR
          </span>
        </div>
      );
    case "XPeng":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <svg
            className={`h-4 w-5 ${textColor}`}
            viewBox="0 0 24 16"
            fill="currentColor"
          >
            <path d="M4 1L0 8l4 7h4L4 8l4-7H4zm16 0l-4 7 4 7h4l-4-7 4-7h-4z" />
          </svg>
          <span
            className={`text-[14px] font-black tracking-[0.15em] uppercase ${textColor}`}
          >
            XPENG
          </span>
        </div>
      );
    case "AITO":
      return (
        <div className={`flex items-center ${className}`}>
          <span
            className={`text-[16px] font-black tracking-[0.25em] uppercase ${textColor}`}
          >
            AITO
          </span>
        </div>
      );
    case "Li Auto":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Li Auto symbol */}
          <div className="flex items-center gap-0.5">
            <div
              className={`h-4 w-2 rounded-[2px] ${
                isLight ? "bg-white" : "bg-ink"
              }`}
            />
            <div
              className={`h-4 w-3.5 rounded-[2px] ${
                isLight ? "bg-white" : "bg-ink"
              }`}
            />
          </div>
          <span className={`text-[15px] font-bold tracking-tight ${textColor}`}>
            理想
          </span>
        </div>
      );
    case "NIO":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* NIO logo arch & chevron */}
          <svg
            className={`h-5 w-5 ${textColor}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C7.5 2 3.7 4.9 2.4 9h3.4C6.8 6.5 9.2 4.6 12 4.6c2.8 0 5.2 1.9 6.2 4.4h3.4C20.3 4.9 16.5 2 12 2zm0 8.5L7 18.5h4.2l.8-1.5.8 1.5H17l-5-8z" />
          </svg>
          <span
            className={`text-[15px] font-black tracking-[0.18em] uppercase ${textColor}`}
          >
            NIO
          </span>
        </div>
      );
    case "BMW":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* BMW Roundel */}
          <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#1e40af] bg-white overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 h-3 w-3 bg-[#0284c7]" />
            <div className="absolute bottom-0 left-0 h-3 w-3 bg-[#0284c7]" />
            <div className="absolute inset-0 m-auto h-2 w-2 rounded-full border border-black/30" />
          </div>
          <span className={`text-[15px] font-bold tracking-tight ${textColor}`}>
            BMW
          </span>
        </div>
      );
    case "Mercedes-Benz":
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          {/* Mercedes 3-pointed star */}
          <svg
            className={`h-6 w-6 ${textColor}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path
              d="M12 2v10l8.66 5M12 12l-8.66 5"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case "Audi":
      return (
        <div className={`flex items-center ${className}`}>
          {/* Audi 4 rings */}
          <div className="flex items-center -space-x-1.5">
            <div
              className={`h-5 w-5 rounded-full border-2 ${
                isLight ? "border-white" : "border-ink"
              }`}
            />
            <div
              className={`h-5 w-5 rounded-full border-2 ${
                isLight ? "border-white" : "border-ink"
              }`}
            />
            <div
              className={`h-5 w-5 rounded-full border-2 ${
                isLight ? "border-white" : "border-ink"
              }`}
            />
            <div
              className={`h-5 w-5 rounded-full border-2 ${
                isLight ? "border-white" : "border-ink"
              }`}
            />
          </div>
        </div>
      );
    default:
      return (
        <span
          className={`text-[15px] font-bold tracking-tight ${textColor} ${className}`}
        >
          {brand}
        </span>
      );
  }
}
