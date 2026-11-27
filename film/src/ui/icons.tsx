import React from "react";

// Line icons matching the real sidebar (1.4px stroke, 18px box, #171717).
const S: React.FC<{ size?: number; color?: string; children: React.ReactNode; vb?: number }> = ({
  size = 18,
  color = "#171717",
  children,
  vb = 18,
}) => (
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const IconPlusCircle: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <circle cx="9" cy="9" r="7" />
    <path d="M9 5.8v6.4M5.8 9h6.4" />
  </S>
);
export const IconApps: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <rect x="2.2" y="9.6" width="6.2" height="6.2" rx="1.2" />
    <rect x="9.6" y="9.6" width="6.2" height="6.2" rx="1.2" />
    <rect x="2.2" y="2.2" width="6.2" height="6.2" rx="1.2" />
    <rect x="11.2" y="1.6" width="5" height="5" rx="1" />
  </S>
);
export const IconClock: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <circle cx="9" cy="9" r="7" />
    <path d="M9 5.2V9l2.6 1.6" />
  </S>
);
export const IconSite: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <rect x="2.2" y="2.2" width="5.4" height="5.4" rx="1.4" />
    <rect x="10.4" y="2.2" width="5.4" height="5.4" rx="2.7" />
    <rect x="2.2" y="10.4" width="5.4" height="5.4" rx="2.7" />
    <rect x="10.4" y="10.4" width="5.4" height="5.4" rx="1.4" />
  </S>
);
export const IconRemote: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <rect x="4" y="1.8" width="10" height="14.4" rx="2" />
    <path d="M7.4 6.4 10.2 9l-2.8 2.6" />
  </S>
);
export const IconPanel: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <rect x="2" y="3" width="14" height="12" rx="2.2" />
    <path d="M7 3v12" />
  </S>
);
export const IconSearch: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <circle cx="8" cy="8" r="5.2" />
    <path d="m12 12 3.6 3.6" />
  </S>
);
export const IconCloud: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <path d="M5.2 14.2a3.4 3.4 0 0 1-.4-6.8 4.6 4.6 0 0 1 8.9 1.2 2.8 2.8 0 0 1-.5 5.6Z" />
    <path d="M9 13V9.4M7.4 11 9 9.4l1.6 1.6" />
  </S>
);
export const IconFolder: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <path d="M2 5.2c0-.9.7-1.6 1.6-1.6h3.2l1.6 1.8h6c.9 0 1.6.7 1.6 1.6v6.6c0 .9-.7 1.6-1.6 1.6H3.6c-.9 0-1.6-.7-1.6-1.6Z" />
    <path d="M2 7.6h14" />
  </S>
);
export const IconLaptop: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <rect x="3.4" y="3.4" width="11.2" height="8" rx="1.2" />
    <path d="M1.6 14.4h14.8" />
  </S>
);
export const IconBell: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <path d="M4.6 12.6V8.4a4.4 4.4 0 0 1 8.8 0v4.2l1.2 1.4H3.4Z" />
    <path d="M7.4 15.6a1.8 1.8 0 0 0 3.2 0" />
  </S>
);
export const IconChevron: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <path d="m5 7 4 4 4-4" />
  </S>
);
export const IconPlus: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <path d="M9 3.4v11.2M3.4 9h11.2" />
  </S>
);
export const IconLoop: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <path d="M14.4 7.2A5.6 5.6 0 0 0 4 6.2M3.6 10.8A5.6 5.6 0 0 0 14 11.8" />
    <path d="M4 3v3.2h3.2M14 15v-3.2h-3.2" />
  </S>
);
export const IconMic: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <rect x="6.4" y="2" width="5.2" height="9" rx="2.6" />
    <path d="M3.8 8.6a5.2 5.2 0 0 0 10.4 0M9 13.8V16" />
  </S>
);
export const IconArrowUp: React.FC<{ size?: number; color?: string }> = (p) => (
  <S {...p}>
    <path d="M9 14V4.4M5 8.2 9 4.2l4 4" />
  </S>
);

// Window caption glyphs (Windows 11 style, 10px).
export const Caption: React.FC<{ kind: "min" | "max" | "close" }> = ({ kind }) => (
  <svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="#171717" strokeWidth={1}>
    {kind === "min" && <path d="M0 5.5h10" />}
    {kind === "max" && <rect x="0.5" y="0.5" width="9" height="9" />}
    {kind === "close" && <path d="M0.5 0.5l9 9M9.5 0.5l-9 9" />}
  </svg>
);
