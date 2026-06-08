/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, ShieldCheck, Snowflake, Activity, Volume2, VolumeX, AlertOctagon } from "lucide-react";
import { AnatomicalNode, StatusType } from "../types";

interface SubsystemTunerProps {
  activeNode: AnatomicalNode | null;
  onTuningAction: (
    type: "overclock" | "stabilize" | "realign",
    adjustments: { tempDelta: number; syncDelta: number; loadDelta: number }
  ) => void;
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
}

export default function SubsystemTuner({
  activeNode,
  onTuningAction,
  audioEnabled,
  setAudioEnabled,
}: SubsystemTunerProps) {

  const handleTune = (action: "overclock" | "stabilize" | "realign") => {
    if (!activeNode) return;

    let tempDelta = 0;
    let syncDelta = 0;
    let loadDelta = 0;

    switch (action) {
      case "overclock":
        tempDelta = Math.random() * 8 + 4; // heats up
        syncDelta = Math.random() * 2 + 0.5; // improves sync slightly or can overheat
        loadDelta = Math.random() * 15 + 10; // substantial load increase
        break;
      case "stabilize":
        tempDelta = -(Math.random() * 6 + 3); // cools down
        syncDelta = -(Math.random() * 1 + 0.2); // drops down a tiny bit
        loadDelta = -(Math.random() * 12 + 8); // substantial drop
        break;
      case "realign":
        tempDelta = (Math.random() - 0.5) * 2; // neutral
        syncDelta = Math.random() * 3 + 1; // boosts sync
        loadDelta = -2;
        break;
    }

    onTuningAction(action, { tempDelta, syncDelta, loadDelta });
  };

  // Safe checks for coloring
  const isOverheating = activeNode ? activeNode.metrics.temp > 75 : false;
  const isOptimal = activeNode ? activeNode.metrics.syncRate >= 99 : false;

  return (
    <div className="cyber-glass rounded-xl p-4 border border-cyber-border font-mono text-xs relative flex flex-col justify-between h-full select-none">
      {/* Decors */}
      <div className="absolute top-0 right-4 w-4 h-[1px] bg-cyber-cyan" />
      <div className="absolute bottom-4 left-0 w-[1px] h-4 bg-cyber-cyan" />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/10 mb-3">
          <div className="flex items-center gap-1.5 text-cyber-cyan font-bold tracking-widest uppercase">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>BIOSYSTEMS_TUNER</span>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            id="btn-toggle-audio"
            className="p-1 rounded bg-slate-900 border border-cyan-500/15 hover:bg-cyan-950/20 text-slate-400 hover:text-cyber-cyan transition-colors cursor-pointer"
            title={audioEnabled ? "Disable acoustic resonance clicks" : "Enable acoustic resonance clicks"}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Dynamic warning system */}
        {activeNode && isOverheating && (
          <div className="mb-3 p-2 bg-red-950/30 border border-red-500/30 rounded text-[10px] text-red-400 flex items-center gap-2 animate-pulse font-sans">
            <AlertOctagon className="w-4 h-4 text-red-500 shrink-0" />
            <div>
              <span className="font-bold block uppercase font-mono tracking-wider">CRITICAL OVERTEMPERATURE</span>
              <span>Subsystem thermal limits approaching warning thresholds. Engagement of CRYO-COOLING required.</span>
            </div>
          </div>
        )}

        {/* Active Node spec panel overview */}
        {activeNode ? (
          <div className="flex flex-col gap-2.5 mb-4">
            <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase">
              <span>ACTIVE_TARGET</span>
              <span className="text-cyber-cyan font-bold">{activeNode.id}</span>
            </div>
            
            {/* Displaying Live stats */}
            <div className="grid grid-cols-2 gap-2 bg-[#05070a]/60 p-2.5 rounded border border-cyan-500/5">
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 text-[9px] uppercase tracking-wide">Sync Ratio</span>
                <span className={`text-sm font-bold tracking-tight ${isOptimal ? "text-emerald-400" : "text-slate-100"}`}>
                  {activeNode.metrics.syncRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-500 text-[9px] uppercase tracking-wide">Reactor Temp</span>
                <span className={`text-sm font-bold tracking-tight ${isOverheating ? "text-red-400 font-semibold" : "text-slate-100"}`}>
                  {activeNode.metrics.temp.toFixed(1)}°C
                </span>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2 pt-1 border-t border-cyan-500/5 mt-1">
                <span className="text-slate-500 text-[9px] uppercase tracking-wide">Mechanical Load</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">{activeNode.metrics.load.toFixed(1)}%</span>
                  {/* Slider simulation representation */}
                  <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-300" 
                      style={{ width: `${activeNode.metrics.load}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tuning buttons */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-slate-500 text-[9px] tracking-wide uppercase select-none">
                MANUAL OPERATING PROTOCOLS
              </span>
              
              {/* Overclock */}
              <button
                onClick={() => handleTune("overclock")}
                id="btn-tune-overclock"
                className="w-full flex items-center justify-between px-3 py-2 rounded border border-amber-500/20 bg-amber-950/20 hover:bg-amber-900/40 text-amber-300 hover:text-amber-100 font-mono text-[11px] font-bold tracking-wider transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>OVERCLOCK MOTOR GRID</span>
                </div>
                <span>+ LOAD / + TEMP</span>
              </button>

              {/* Stabilize */}
              <button
                onClick={() => handleTune("stabilize")}
                id="btn-tune-stabilize"
                className="w-full flex items-center justify-between px-3 py-2 rounded border border-blue-500/20 bg-blue-950/20 hover:bg-blue-900/40 text-blue-300 hover:text-blue-100 font-mono text-[11px] font-bold tracking-wider transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>ENGAGE CRYOGENIC REEL</span>
                </div>
                <span>- TEMP / - LOAD</span>
              </button>

              {/* Realign */}
              <button
                onClick={() => handleTune("realign")}
                id="btn-tune-realign"
                className="w-full flex items-center justify-between px-3 py-2 rounded border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-900/40 text-emerald-300 hover:text-emerald-100 font-mono text-[11px] font-bold tracking-wider transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ALIGN NEURAL SYMMETRY</span>
                </div>
                <span>+ SYNC RATE</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center py-8 select-none font-sans">
            <span className="mb-1 font-mono font-bold text-slate-600 uppercase tracking-widest">[ TUNING PORT DEAD ]</span>
            <span>Connect a subsystem first by clicking modular details on the left layout viewport to open telemetry access pipelines.</span>
          </div>
        )}
      </div>

      {/* Decorative calibration parameters */}
      <div className="mt-4 pt-3 border-t border-cyan-500/10 text-[9px] text-slate-500 select-none">
        <div className="flex justify-between items-center mb-1">
          <span>COGNITIVE RESONANCE RATIO:</span>
          <span className="text-slate-300 font-bold">1:1 GOLDEN MATCH</span>
        </div>
        <div className="flex justify-between items-center">
          <span>HARDWARE STABILIZATIONS:</span>
          <span className="text-slate-300 font-bold">OPTIMAL SYMMETRY</span>
        </div>
      </div>
    </div>
  );
}
