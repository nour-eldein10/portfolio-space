import React from "react";
import { Particles } from "./particles";

export function GalaxyButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center justify-center gap-3 rounded-full px-6 py-2.5 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(120,230,255,0.5)] border border-[color:var(--neon)]/50"
    >
      {/* Galaxy Gradient Background */}
      <span className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#020617] opacity-100 transition-opacity duration-500" />

      {/* Moving Stars via Particles component */}
      <Particles
        className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        density={0.002}
        color="rgba(120, 230, 255, 0.9)"
      />
      <Particles
        className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-500"
        density={0.001}
        color="rgba(180, 83, 9, 0.9)"
      />

      <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--neon)]/10 to-[color:var(--amber)]/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Glow on hover */}
      <span className="absolute inset-0 shadow-[inset_0_0_20px_rgba(120,230,255,0.4)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <span
        className="relative z-10 flex items-center gap-2 font-display font-medium text-sm tracking-tight text-white transition-all duration-300 group-hover:text-[color:var(--neon)]"
        style={{ textShadow: "0 0 10px rgba(120,230,255,0.4)" }}
      >
        <span className="inline-block animate-pulse">✨</span>
        {children}
        <span className="inline-block animate-pulse" style={{ animationDelay: "1s" }}>✨</span>
      </span>
    </a>
  );
}
