/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  Thermometer,
  Radio,
  Cpu,
  RotateCcw,
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
  Atom,
  Database,
  Lightbulb,
  ExternalLink,
  Bot
} from "lucide-react";
import { ANATOMICAL_DATA, INITIAL_DIAGNOSTICS_LOGS } from "./data";
import { AnatomicalNode, DiagnosticsLog } from "./types";

// Import Custom Components
import BackgroundGrid from "./components/BackgroundGrid";
import SpecsPanel from "./components/SpecsPanel";
import CyborgViewer from "./components/CyborgViewer";
import SubsystemTuner from "./components/SubsystemTuner";
import TerminalLogs from "./components/TerminalLogs";

export default function App() {
  const [nodes, setNodes] = useState<AnatomicalNode[]>(ANATOMICAL_DATA);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [logs, setLogs] = useState<DiagnosticsLog[]>(INITIAL_DIAGNOSTICS_LOGS);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  // Interactive UI trigger states
  const [activeTab, setActiveTab] = useState("overview"); // navigation accent
  const [activePricingPeriod, setActivePricingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selectedPricingPlan, setSelectedPricingPlan] = useState<string | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Keep digital clock sync
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute calculated overall state metrics
  const activeNode = nodes.find((n) => n.id === activeNodeId) || null;
  const overallSync = nodes.length > 0
    ? nodes.reduce((acc, n) => acc + n.metrics.syncRate, 0) / nodes.length
    : 100;

  const totalPowerGW = nodes.reduce((acc, n) => {
    const num = parseFloat(n.metrics.output);
    return acc + (isNaN(num) ? 5.0 : num);
  }, 0).toFixed(1);

  // Sound Synthesizer via Web Audio API (Hardware synthesized - no external file load needed)
  const playBeep = (freq = 800, type: OscillatorType = "sine", duration = 0.08, sweepFreq?: number) => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (sweepFreq) {
        osc.frequency.exponentialRampToValueAtTime(sweepFreq, ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (err) {
      // safe fallback for browser constraints
    }
  };

  // Sound click helper
  const handleActionClick = () => {
    playBeep(980, "sine", 0.05);
  };

  // Scroll Helper
  const scrollToSection = (id: string) => {
    handleActionClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Node selecting wrapper
  const handleSetActiveNode = (node: AnatomicalNode | null) => {
    if (node) {
      playBeep(440, "sine", 0.15, 880); // upward sweep
      setActiveNodeId(node.id);
    } else {
      playBeep(660, "sine", 0.12, 330); // downward sweep
      setActiveNodeId(null);
    }
  };

  // Hotspot selecting wrapper
  const handleSetSelectedHotspotId = (id: string | null) => {
    if (id) {
      playBeep(880, "triangle", 0.08);
    }
    setSelectedHotspotId(id);
  };

  // Custom log push function
  const handleAddLog = (
    source: string,
    message: string,
    type: DiagnosticsLog["type"] = "info"
  ) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const newLog: DiagnosticsLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      source,
      message,
      type,
    };
    setLogs((prev) => [...prev.slice(-49), newLog]); // Keep max 50 logs buffer
  };

  // Tuning parameter handler
  const handleTuningAction = (
    action: "overclock" | "stabilize" | "realign",
    adjustments: { tempDelta: number; syncDelta: number; loadDelta: number }
  ) => {
    if (!activeNodeId) return;

    if (action === "overclock") {
      playBeep(350, "sawtooth", 0.35, 1200); // supercharged heavy buzz
    } else if (action === "stabilize") {
      playBeep(800, "sine", 0.4, 200); // smooth cooling down sweep
    } else {
      playBeep(520, "triangle", 0.2, 520); // clean realign impulse note
    }

    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        if (n.id !== activeNodeId) return n;

        const newTemp = Math.max(20, Math.min(110, n.metrics.temp + adjustments.tempDelta));
        const newSync = Math.max(50, Math.min(100, n.metrics.syncRate + adjustments.syncDelta));
        const newLoad = Math.max(1, Math.min(100, n.metrics.load + adjustments.loadDelta));

        return {
          ...n,
          metrics: {
            ...n.metrics,
            temp: parseFloat(newTemp.toFixed(1)),
            syncRate: parseFloat(newSync.toFixed(2)),
            load: parseFloat(newLoad.toFixed(1)),
          },
        };
      })
    );

    const nodeLabel = activeNode?.title.toUpperCase() || "SUBNODE";
    if (action === "overclock") {
      handleAddLog(
        nodeLabel,
        `Tuner hyper-drive pulse deployed. Output increased. Thermal load spiked: +${adjustments.tempDelta.toFixed(1)}°C.`,
        "warn"
      );
    } else if (action === "stabilize") {
      handleAddLog(
        nodeLabel,
        `Cryogenic coolant valves open. Absorbing active heat dump. Thermals reduced: ${adjustments.tempDelta.toFixed(1)}°C.`,
        "success"
      );
    } else {
      handleAddLog(
        nodeLabel,
        `Pulsed calibration wave aligned sub-channels. Synchronization score improved: +${adjustments.syncDelta.toFixed(2)}%.`,
        "success"
      );
    }
  };

  // Simulate a whole system diagnostic test (Inject random error/telemetry)
  const handleRandomDiagnostic = () => {
    playBeep(900, "sine", 0.1);
    setTimeout(() => playBeep(1100, "sine", 0.1), 100);

    const randomMessages = [
      { src: "SOL-REACTOR", msg: "Magnetic pressure balance readjusted. Helium conduits safe.", type: "success" as const },
      { src: "CORTEX NX-9", msg: "Quantum buffer packet synchronization corrected proactively.", type: "info" as const },
      { src: "OPTIC MATRIX", msg: "Shutter blades recalibrated. Color range target set.", type: "info" as const },
      { src: "ACTUATORS", msg: "Equilibrium drift warning registered. Initiating minor joints correction.", type: "warn" as const },
      { src: "CHASSIS MATRIX", msg: "Active nano-graphene shield report: 98.4% capacity remaining.", type: "success" as const },
    ];

    const chosen = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    handleAddLog(chosen.src, chosen.msg, chosen.type);
  };

  // Reset all systems to standard default state
  const handleResetTelemetry = () => {
    playBeep(300, "triangle", 0.4);
    setNodes(ANATOMICAL_DATA);
    setLogs(INITIAL_DIAGNOSTICS_LOGS);
    handleAddLog("CORE_SECURITY", "System wide hard restore executed. Calibration metrics set back to baseline.", "critical");
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans bg-[#050608] overflow-x-hidden select-none pb-24">
      {/* Immersive technical scanning grid lines and glowing backdrops */}
      <BackgroundGrid />

      {/* ======================================================== */}
      {/* 1. CYBER NAVIGATION HEADER                               */}
      {/* ======================================================== */}
      <nav className="h-16 flex items-center justify-between px-6 md:px-10 border-b border-white/10 bg-[#050608]/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="flex items-center gap-3">
          {/* Cyan Rotate Diamond logo mimicking the pre-order mockup layout */}
          <div className="w-8 h-8 bg-[#00f3ff] rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            <div className="w-4 h-4 bg-[#050608] rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#00f3ff] rounded-full" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.2em] text-white">CYBER-EVO</span>
            <span className="text-[8px] font-mono tracking-widest text-[#00f3ff]/60 -mt-0.5">NX_PLATFORM</span>
          </div>
        </div>

        {/* Anchor Links with high-contrast text */}
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest font-medium text-gray-400">
          <button
            onClick={() => { setActiveTab("overview"); scrollToSection("overview"); }}
            className={`cursor-pointer hover:text-white transition-colors py-1 ${activeTab === "overview" ? "text-[#00f3ff] border-b-2 border-[#00f3ff]" : ""}`}
          >
            Overview
          </button>
          <button
            onClick={() => { setActiveTab("subsystems"); scrollToSection("subsystems"); }}
            className={`cursor-pointer hover:text-white transition-colors py-1 ${activeTab === "subsystems" ? "text-[#00f3ff] border-b-2 border-[#00f3ff]" : ""}`}
          >
            Anatomy
          </button>
          <button
            onClick={() => { setActiveTab("architecture"); scrollToSection("architecture"); }}
            className={`cursor-pointer hover:text-white transition-colors py-1 ${activeTab === "architecture" ? "text-[#00f3ff] border-b-2 border-[#00f3ff]" : ""}`}
          >
            Architecture
          </button>
          <button
            onClick={() => { setActiveTab("pricing"); scrollToSection("pricing"); }}
            className={`cursor-pointer hover:text-white transition-colors py-1 ${activeTab === "pricing" ? "text-[#00f3ff] border-[#00f3ff] border-b-2" : ""}`}
          >
            Pricing
          </button>
          <button
            onClick={() => { handleActionClick(); setIsDemoModalOpen(true); }}
            className="hover:text-white cursor-pointer border border-[#00f3ff]/50 px-4 py-1 -mt-1 rounded hover:bg-[#00f3ff]/15 transition-all text-white"
          >
            Join Evolution
          </button>
        </div>

        {/* Hard Reboot trigger and SSL node signal */}
        <div className="flex items-center gap-4 text-right">
          <div className="hidden lg:flex flex-col items-end font-mono">
            <span className="text-[10px] text-white font-bold tracking-wider tabular-nums">{currentTime}</span>
            <span className="text-[8px] text-[#00f3ff]/50">SECURE_SSL_NODE</span>
          </div>

          <button
            onClick={handleResetTelemetry}
            id="btn-reboot-top"
            className="p-1.5 px-3 rounded bg-red-950/20 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-900/10 text-[9px] font-mono tracking-tight flex items-center gap-1.5 cursor-pointer transition-all"
            title="Factory hard reboot platform"
          >
            <RotateCcw className="w-3 h-3" />
            <span>HEAL DATA</span>
          </button>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* 2. MAIN LANDING HERO ZONE (with greeting animated model) */}
      {/* ======================================================== */}
      <section
        id="hero"
        className="relative min-h-screen overflow-hidden"
      >

        <video
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src={`${import.meta.env.BASE_URL}hero-greeting.mp4`}
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/45" />

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 25%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">

          <div className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-cyan-400 mb-4">
            ARIA-7 SYNTHETIC ENTITY
          </div>

          <h1 className="text-5xl md:text-8xl xl:text-9xl font-bold text-white leading-tight">
            Welcome to the
            <br />
            <span className="text-cyan-400">
              World of Cyborgs
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg text-gray-300">
            Step into a future where synthetic intelligence and human
            aspiration converge.
          </p>

        </div>

      </section>
      <section
  id="overview"
  className="relative border-y border-white/10 bg-[#050608] py-16 md:py-24 overflow-hidden"
>
  {/* Ambient background effects */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.08),transparent_35%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_30%)]" />  <div className="max-w-[1600px] mx-auto px-6 md:px-10 relative z-10">{/* Header */}
