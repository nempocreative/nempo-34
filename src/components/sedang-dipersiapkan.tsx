import React, { useEffect, useRef } from "react";
import { Link } from "@/lib/wouter";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  iconGradient: string;
  dotColor1: string;
  dotColor2: string;
  title: string;
  titleHighlight: string;
  description: string;
  btn1Label: string;
  btn1Href: string;
  btn2Label: string;
  btn2Href: string;
}

const ORBIT_KEYFRAMES = `
@keyframes orbit1 {
  from { transform: rotate(0deg)   translateX(56px)  rotate(0deg); }
  to   { transform: rotate(360deg) translateX(56px)  rotate(-360deg); }
}
@keyframes orbit2 {
  from { transform: rotate(120deg) translateX(74px)  rotate(-120deg); }
  to   { transform: rotate(480deg) translateX(74px)  rotate(-480deg); }
}
@keyframes orbit3 {
  from { transform: rotate(240deg) translateX(44px)  rotate(-240deg); }
  to   { transform: rotate(600deg) translateX(44px)  rotate(-600deg); }
}
@keyframes orbit4 {
  from { transform: rotate(60deg)  translateX(90px) rotate(-60deg); }
  to   { transform: rotate(420deg) translateX(90px) rotate(-420deg); }
}
@keyframes orbit5 {
  from { transform: rotate(300deg) translateX(63px)  rotate(-300deg); }
  to   { transform: rotate(660deg) translateX(63px)  rotate(-660deg); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.25); }
  50%       { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
}
@keyframes float-icon {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
`;

export function SedangDipersiapkan({
  icon: Icon,
  iconGradient,
  dotColor1,
  dotColor2,
  title,
  titleHighlight,
  description,
  btn1Label,
  btn1Href,
  btn2Label,
  btn2Href,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 pt-10 pb-32 text-center">
      <style>{ORBIT_KEYFRAMES}</style>

      {/* ── Icon dengan orbit circles ── */}
      <div className="relative mb-6 md:mb-12 flex items-center justify-center" style={{ width: 200, height: 200 }}>

        {/* Outer glow ring */}
        <div className="absolute rounded-full opacity-10"
          style={{ width: 170, height: 170, background: iconGradient, filter: "blur(20px)" }} />

        {/* Orbit track rings (faint) */}
        <div className="absolute rounded-full border border-dashed opacity-15"
          style={{ width: 150, height: 150, borderColor: dotColor2 }} />
        <div className="absolute rounded-full border border-dashed opacity-10"
          style={{ width: 185, height: 185, borderColor: dotColor1 }} />

        {/* ── Orbiting dots ── */}
        {/* Dot 1 — small, fast, dotColor2 */}
        <span className="absolute rounded-full"
          style={{
            width: 8, height: 8, top: "50%", left: "50%",
            marginTop: -4, marginLeft: -4,
            background: dotColor2,
            animation: "orbit1 4.5s linear infinite",
            boxShadow: `0 0 6px 2px ${dotColor2}88`,
          }} />

        {/* Dot 2 — medium, slow, dotColor1 */}
        <span className="absolute rounded-full"
          style={{
            width: 6, height: 6, top: "50%", left: "50%",
            marginTop: -3, marginLeft: -3,
            background: dotColor1,
            animation: "orbit2 7s linear infinite",
            boxShadow: `0 0 5px 2px ${dotColor1}88`,
          }} />

        {/* Dot 3 — tiny, very fast, white */}
        <span className="absolute rounded-full"
          style={{
            width: 4, height: 4, top: "50%", left: "50%",
            marginTop: -2, marginLeft: -2,
            background: "#ffffff",
            animation: "orbit3 3s linear infinite",
            opacity: 0.8,
          }} />

        {/* Dot 4 — medium, outer ring, dotColor2 */}
        <span className="absolute rounded-full"
          style={{
            width: 7, height: 7, top: "50%", left: "50%",
            marginTop: -3.5, marginLeft: -3.5,
            background: dotColor2,
            animation: "orbit4 10s linear infinite",
            boxShadow: `0 0 4px 2px ${dotColor2}66`,
          }} />

        {/* Dot 5 — small, medium speed */}
        <span className="absolute rounded-full"
          style={{
            width: 5, height: 5, top: "50%", left: "50%",
            marginTop: -2.5, marginLeft: -2.5,
            background: dotColor1,
            animation: "orbit5 6s linear infinite",
            opacity: 0.9,
          }} />

        {/* ── Main Icon Card (floats up/down) ── */}
        <div
          className="relative z-10 h-[100px] w-[100px] rounded-[2rem] flex items-center justify-center shadow-2xl"
          style={{
            background: iconGradient,
            animation: "float-icon 3s ease-in-out infinite",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.15) inset",
          }}
        >
          <Icon className="h-12 w-12 text-white" strokeWidth={1.5} />
        </div>
      </div>

      {/* ── Heading ── */}
      <h1 className="text-2xl md:text-3xl font-black leading-tight text-gray-900 max-w-xs md:max-w-sm">
        {title}
        <br />
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: iconGradient }}>
          {titleHighlight}
        </span>
      </h1>

      {/* ── Description ── */}
      <p className="mt-4 max-w-[280px] md:max-w-sm text-sm md:text-base text-gray-500 leading-relaxed">
        {description}
      </p>

      {/* ── Progress bar dekoratif ── */}
      <div className="mt-7 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full w-2/3 rounded-full animate-pulse"
          style={{ background: iconGradient }} />
      </div>
      <p className="mt-2 text-[10px] text-gray-400 font-medium">Sedang dalam pengembangan...</p>

      {/* ── CTA Buttons ── */}
      <div className="mt-10 w-full max-w-xs">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
          Sementara itu
        </p>

        <div className="flex flex-col gap-3.5">
          <Link href={btn1Href}>
            <button
              className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ background: iconGradient, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
            >
              <span>{btn1Label}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>

          <Link href={btn2Href}>
            <button className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]">
              <span>{btn2Label}</span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
