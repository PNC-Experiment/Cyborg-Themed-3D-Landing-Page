/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Locate, Compass, RefreshCw, HelpCircle, AlertTriangle } from "lucide-react";
import { AnatomicalNode, SubsystemHotspot } from "../types";
import { MAIN_CYBORG_IMAGE } from "../data";

interface CyborgViewerProps {
  nodes: AnatomicalNode[];
  activeNode: AnatomicalNode | null;
  setActiveNode: (node: AnatomicalNode | null) => void;
  selectedHotspotId: string | null;
  setSelectedHotspotId: (id: string | null) => void;
  onLogMessage: (source: string, msg: string, type: "info" | "success" | "warn" | "critical") => void;
}

export default function CyborgViewer({
  nodes,
  activeNode,
  setActiveNode,
  selectedHotspotId,
  setSelectedHotspotId,
  onLogMessage,
}: CyborgViewerProps) {
  const [hoveredNode, setHoveredNode] = useState<AnatomicalNode | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<SubsystemHotspot | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const handleNodeClick = (node: AnatomicalNode) => {
    setIsOpening(true);
    setSelectedHotspotId(null);
    setActiveNode(node);
    onLogMessage(
      node.title.toUpperCase(),
      `Initiating deep scan... Subsystem aperture opening.`,
      "info"
    );

    // After animation delay, trigger logs
    setTimeout(() => {
      setIsOpening(false);
      onLogMessage(
        node.title.toUpperCase(),
        `Mechanical latch-locks separated. Internal components exposed.`,
        "success"
      );
    }, 1200);
  };

  const handleBack = () => {
    if (activeNode) {
      onLogMessage(
        "CORE_SYSTEM",
        `Retracting diagnostic camera. Sealing modular shell of ${activeNode.title}.`,
        "info"
      );
    }
    setSelectedHotspotId(null);
    setActiveNode(null);
  };

  const handleHotspotClick = (hs: SubsystemHotspot) => {
    setSelectedHotspotId(hs.id);
    onLogMessage(
      activeNode?.title.toUpperCase() || "SUB_ELEMENT",
      `Hotspot selected: ${hs.label}. Operating status: ${hs.status.toUpperCase()} (${hs.statLabel}: ${hs.statValue}).`,
      hs.status === "overclocked" ? "warn" : "success"
    );
  };

  return (
    <div className="w-full h-full flex flex-col relative select-none">
      {/* Outer Panel header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-cyan-500/10 mb-4 bg-slate-950/20 rounded-lg select-none">
        <div className="flex items-center gap-2">
          {activeNode ? (
            <button
              onClick={handleBack}
              id="btn-back-main"
              className="px-2.5 py-1 text-xs font-mono font-bold text-cyber-cyan hover:text-[#fff] bg-cyan-950/40 hover:bg-cyan-900/60 transition-all border border-cyan-500/35 rounded flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO MAIN</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="font-bold tracking-widest uppercase">TACTICAL PHYSICAL SCHEMATIC</span>
            </div>
          )}
        </div>

        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-3">
          <span className="hidden md:inline">CAMERA: AUTOFOCUS [SYS]</span>
          <span className="text-cyan-500 animate-pulse font-bold">● ONLINE</span>
        </div>
      </div>

      {/* Primary viewport stage */}
      <div className="flex-1 min-h-[900px] md:min-h-[1050px] bg-slate-950/15 rounded-xl border border-cyan-500/5 overflow-hidden relative flex items-center justify-center">
        
        {/* Decorative HUD framing overlays inside viewer */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-500/30" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-500/30" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-500/30" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-500/30" />

        {/* Dynamic crosshair indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-48 h-48 rounded-full border border-dashed border-cyan-500 relative flex items-center justify-center animate-spin" style={{ animationDuration: "35s" }}>
            <div className="w-44 h-44 rounded-full border border-dotted border-cyber-cyan" />
          </div>
          <Locate className="w-5 h-5 absolute text-cyber-cyan animate-pulse" />
        </div>

        <AnimatePresence mode="wait">
          {!activeNode ? (
            /* ======================================================== */
            /* VIEW 1: FULL HUMANOID IN NAMASTE POSTURE                */
            /* ======================================================== */
            <motion.div
              key="main-cyborg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              {/* Image Frame */}
              <div className="relative h-full max-h-[1050px] aspect-square flex items-center justify-center select-none bg-[#050608] rounded-2xl border border-slate-900 overflow-hidden shadow-2xl">
                <img
                  src={MAIN_CYBORG_IMAGE}
                  alt="Cyber-Evo Medical standing Humanoid Cyborg with advanced brain architecture"
                  className="w-full h-full object-cover brightness-105 contrast-[1.02] opacity-90 transition-opacity"
                  referrerPolicy="no-referrer"
                />

                {/* Hotspot Indicators representing modular joints */}
                {nodes.map((node) => {
                  const isHovered = hoveredNode?.id === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleNodeClick(node)}
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className="absolute group z-10 cursor-pointer focus:outline-none"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      {/* Interactive ring animations */}
                      <span className="relative flex h-8 w-8 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan/30 opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-slate-900 border-2 border-cyber-cyan items-center justify-center group-hover:border-[#fff] group-hover:scale-125 transition-transform duration-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan group-hover:bg-[#fff]" />
                        </span>
                      </span>

                      {/* Floating tooltip indicating subsystem name */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 -top-11 transition-all duration-300 pointer-events-none ${
                          isHovered 
                            ? "opacity-100 translate-y-0 scale-100" 
                            : "opacity-0 translate-y-1 scale-95"
                        }`}
                      >
                        <div className="cyber-glass text-[10px] font-mono border-cyan-400 py-1 px-2 rounded whitespace-nowrap text-[#fff] tracking-wide flex items-center gap-1">
                          <span className="text-cyber-cyan font-bold">{">"}</span>
                          <span>{node.title}</span>
                          <span className="text-slate-500 font-normal">[{node.metrics.syncRate}%]</span>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Technical stats overlay in the corners */}
                <div className="absolute top-3 left-3 flex flex-col font-mono text-[9px] text-[#00f3ff]/60 leading-normal bg-slate-950/60 p-2 rounded border border-cyber-border/40 select-none">
                  <span>BIO_CHASSIS: CR-X</span>
                  <span>SYNC_RATIO: DYNAMIC</span>
                  <span>ORIENTATION: PRAYER</span>
                </div>

                <div className="absolute bottom-3 right-3 flex flex-col font-mono text-[9px] text-right text-slate-500 select-none">
                  <span>LATENCY: 0.04 MS</span>
                  <span>POSTURE: SYMMETRICAL</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ======================================================== */
            /* VIEW 2: DETAILED NODE VIEW (OPENING BIOPHYSICAL CASING)  */
            /* ======================================================== */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-4 overflow-hidden"
            >
              <div className="relative w-full max-w-[950px] aspect-square flex items-center justify-center select-none bg-black/50 rounded-2xl border border-slate-900 overflow-hidden shadow-2xl">
                
                {/* Exposed Internal Detailed Image */}
                <img
                  src={activeNode.primaryImage}
                  alt={`${activeNode.title} interior detailed system cross section`}
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />

                {/* Interactive Hotspots within the open subsystem */}
                {activeNode.hotspots.map((hs) => {
                  const isSelected = selectedHotspotId === hs.id;
                  const isHovered = hoveredHotspot?.id === hs.id;
                  
                  // Status border color
                  const statBorderColor = hs.status === "overclocked"
                    ? "border-amber-400 text-amber-300"
                    : hs.status === "warning"
                      ? "border-red-500 text-red-400"
                      : "border-cyber-cyan text-cyber-cyan";

                  const pulseDotColor = hs.status === "overclocked"
                    ? "bg-amber-400"
                    : hs.status === "warning"
                      ? "bg-red-500"
                      : "bg-cyber-cyan";

                  return (
                    <div
                      key={hs.id}
                      className="absolute z-20"
                      style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                    >
                      {/* Micro glowing pulsing node */}
                      <button
                        onClick={() => handleHotspotClick(hs)}
                        onMouseEnter={() => setHoveredHotspot(hs)}
                        onMouseLeave={() => setHoveredHotspot(null)}
                        className="relative flex h-8 w-8 items-center justify-center cursor-pointer focus:outline-none"
                      >
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${hs.status === "overclocked" ? "bg-amber-400/20" : "bg-cyber-cyan/30"}`} />
                        <span className={`relative inline-flex rounded-full h-3 border-2 items-center justify-center ${isSelected ? "w-5 h-5 bg-[#fff]" : "w-3 h-3 bg-slate-950"} ${statBorderColor} hover:scale-125 transition-transform duration-200`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-slate-950" : pulseDotColor}`} />
                        </span>
                      </button>

                      {/* Hotspot Floating info pill (shows on Hover OR Click for full detail) */}
                      <AnimatePresence>
                        {(isHovered || isSelected) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className={`absolute left-1/2 -translate-x-1/2 bottom-10 z-30 transition-all font-mono pointer-events-none shrink-0 ${
                              isSelected ? "w-64" : "w-48"
                            }`}
                          >
                            <div className="cyber-glass p-2.5 rounded-lg border-cyan-400 text-xs shadow-2xl flex flex-col gap-1.5 backdrop-blur-md select-text">
                              <div className="flex justify-between items-center pb-1 border-b border-cyan-500/10">
                                <span className="font-bold text-[#fff] tracking-wide text-[10px] select-none truncate">
                                  {hs.label}
                                </span>
                                <span className={`text-[8px] font-semibold px-1 py-0.5 rounded border uppercase shrink-0 ${
                                  hs.status === "overclocked" 
                                    ? "bg-amber-950/50 border-amber-500/30 text-amber-400"
                                    : "bg-cyan-950/50 border-cyan-500/30 text-cyber-cyan"
                                }`}>
                                  {hs.status}
                                </span>
                              </div>
                              <p className="text-[10px] leading-relaxed text-slate-300 font-sans">
                                {hs.description}
                              </p>
                              <div className="flex justify-between items-center pt-1 border-t border-cyan-500/5 text-[9px]">
                                <span className="text-slate-500">{hs.statLabel}:</span>
                                <span className="text-cyber-cyan font-bold">{hs.statValue}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Horizontal Sliding Plates Overlays (Open-Up mechanism effect) */}
                <AnimatePresence>
                  {isOpening && (
                    <>
                      {/* Left biomechanical composite heavy armor shell */}
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-100%" }}
                        exit={{ x: 0 }}
                        transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
                        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#171c26] to-[#0c0f14] border-r border-cyber-cyan/35 z-10 p-4 flex flex-col justify-between"
                      >
                        <div className="text-[9px] font-mono text-cyan-500/60 leading-normal select-none">
                          <span>MODULE SECURITY ARMOR</span>
                          <div className="text-slate-600">PLATE ID_L45A</div>
                        </div>
                        
                        {/* Shutter visual designs */}
                        <div className="my-auto self-end w-8 h-8 rounded border border-cyan-400/20 mr-2 flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 text-cyan-400/30 animate-spin" style={{ animationDuration: "3s" }} />
                        </div>

                        <div className="text-[8px] font-mono text-slate-700 select-none">
                          <span>SYS_SEAL: SECURE</span>
                        </div>
                      </motion.div>

                      {/* Right biomechanical composite heavy armor shell */}
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "100%" }}
                        exit={{ x: 0 }}
                        transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
                        className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#171c26] to-[#0c0f14] border-l border-cyber-cyan/35 z-10 p-4 flex flex-col justify-between items-end"
                      >
                        <div className="text-[9px] font-mono text-cyan-500/60 leading-normal text-right select-none">
                          <span>BIO_LOCK ACTUATORS</span>
                          <div className="text-slate-600">PLATE ID_R45B</div>
                        </div>

                        {/* Shutter visual designs */}
                        <div className="my-auto self-start w-8 h-8 rounded border border-cyan-400/20 ml-2 flex items-center justify-center">
                          <Locate className="w-4 h-4 text-cyan-400/30" />
                        </div>

                        <div className="text-[8px] font-mono text-slate-700 select-none">
                          <span>SLIDE_LOCK [OPENING]</span>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Subsystem spec watermarks */}
                <div className="absolute top-4 left-4 flex flex-col font-mono text-[9px] text-cyan-400/40 select-none">
                  <span>CAMERA_LENS_RATIO: 1:1</span>
                  <span>ZOOM_LVL: DEPTH_8.5X</span>
                </div>

                {/* Tactical helper note overlay */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 px-3 py-1.5 rounded-full border border-cyan-500/10 font-mono text-[9px] text-slate-400 select-none tracking-wider whitespace-nowrap flex items-center gap-1.5 shadow-xl">
                  <HelpCircle className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Click and hover details spots inside</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Subsystem Quick Tabs for easy selector clicking */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 font-mono select-none">
        {nodes.map((node) => {
          const isActive = activeNode?.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => handleNodeClick(node)}
              id={`tab-select-${node.id}`}
              className={`px-3 py-2.5 rounded-lg border text-xs text-left flex flex-col gap-0.5 hover:bg-cyan-900/10 transition-all cursor-pointer ${
                isActive
                  ? "border-[#00f3ff] bg-cyan-950/20 text-[#fff] shadow-[0_0_15px_rgba(0,243,255,0.1)] font-bold"
                  : "border-cyan-500/10 bg-slate-900/40 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[9px] text-slate-500 uppercase">SYS_NODE</span>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-cyber-cyan animate-pulse" : "bg-slate-700"}`} />
              </div>
              <span className="truncate">{node.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