<div className="mb-12">
  <div className="inline-flex items-center gap-2 border border-cyan-400/20 rounded-full px-4 py-2 bg-cyan-500/5">
    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
    <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 font-mono">
      Cyber Intelligence Briefing
    </span>
  </div>

  <h2 className="mt-6 text-4xl md:text-6xl xl:text-7xl font-light text-white leading-tight max-w-5xl">
    Synthetic Evolution
    <span className="block text-cyan-400 font-bold">
      Beyond Human Version 1.0
    </span>
  </h2>

  <p className="mt-6 max-w-3xl text-gray-400 text-sm md:text-lg leading-relaxed">
    Every subsystem below contributes to a unified cybernetic intelligence
    stack. Diagnostics, adaptation, synchronization, architecture and
    decision-making are connected through a continuously evolving neural
    framework.
  </p>
</div>

{/* Main Grid */}
<div className="grid lg:grid-cols-12 gap-8 xl:gap-12">

  {/* Left Column */}
  <div className="lg:col-span-7 space-y-6">

    <div className="grid md:grid-cols-2 gap-6">

      <div className="border border-white/10 rounded-xl bg-white/[0.02] p-6">
        <div className="text-cyan-400 text-[10px] uppercase tracking-[0.25em] mb-3">
          Neural Layer
        </div>

        <h3 className="text-white text-xl font-semibold mb-3">
          Adaptive Processing Core
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed">
          Real-time analysis engine responsible for perception,
          synchronization and predictive decision modelling.
        </p>
      </div>

      <div className="border border-white/10 rounded-xl bg-white/[0.02] p-6">
        <div className="text-cyan-400 text-[10px] uppercase tracking-[0.25em] mb-3">
          Motion Layer
        </div>

        <h3 className="text-white text-xl font-semibold mb-3">
          Biomechanical Control
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed">
          Maintains fluid motion systems and precision coordination across
          multiple operational states.
        </p>
      </div>

      <div className="border border-white/10 rounded-xl bg-white/[0.02] p-6">
        <div className="text-cyan-400 text-[10px] uppercase tracking-[0.25em] mb-3">
          Memory Layer
        </div>

        <h3 className="text-white text-xl font-semibold mb-3">
          Persistent Neural Fabric
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed">
          Stores operational state information and enables continuous
          learning loops.
        </p>
      </div>

      <div className="border border-white/10 rounded-xl bg-white/[0.02] p-6">
        <div className="text-cyan-400 text-[10px] uppercase tracking-[0.25em] mb-3">
          System Layer
        </div>

        <h3 className="text-white text-xl font-semibold mb-3">
          Autonomous Coordination
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed">
          Connects all subsystems into a coherent cybernetic intelligence
          network.
        </p>
      </div>

    </div>

    <div className="flex flex-wrap gap-4 pt-4">
      <button
        onClick={() => {
          handleActionClick();
          scrollToSection("subsystems");
        }}
        className="px-6 py-3 bg-[#00f3ff] text-black font-bold text-xs uppercase tracking-[0.25em] hover:bg-white transition-all rounded-sm"
      >
        Explore Systems
      </button>

      <button
        onClick={() => {
          handleActionClick();
          scrollToSection("architecture");
        }}
        className="px-6 py-3 border border-white/20 text-white font-bold text-xs uppercase tracking-[0.25em] hover:bg-white/5 transition-all rounded-sm"
      >
        View Architecture
      </button>
    </div>

  </div>

  {/* Right Column */}
  <div className="lg:col-span-5">

    <div className="border border-cyan-500/20 rounded-2xl bg-white/[0.02] overflow-hidden">

      <div className="border-b border-white/10 p-6">
        <div className="text-cyan-400 text-[10px] uppercase tracking-[0.25em]">
          Neural Telemetry
        </div>

        <div className="text-white text-2xl mt-2">
          System Synchronization
        </div>
      </div>

      <div className="p-6 space-y-6">

        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Neural Sync</span>
            <span>99.9%</span>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[99%] bg-cyan-400 rounded-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Biomechanical Stability</span>
            <span>97.4%</span>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[97%] bg-cyan-400 rounded-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Cognitive Throughput</span>
            <span>94.8%</span>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[95%] bg-cyan-400 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">

          <div>
            <div className="text-cyan-400 text-xl font-bold">
              99.9%
            </div>
            <div className="text-[9px] uppercase tracking-wider text-gray-500">
              Sync
            </div>
          </div>

          <div>
            <div className="text-white text-xl font-bold">
              24/7
            </div>
            <div className="text-[9px] uppercase tracking-wider text-gray-500">
              Online
            </div>
          </div>

          <div>
            <div className="text-white text-xl font-bold">
              500+
            </div>
            <div className="text-[9px] uppercase tracking-wider text-gray-500">
              Nodes
            </div>
          </div>

        </div>

      </div>

    </div>

  </div>

