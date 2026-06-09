/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Radio, Shield, Cpu, Sparkles } from "lucide-react";

interface HeroCyborgGreetingProps {
  onGreetingComplete?: () => void;
}

export default function HeroCyborgGreeting({ onGreetingComplete }: HeroCyborgGreetingProps) {
  const [greetProgress, setGreetProgress] = useState(0); // 0 = start, 1 = moving arms, 2 = merged & rippling, 3 = complete/meditating
  const [hudLog, setHudLog] = useState("");
  const [ripples, Ripples] = useState<{ id: number; scale: number }[]>([]);

  // Orchestrate greeting phases
  useEffect(() => {
    // Phase 1: Booting system
    setHudLog("CONNECT] CORE NEURAL NETWORK ONLINE...");
    const t1 = setTimeout(() => {
      setGreetProgress(1);
      setHudLog("ALIGN] INITIATING GESTURE MATRIX...");
    }, 1000);

    // Phase 2: Palms meet -> Trigger ripples
    const t2 = setTimeout(() => {
      setGreetProgress(2);
      setHudLog("SYNC] HARMONIC EQUILIBRIUM SECURED...");
      triggerRippleEvent();
    }, 2800);

    // Phase 3: Transition to silent meditation base
    const t3 = setTimeout(() => {
      setGreetProgress(3);
      setHudLog("ACTIVE] ZENMEDITATION POSE UNIFIED.");
      if (onGreetingComplete) onGreetingComplete();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Trigger expansion waves when palms meet
  const triggerRippleEvent = () => {
    const idS = [1, 2, 3];
    idS.forEach((id, idx) => {
      setTimeout(() => {
        Ripples((prev) => [...prev, { id: Date.now() + idx, scale: 0 }]);
      }, idx * 400);
    });
  };

  // Live coordinate parameters mapped by greeting stage
  const isGreetingPhase = greetProgress < 2;

  // Left side joints coordinates
  const leftShoulder = { x: 74, y: 150 };
  const leftElbow = isGreetingPhase ? { x: 50, y: 220 } : { x: 62, y: 195 };
  const leftHand = isGreetingPhase ? { x: 35, y: 270 } : { x: 100, y: 172 };

  // Right side joints coordinates
  const rightShoulder = { x: 126, y: 150 };
  const rightElbow = isGreetingPhase ? { x: 150, y: 220 } : { x: 138, y: 195 };
  const rightHand = isGreetingPhase ? { x: 165, y: 270 } : { x: 100, y: 172 };

  // Floating ambient orbit tracks
  const orbitCount = 4;

  return (
    <div id="hero-cyborg-container" className="relative w-full aspect-[4/5] min-h-[600px] md:min-h-[800px] bg-radial from-slate-950/20 via-[#050608] to-[#050608] rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4 shadow-2xl">
      
      {/* 3D Tech Orbit Rings in Parallax Background (similar to the circles in the video) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        {Array.from({ length: orbitCount }).map((_, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full border border-dashed text-cyan-500/10"
            style={{
              width: `${240 + idx * 100}px`,
              height: `${140 + idx * 50}px`,
              borderColor: idx === 1 ? "rgba(0, 243, 255, 0.15)" : "rgba(255, 255, 255, 0.03)",
              borderWidth: idx % 2 === 0 ? "1px" : "1.5px",
              transform: "rotateX(72deg) rotateY(-12deg)",
            }}
            animate={{
              rotateZ: idx % 2 === 0 ? 360 : -360,
            }}
            transition={{
              duration: 25 + idx * 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Cyber Space background dust particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        {Array.from({ length: 15 }).map((_, idx) => (
          <motion.div
            key={idx}
            className="absolute w-[2px] h-[2px] bg-cyan-400 rounded-full"
            style={{
              top: `${15 + idx * 6}%`,
              left: `${20 + (idx * 17) % 60}%`,
            }}
            animate={{
              y: [-15, -120],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 6 + (idx % 4) * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 0.4,
            }}
          />
        ))}
      </div>

      {/* Main realistic 3D Cyborg Base Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-2">
        <motion.div
          className="relative w-full h-full flex justify-center items-center"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Cyber-Evo High end visual (autoplay on loads/reloads, plays once/non-repeating) */}
          <div className="relative w-[95%] h-[95%] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 bg-slate-950/40">
            <video
              autoPlay
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover brightness-105 contrast-[1.02] opacity-85"
              >
                <source src={`${import.meta.env.BASE_URL}hero-greeting.mp4`} type="video/mp4" />
              </video>
            {/* Glossy terminal scanning lines overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-500/5 to-transparent bg-[size:100%_20px] pointer-events-none opacity-40 animate-pulse" />
            <div className="absolute inset-0 bg-radial-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Interactive mechanical telemetry SVG overlay */}
      <svg
        viewBox="0 0 200 280"
        className="absolute inset-0 w-full h-full z-20 pointer-events-none"
      >
        <defs>
          <radialGradient id="lens-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cyber-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#111" />
            <stop offset="50%" stopColor="#00f3ff" />
            <stop offset="100%" stopColor="#111" />
          </linearGradient>
        </defs>

        {/* Chest Central Core Power light (same location as in video) */}
        <g id="reactor" className="transform-gpu">
          <motion.circle
            cx="100"
            cy="172"
            r={greetProgress >= 2 ? 14 : 9}
            fill="#00f3ff"
            fillOpacity={greetProgress >= 2 ? 0.15 : 0.05}
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="100"
            cy="172"
            r={greetProgress >= 2 ? 6 : 3.5}
            fill="#00f3ff"
            animate={{
              boxShadow: ["0 0 10px #00f3ff", "0 0 25px #00f3ff", "0 0 10px #00f3ff"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </g>

        {/* Dynamic expanding quantum rings on palms merged */}
        {ripples.map((rip) => (
          <motion.circle
            key={rip.id}
            cx="100"
            cy="172"
            r="1"
            fill="none"
            stroke="#00f3ff"
            strokeWidth="0.8"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{
              scale: 55,
              opacity: 0,
            }}
            transition={{
              duration: 2.5,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Animated Cybernetic arm skeletal tracks aligning */}
        {/* Left Arm lines path */}
        <motion.path
          d={`M ${leftShoulder.x} ${leftShoulder.y} L ${leftElbow.x} ${leftElbow.y} L ${leftHand.x} ${leftHand.y}`}
          fill="none"
          stroke="#00f3ff"
          strokeWidth="1.2"
          strokeOpacity={0.6}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d={`M ${leftShoulder.x} ${leftShoulder.y} L ${leftElbow.x} ${leftElbow.y} L ${leftHand.x} ${leftHand.y}`}
          fill="none"
          stroke="#fff"
          strokeWidth="0.5"
          strokeDasharray="4 4"
          strokeOpacity={0.8}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Right Arm lines path */}
        <motion.path
          d={`M ${rightShoulder.x} ${rightShoulder.y} L ${rightElbow.x} ${rightElbow.y} L ${rightHand.x} ${rightHand.y}`}
          fill="none"
          stroke="#00f3ff"
          strokeWidth="1.2"
          strokeOpacity={0.6}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d={`M ${rightShoulder.x} ${rightShoulder.y} L ${rightElbow.x} ${rightElbow.y} L ${rightHand.x} ${rightHand.y}`}
          fill="none"
          stroke="#fff"
          strokeWidth="0.5"
          strokeDasharray="4 4"
          strokeOpacity={0.8}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Symmetrical joint circles with pulsing feedback */}
        {/* Left shoulder/elbow/wrist */}
        <circle cx={leftShoulder.x} cy={leftShoulder.y} r="2.5" fill="#fff" />
        <motion.circle cx={leftElbow.x} cy={leftElbow.y} r="3" fill="#00f3ff" transition={{ duration: 1.5 }} />
        <motion.circle cx={leftHand.x} cy={leftHand.y} r="3.5" fill="#fff" transition={{ duration: 1.5 }} />

        {/* Right shoulder/elbow/wrist */}
        <circle cx={rightShoulder.x} cy={rightShoulder.y} r="2.5" fill="#fff" />
        <motion.circle cx={rightElbow.x} cy={rightElbow.y} r="3" fill="#00f3ff" transition={{ duration: 1.5 }} />
        <motion.circle cx={rightHand.x} cy={rightHand.y} r="3.5" fill="#fff" transition={{ duration: 1.5 }} />

        {/* Telemetry markers overlay */}
        <path d="M 30 50 L 55 50 L 65 60" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <circle cx="30" cy="50" r="1.5" fill="#00f3ff" />
        
        <path d="M 170 50 L 145 50 L 135 60" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <circle cx="170" cy="50" r="1.5" fill="#00f3ff" />

        {/* Interactive optic eye lens trackers */}
        <motion.circle
          cx="100"
          cy="114"
          r="1.5"
          fill="#00f3ff"
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}
        />
      </svg>

      {/* Cyber HUD Terminal log in real time */}
      <div className="absolute bottom-4 left-4 right-4 z-30 font-mono text-[9px] text-[#00f3ff]/80 bg-slate-950/80 border border-[#00f3ff]/20 rounded px-3 py-2 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
          <span className="uppercase tracking-wide">{hudLog}</span>
        </div>
        <div className="text-slate-500 text-[8px] tracking-widest hidden sm:inline">
          {greetProgress === 3 ? "STABILITY: OPTIMAL" : "BOOTING"}
        </div>
      </div>

      {/* Floating status parameters in corner */}
      <div className="absolute top-4 left-4 z-30 flex flex-col font-mono text-[9px] text-gray-400 leading-normal gap-1 bg-black/40 px-2 py-1.5 rounded border border-white/5 select-none pointer-events-none">
        <div className="flex items-center gap-1.5 text-white">
          <Shield className="w-2.5 h-2.5 text-emerald-400" />
          <span>ZEN-1: BOOT READY</span>
        </div>
        <div className="text-[8px] text-slate-500">LATENCY: 0.02ms</div>
      </div>

      {/* Reboot animation button so someone can replay standard greeting */}
      {greetProgress === 3 && (
        <motion.button
          onClick={() => {
            setGreetProgress(0);
            setHudLog("CONNECT] CORE NEURAL NETWORK ONLINE...");
            setTimeout(() => {
              setGreetProgress(1);
              setHudLog("ALIGN] INITIATING GESTURE MATRIX...");
            }, 1000);
            setTimeout(() => {
              setGreetProgress(2);
              setHudLog("SYNC] HARMONIC EQUILIBRIUM SECURED...");
              triggerRippleEvent();
            }, 2800);
            setTimeout(() => {
              setGreetProgress(3);
              setHudLog("ACTIVE] ZENMEDITATION POSE UNIFIED.");
            }, 4500);
          }}
          className="absolute top-4 right-4 z-30 px-2.5 py-1 bg-[#111218]/80 hover:bg-cyan-500/20 text-[#00f3ff] border border-cyan-500/25 rounded font-mono text-[9px] tracking-tight hover:text-white transition-all flex items-center gap-1 cursor-pointer pointer-events-auto"
          title="Replay Greet Pose Sequence"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>REBOOT GREET</span>
        </motion.button>
      )}
    </div>
  );
}
