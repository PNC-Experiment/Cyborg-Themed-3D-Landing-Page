/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from "react";
import { Activity, ShieldAlert, Zap, Thermometer, Cpu } from "lucide-react";
import { AnatomicalNode } from "../types";

interface SpecsPanelProps {
  activeNode: AnatomicalNode | null;
  selectedHotspotId: string | null;
  overallSync: number; // overall calculated sync rating
}

export default function SpecsPanel({
  activeNode,
  selectedHotspotId,
  overallSync,
}: SpecsPanelProps) {
  // We'll draw an organic-looking wave using canvas inside a small panel for live telemetry
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [powerFrequency, setPowerFrequency] = useState(60);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = 100;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw background grid lines on chart
      ctx.strokeStyle = "rgba(0, 243, 255, 0.04)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Base Wave Speed and Height variables depending on active node
      let speed = 0.05;
      let amplitude1 = 12;
      let amplitude2 = 6;
      let freq1 = 0.02;
      let freq2 = 0.04;
      let strokeColor = "rgba(0, 243, 255, 0.7)";
      let strokeColor2 = "rgba(157, 0, 255, 0.3)";

      if (activeNode) {
        if (activeNode.id === "head") {
          // Rapid high freq neural waves
          speed = 0.12;
          amplitude1 = 15;
          amplitude2 = 8;
          freq1 = 0.035;
          freq2 = 0.07;
          strokeColor = "rgba(0, 243, 255, 0.95)";
        } else if (activeNode.id === "core") {
          // Extreme high amplitude reactor surges
          speed = 0.08;
          amplitude1 = 26;
          amplitude2 = 12;
          freq1 = 0.015;
          freq2 = 0.03;
          strokeColor = "rgba(255, 140, 0, 0.9)";
          strokeColor2 = "rgba(255, 0, 0, 0.25)";
        } else if (activeNode.id === "eyes") {
          // Steady rapid spikes
          speed = 0.06;
          amplitude1 = 10;
          amplitude2 = 4;
          freq1 = 0.04;
          freq2 = 0.09;
          strokeColor = "rgba(0, 190, 255, 0.9)";
        } else if (activeNode.id === "hands") {
          // Extremely relaxed harmonic sine wave
          speed = 0.02;
          amplitude1 = 8;
          amplitude2 = 3;
          freq1 = 0.012;
          freq2 = 0.025;
          strokeColor = "rgba(0, 243, 255, 0.5)";
        }
      }

      // Draw shadow wave
      ctx.beginPath();
      ctx.strokeStyle = strokeColor2;
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x++) {
        const y =
          h / 2 +
          Math.sin(x * freq2 - t * speed * 0.7) * amplitude2 * 1.5 +
          Math.cos(x * freq1 - t * speed) * amplitude1 * 0.3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw primary glowing wave
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = strokeColor;
      for (let x = 0; x < w; x++) {
        const y =
          h / 2 +
          Math.sin(x * freq1 + t * speed) * amplitude1 +
          Math.cos(x * freq2 - t * speed * 1.2) * amplitude2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;

      t += 1;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [activeNode]);

  // Handle subtle fluctuation in decorative counters
  useEffect(() => {
    const timer = setInterval(() => {
      setPowerFrequency((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        return parseFloat(MathsClamp(prev + delta, 59.2, 61.3).toFixed(2));
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const MathsClamp = (val: number, min: number, max: number) => {
    return Math.min(Math.max(val, min), max);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Overall Core Diagnostics Glass Panel */}
      <div className="cyber-glass rounded-xl p-4 border border-cyber-border relative font-mono text-xs overflow-hidden">
        {/* Glowing corner brackets */}
        <div className="absolute top-0 left-0 w-2 h-1 bg-cyber-cyan" />
        <div className="absolute top-0 left-0 w-1 h-2 bg-cyber-cyan" />
        <div className="absolute bottom-0 right-0 w-2 h-1 bg-cyber-cyan" />
        <div className="absolute bottom-0 right-0 w-1 h-2 bg-cyber-cyan" />

        <div className="flex items-center gap-1.5 pb-2.5 border-b border-cyan-500/15 mb-3">
          <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
          <span className="font-bold tracking-widest text-[#00f3ff] uppercase">SYSTEM_INDEX</span>
        </div>

        {/* Global sync rate gauge */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-[10px] tracking-wide uppercase">OVERALL_SYNC</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-100 tracking-tight">
                {overallSync.toFixed(1)}
              </span>
              <span className="text-cyan-500 text-[10px]">%</span>
            </div>
            {/* Custom mini bar graph */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyber-cyan transition-all duration-500"
                style={{ width: `${overallSync}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-[10px] tracking-wide uppercase">CORE_HZ_STABILITY</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-100 tracking-tight">
                {powerFrequency}
              </span>
              <span className="text-purple-400 text-[10px]">GHz</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(powerFrequency - 55) * 10}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick specs matrix */}
        <div className="mt-4 pt-3 border-t border-cyan-500/10 grid grid-cols-3 gap-2 text-[10px]">
          <div className="bg-cyan-950/20 p-2 rounded border border-cyan-500/5 flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-cyan-400/80">
              <Zap className="w-3 h-3" />
              <span>POWER</span>
            </div>
            <span className="font-bold text-slate-300">
              {activeNode ? activeNode.metrics.output : "4.8 GW / hr"}
            </span>
          </div>
          <div className="bg-cyan-950/20 p-2 rounded border border-cyan-500/5 flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-amber-400/85">
              <Thermometer className="w-3 h-3" />
              <span>THERM</span>
            </div>
            <span className="font-bold text-slate-300">
              {activeNode ? `${activeNode.metrics.temp} °C` : "28.4 °C"}
            </span>
          </div>
          <div className="bg-cyan-950/20 p-2 rounded border border-cyan-500/5 flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-purple-400/85">
              <Cpu className="w-3 h-3" />
              <span>SYS LOAD</span>
            </div>
            <span className="font-bold text-slate-300">
              {activeNode ? `${activeNode.metrics.load}%` : "12.8%"}
            </span>
          </div>
        </div>
      </div>

      {/* Wave Telemetry Plot Glass Panel */}
      <div className="cyber-glass rounded-xl p-4 border border-cyber-border relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan/30" />
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/10 mb-2 font-mono">
          <div className="flex items-center gap-1 text-cyber-cyan text-xs font-bold tracking-widest uppercase">
            <span>CORE_BIOMETRY_WAVE</span>
          </div>
          <span className="text-[9px] text-[#40ff73] animate-pulse bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold tracking-tighter uppercase">
            {activeNode ? `${activeNode.id}_feed` : "idle_feed"}
          </span>
        </div>

        {/* Live Draw Wave Canvas */}
        <div className="w-full bg-[#05070a] rounded border border-cyan-500/10 overflow-hidden relative mb-2">
          <canvas ref={canvasRef} className="block w-full h-[100px]" />
          
          {/* Aesthetic Overlay Crosshair lines */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-400/5 pointer-events-none" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-400/5 pointer-events-none" />
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 select-none">
          <span>SIGNAL_SYNC: {activeNode ? `${activeNode.metrics.syncRate}%` : "100.0%"}</span>
          <span>RANGE_AMP: +/-40mv</span>
        </div>
      </div>

      {/* Active Selection Details Segment */}
      {activeNode && (
        <div className="cyber-glass rounded-xl p-4 border border-cyan-500/30 bg-cyan-950/10 relative transition-all duration-300">
          <div className="absolute top-0 left-0 w-2 h-2 bg-cyber-cyan" />
          <h4 className="text-xs font-mono font-bold tracking-widest text-cyber-cyan uppercase mb-2">
            Inspect: {activeNode.title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3 text-justify">
            {activeNode.tagline}
          </p>

          <div className="flex flex-col gap-2 font-mono text-[11px]">
            {activeNode.details.map((det, index) => (
              <div
                key={index}
                className="p-2 rounded bg-slate-900/60 border border-slate-800 flex flex-col gap-0.5"
              >
                <div className="flex justify-between items-center text-cyan-400 font-bold">
                  <span>{det.label}</span>
                  <span className="text-slate-200">{det.value}</span>
                </div>
                <span className="text-slate-400 text-[10px] leading-snug">
                  {det.description}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-cyan-500/10 flex justify-between items-center font-mono text-[10px] text-slate-500">
            <span>FIRMWARE: VER_8.42</span>
            <span className="text-cyber-cyan">OVERCLOCK PROTECT [ON]</span>
          </div>
        </div>
      )}

      {/* Warning Box overlay when state fluctuates */}
      {!activeNode && (
        <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-xl flex items-center gap-3 p-3 text-slate-400 select-none">
          <ShieldAlert className="w-5 h-5 text-cyan-500 shrink-0" />
          <div className="flex flex-col font-mono text-[10px]">
            <span className="text-slate-300 font-bold">NODE DIAGNOSTICS IDLE</span>
            <span>Select any of the blinking green hotspots on the cyborg profile skeleton to open and inspect that biomechanical segment.</span>
          </div>
        </div>
      )}
    </div>
  );
}