</div>

  </div>
</section>

      {/* ======================================================== */}
      {/* 3. TRANSITION CYBORG SUBSYSTEMS DETAILS CARDS             */}
      {/* ======================================================== */}
      <section id="subsystems" className="border-t border-white/10 bg-white/[0.01] py-20 px-6 md:px-10 relative">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-12">

          {/* Main Subsystems Section Headers */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white mt-1">
              Cyborg <span className="text-[#00f3ff] font-bold italic">Subsystems</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Explore the advanced anatomy of our cybernetic intelligence. Each subsystem represents the pinnacle of engineering, housing detailed biophysical conduits and telemetry registers.
            </p>
          </div>

          {/* ======================================================== */}
          {/* 4. CLINICAL BIOMECHANICAL ANALYTICAL SCANNER (the centerpiece) */}
          {/* ======================================================== */}
          <div id="analytical-scanner-portal" className="border border-white/5 rounded-2xl bg-[#090b10]/60 p-4 md:p-6 mt-2 backdrop-blur-xl relative">
            <div className="absolute top-0 right-10 w-24 h-24 bg-cyan-500/5 -mr-12 -mt-12 rounded-full blur-2xl"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5 mb-6">
              <div className="flex gap-2">
                <div className="w-1 h-8 bg-[#00f3ff]"></div>
                <div>
                  <h3 className="text-lg font-semibold text-white leading-none">Diagnostic Scan Workspace</h3>
                  <span className="text-[9px] uppercase tracking-widest text-[#00f3ff]">Active Holographic System 4.0</span>
                </div>
              </div>

              {/* Reset counters & Active telemetry flag */}
              <div className="flex items-center gap-3">
                {activeNodeId && (
                  <button
                    onClick={() => { handleActionClick(); handleSetActiveNode(null); }}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs border border-white/10 rounded font-mono text-[10px] uppercase text-white tracking-widest cursor-pointer transition-all"
                  >
                    Close Scanner [X]
                  </button>
                )}
                <div className="text-[10px] font-mono text-slate-500">
                  REFRESH RANGE: <span className="text-[#00f3ff] font-bold animate-pulse">0.02ms</span>
                </div>
              </div>
            </div>

            {/* Core Diagnostics Dashboard double columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* Left Column: Cyborg Active Viewport (Anatomy hotspot click map) - ENLARGED BY 2-3X */}
              <div className="lg:col-span-8 bg-black/45 rounded-xl border border-white/5 p-2 min-h-[900px] lg:min-h-[1100px] flex flex-col justify-between">
                <CyborgViewer
                  nodes={nodes}
                  activeNode={activeNode}
                  setActiveNode={handleSetActiveNode}
                  selectedHotspotId={selectedHotspotId}
                  setSelectedHotspotId={handleSetSelectedHotspotId}
                  onLogMessage={handleAddLog}
                />
              </div>

              {/* Right Column: Specifications Interactive Tuning Controls */}
              <div className="lg:col-span-4 flex flex-col gap-4">

                {/* 1. Live system metrics charts */}
                <SpecsPanel
                  activeNode={activeNode}
                  selectedHotspotId={selectedHotspotId}
                  overallSync={overallSync}
                />

                {/* 2. Manual calibration and tuning dials */}
                <SubsystemTuner
                  activeNode={activeNode}
                  onTuningAction={handleTuningAction}
                  audioEnabled={audioEnabled}
                  setAudioEnabled={setAudioEnabled}
                />

                {/* 3. Running Telemetry Logs */}
                <div className="h-[210px]">
                  <TerminalLogs
                    logs={logs}
                    onClearLogs={() => {
                      playBeep(200, "sine", 0.05);
                      setLogs([]);
                    }}
                    onRunDiagnostic={handleRandomDiagnostic}
                  />
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. SYSTEM ARCHITECTURE / DATAFLOW INTERACTION SECION     */}
      {/* ======================================================== */}
      <section id="architecture" className="py-20 px-6 md:px-10 relative">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-12">

          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#00f3ff] block">System Architecture</span>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white leading-tight">
              How intelligence flows through the <span className="text-[#00f3ff] font-bold italic">network</span>
            </h2>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
              Our advanced neural conduits execute millisecond processing cascades. Data is collected, analyzed, piped to the core lattice, and projected with peak accuracy.
            </p>
          </div>

          {/* Architecture Steppers (Exactly matching mockup) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative font-mono mt-4">

            {/* Horizontal connected light flow line (for decorative beauty) */}
            <div className="absolute top-[35px] left-10 right-10 h-[1.5px] bg-gradient-to-r from-cyan-500/20 via-purple-500/35 to-cyan-500/20 hidden md:block z-0" />

            {/* Stepper 1 */}
            <div className="bg-[#111218] border border-white/5 rounded-xl p-5 relative z-10 flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#050608] border border-[#00f3ff]/40 flex items-center justify-center text-[#00f3ff] font-bold text-xs shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                <span>1</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Input Layer</h4>
                <p className="text-[10px] text-slate-500">Continuous biometric haptic and multi-spectrum reception.</p>
              </div>
            </div>

            {/* Stepper 2 */}
            <div className="bg-[#111218] border border-white/5 rounded-xl p-5 relative z-10 flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#050608] border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xs shadow-[0_0_15px_rgba(157,0,255,0.2)]">
                <span>2</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Analysis</h4>
                <p className="text-[10px] text-slate-500">Localized buffer optimization & real-time spectral projection.</p>
              </div>
            </div>

            {/* Stepper 3 */}
            <div className="bg-[#111218] border border-white/5 rounded-xl p-5 relative z-10 flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#050608] border border-[#00f3ff]/40 flex items-center justify-center text-[#00f3ff] font-bold text-xs shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                <span>3</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Neural Core</h4>
                <p className="text-[10px] text-slate-500">Cascade parsing on the 3.2 Zettabytes cortex lattice.</p>
              </div>
            </div>

            {/* Stepper 4 */}
            <div className="bg-[#111218] border border-white/5 rounded-xl p-5 relative z-10 flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#050608] border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs shadow-[0_0_15px_rgba(255,140,0,0.2)]">
                <span>4</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Decision Engine</h4>
                <p className="text-[10px] text-slate-500">Autonomous predictive alignment computing.</p>
              </div>
            </div>

            {/* Stepper 5 */}
            <div className="bg-[#111218] border border-white/5 rounded-xl p-5 relative z-10 flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#050608] border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs shadow-[0_0_15px_rgba(75,255,100,0.2)]">
                <span>5</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Output</h4>
                <p className="text-[10px] text-slate-500">Symmetrical multi-axis fluid motor gesture release.</p>
              </div>
            </div>

          </div>

          {/* Secondary Stats panels banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 font-mono select-none">
            <div className="bg-[#111218]/40 border border-white/5 rounded-xl p-5 hover:border-[#00f3ff]/20 transition-all">
              <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Active Systems</span>
              <span className="text-xl md:text-2xl font-bold text-white">124,893</span>
            </div>
            <div className="bg-[#111218]/40 border border-white/5 rounded-xl p-5 hover:border-[#00f3ff]/20 transition-all">
              <span className="text-[9px] uppercase tracking-wider text-gray-500 block">System Accuracy</span>
              <span className="text-xl md:text-2xl font-bold text-[#00f3ff]">99.98%</span>
            </div>
            <div className="bg-[#111218]/40 border border-white/5 rounded-xl p-5 hover:border-[#00f3ff]/20 transition-all">
              <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Response Time</span>
              <span className="text-xl md:text-2xl font-bold text-white">11ms</span>
            </div>
            <div className="bg-[#111218]/40 border border-white/5 rounded-xl p-5 hover:border-[#00f3ff]/20 transition-all">
              <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Enterprise Partners</span>
              <span className="text-xl md:text-2xl font-bold text-[#00f3ff]">500+</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TRUSTED BY INNOVATORS (Testimonials quotes)           */}
      {/* ======================================================== */}
      <section className="bg-white/[0.01] border-y border-white/10 py-16 px-6 md:px-10">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-10">

          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#00f3ff] block">Endorsements</span>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white">
              Trusted by <span className="text-[#00f3ff] font-bold italic">Innovators</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {/* Card 1 */}
            <div className="bg-[#111218] border border-white/5 rounded-xl p-6 relative overflow-hidden">
              <div className="text-5xl text-[#00f3ff]/15 font-serif absolute -top-1 -left-1">“</div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 pt-2 relative z-10 italic">
                "The most advanced cybernetic system we've encountered. Truly revolutionary. The somatic latency of 0.02ms is a technological marvel that bridges human consciousness and metal flawlessly."
              </p>
              <div className="flex items-center gap-3 font-mono">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-white font-bold text-xs uppercase">
                  DC
                </div>
                <div>
                  <span className="block text-white text-xs font-bold leading-none">Dr. Sarah Chen</span>
                  <span className="text-[8px] text-[#00f3ff]/60 uppercase tracking-wider">AI Research Director</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#111218] border border-white/5 rounded-xl p-6 relative overflow-hidden">
              <div className="text-5xl text-[#00f3ff]/15 font-serif absolute -top-1 -left-1">“</div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 pt-2 relative z-10 italic">
                "Integration was seamless. Performance exceeded all expectations. The power efficiency of the Sol-Reactor Core keeps thermodynamic dissipation to zero, securing stable cycles under massive load."
              </p>
              <div className="flex items-center gap-3 font-mono">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-white font-bold text-xs uppercase">
                  MR
                </div>
                <div>
                  <span className="block text-white text-xs font-bold leading-none">Marcus Rivera</span>
                  <span className="text-[8px] text-[#00f3ff]/60 uppercase tracking-wider">CTO, TechCorp Industries</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#111218] border border-white/5 rounded-xl p-6 relative overflow-hidden">
              <div className="text-5xl text-[#00f3ff]/15 font-serif absolute -top-1 -left-1">“</div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 pt-2 relative z-10 italic">
                "This is the future. We're witnessing the next evolution of intelligence. Symmetrical physical balance paired with self-healing outer shells sets a standard that was previously science fiction."
              </p>
              <div className="flex items-center gap-3 font-mono">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-white font-bold text-xs uppercase">
                  EV
                </div>
                <div>
                  <span className="block text-white text-xs font-bold leading-none">Elena Volkova</span>
                  <span className="text-[8px] text-[#00f3ff]/60 uppercase tracking-wider">Innovation Lead</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. PRICING PLANS TABLE (Sleek dark tiered grid)          */}
      {/* ======================================================== */}
      <section id="pricing" className="py-20 px-6 md:px-10">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-12">

          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#00f3ff] block">Pricing Plans</span>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white leading-tight">
              Choose your <span className="text-[#00f3ff] font-bold italic">evolution path</span>
            </h2>
            <div className="inline-flex items-center gap-1.5 p-1 bg-[#111218] rounded border border-white/10 mt-3 font-mono text-[9px] uppercase text-white">
              <button
                onClick={() => { handleActionClick(); setActivePricingPeriod("monthly"); }}
                className={`py-1 px-3 rounded-sm font-bold transition-all ${activePricingPeriod === "monthly" ? "bg-[#00f3ff] text-black" : "text-gray-400"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => { handleActionClick(); setActivePricingPeriod("yearly"); }}
                className={`py-1 px-3 rounded-sm font-bold transition-all ${activePricingPeriod === "yearly" ? "bg-[#00f3ff] text-black" : "text-gray-400"}`}
              >
                Yearly [Save 20%]
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Plan 1: Starter */}
            <div className="bg-[#111218] border border-white/5 hover:border-[#00f3ff]/20 rounded-2xl p-6 flex flex-col justify-between transition-all font-sans">
              <div className="space-y-4">
                <span className="text-[9px] uppercase tracking-wider font-mono text-gray-500">Starter</span>
                <div className="flex items-baseline gap-1.5 border-b border-white/5 pb-4">
                  <span className="text-3xl font-bold text-white tracking-tight">
                    {activePricingPeriod === "monthly" ? "$999" : "$799"}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/mo</span>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed">
                  Perfect for exploration and automated basic motor gesture testing.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 font-mono text-[10px]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>Basic Neural Processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>Standard Motion Control</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>90% Sync Stability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>Standard Email Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => { handleActionClick(); setSelectedPricingPlan("Starter"); }}
                className="w-full mt-8 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border border-white/10 hover:border-[#00f3ff]/50 hover:text-[#00f3ff] text-white transition-all rounded bg-transparent cursor-pointer"
              >
                Get Started
              </button>
            </div>

            {/* Plan 2: Pro (Highlighted Best Seller) */}
            <div className="bg-[#111218] border-2 border-[#00f3ff] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_15px_40px_rgba(0,243,255,0.15)] transition-all font-sans">

              {/* Popular glowing label */}
              <div className="absolute top-3 right-3 bg-[#00f3ff] text-black text-[8px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded">
                Most Popular
              </div>

              <div className="space-y-4">
                <span className="text-[9px] uppercase tracking-wider font-mono text-[#00f3ff]">Professional</span>
                <div className="flex items-baseline gap-1.5 border-b border-[#00f3ff]/20 pb-4">
                  <span className="text-3xl font-bold text-white tracking-tight">
                    {activePricingPeriod === "monthly" ? "$4,999" : "$3,999"}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/mo</span>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed">
                  Fully operational hardware system syncing advanced AI features dynamically.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 font-mono text-[10px]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>Advanced Neural Lattice</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>Full Fluid Motion Systems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>99.9% Active Sync Rate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>24/7 Priority Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>Custom Subsystem Tuning</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => { handleActionClick(); setSelectedPricingPlan("Pro"); }}
                className="w-full mt-8 py-2.5 text-xs font-mono font-bold uppercase tracking-wider bg-[#00f3ff] text-black hover:bg-white transition-all rounded cursor-pointer shadow-[0_0_15px_rgba(0,243,255,0.25)]"
              >
                Get Started
              </button>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="bg-[#111218] border border-white/5 hover:border-[#00f3ff]/20 rounded-2xl p-6 flex flex-col justify-between transition-all font-sans">
              <div className="space-y-4">
                <span className="text-[9px] uppercase tracking-wider font-mono text-gray-500">Enterprise</span>
                <div className="flex items-baseline gap-1.5 border-b border-white/5 pb-4">
                  <span className="text-3xl font-bold text-white tracking-tight">Custom</span>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed">
                  Unlimited dedicated clusters, tailored specifically to enterprise intelligence requirements.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 font-mono text-[10px]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>Full System Access Link</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>Dedicated Private Server</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>99.999% SLA Uptime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>Dedicated Integration Engineers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00f3ff]" />
                    <span>Custom Chassis Styling</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => { handleActionClick(); setSelectedPricingPlan("Enterprise"); }}
                className="w-full mt-8 py-2.5 text-xs font-mono font-bold uppercase tracking-wider border border-white/10 hover:border-[#00f3ff]/50 hover:text-[#00f3ff] text-white transition-all rounded bg-transparent cursor-pointer"
              >
                Get Started
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. INTERACTIVE CALL TO ACTION                            */}
      {/* ======================================================== */}
      <section className="py-20 px-6 md:px-10 relative">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-cyan-900/10 to-purple-900/15 border border-white/15 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden backdrop-blur-md">
          {/* Aesthetic background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00f3ff]/10 rounded-full blur-[90px] -z-10" />

          <span className="text-[10px] uppercase font-mono tracking-[0.35em] text-[#00f3ff] block">The Future Is Ready</span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white leading-tight">
            Will You Join the <span className="text-[#00f3ff] font-bold italic">Evolution?</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            Experience the world's most stable neural synchronization and biomechanical fluid motion chassis. Calibrate systems proactively, audit real-time telemetry, and expand your consciousness.
          </p>

          <button
            onClick={() => { handleActionClick(); setIsDemoModalOpen(true); }}
            className="px-8 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-[0.25em] hover:bg-[#00f3ff] hover:scale-105 transition-all shadow-[0_15px_30px_rgba(0,0,0,0.5)] rounded-sm cursor-pointer"
          >
            Start Your Journey →
          </button>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. SECURE COMPLIANT FOOTER                               */}
      {/* ======================================================== */}
      <footer className="h-16 border-t border-white/10 flex flex-col md:flex-row items-center justify-between px-6 md:px-10 text-[9px] uppercase tracking-[0.2em] text-gray-500 bg-[#050608] z-40 relative gap-3 py-4 md:py-0">
        <div>2026 © CYBER-EVO TECHNOLOGIES CO.</div>
        <div className="flex gap-6 font-mono text-[8px]">
          <span>STATUS: ONLINE</span>
          <span>CYCLES AVERAGE: 60.10 GigaHZ</span>
          <span>NODE: SECURE_[SSL]_NX</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#00f3ff] transition-colors text-slate-500 flex items-center gap-0.5">
            <span>Twitter</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a href="#" className="hover:text-[#00f3ff] transition-colors text-slate-500 flex items-center gap-0.5">
            <span>Discord</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 10. INTERACTIVE PURCHASE SUCCESS POPUP DIALOGS          */}
      {/* ======================================================== */}
      {selectedPricingPlan && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111218] border-2 border-[#00f3ff] rounded-2xl p-6 md:p-8 max-w-md w-full relative space-y-5 shadow-[0_0_50px_rgba(0,243,255,0.3)]">
            <div className="w-12 h-12 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-[#00f3ff]" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">CALIBRATION ACCESS LINKED</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-sans">
                You have successfully secured the allocation of the <span className="text-white font-bold">{selectedPricingPlan} Plan</span> interface. Subsystem secure links are compiled and synced to your credentials node.
              </p>
            </div>

            <div className="bg-[#05070a]/60 border border-white/5 rounded p-3 font-mono text-[9px] text-slate-400 space-y-1">
              <div>TRANSACT_ID: TX_EVO_{Math.random().toString(36).substring(2, 8).toUpperCase()}</div>
              <div>ALLOC_RATE: COHERENT</div>
              <div>SSL_CHANNEL: ESTABLISHED</div>
            </div>

            <button
              onClick={() => { handleActionClick(); setSelectedPricingPlan(null); }}
              className="w-full py-2 bg-[#00f3ff] text-black font-bold uppercase font-mono tracking-widest text-xs hover:bg-white transition-colors rounded cursor-pointer"
            >
              Expose Dashboard [OK]
            </button>
          </div>
        </div>
      )}

      {/* Demo signup modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111218] border border-[#00f3ff]/40 rounded-2xl p-6 max-w-sm w-full relative space-y-5 shadow-[0_0_40px_rgba(0,243,255,0.15)]">
            <div className="w-10 h-10 rounded-full bg-[#00f3ff]/15 flex items-center justify-center mx-auto">
              <Bot className="w-5 h-5 text-[#00f3ff]" />
            </div>

            <div className="text-center space-y-2 font-mono">
              <h4 className="text-xs font-bold text-white tracking-widest uppercase">CONSCIOUSNESS SYNC INITIATION</h4>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                Connect your synaptic sensors or submit your diagnostic mail node below to register your DNA registry in the global cybernetic database.
              </p>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <input
                type="email"
                placeholder="synapse_secure_node@provider.com"
                className="w-full bg-[#050608] border border-white/10 rounded px-3 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#00f3ff]"
              />
              <button
                onClick={() => {
                  handleActionClick();
                  setIsDemoModalOpen(false);
                  handleAddLog("NEURAL_GRID", "Synaptic registration complete. DNA node tracking initialized.", "success");
                }}
                className="w-full py-2 bg-[#00f3ff] text-black font-mono font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-colors rounded cursor-pointer"
              >
                Register Synapse Link
              </button>
            </div>

            <button
              onClick={() => { handleActionClick(); setIsDemoModalOpen(false); }}
              className="text-[9px] font-mono text-center block mx-auto text-slate-500 hover:text-white cursor-pointer"
            >
              Abstain For Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
