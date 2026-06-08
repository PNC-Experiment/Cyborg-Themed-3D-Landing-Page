/**
 *  * @license
  * SPDX-License-Identifier: Apache-2.0
   */
  

import { useEffect, useRef, useState } from "react";

export default function BackgroundGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeScan, setActiveScan] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track particles
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      fadeSpeed: number;
    }[] = [];

    // Create initial particles
    const createParticle = (isInitial = false) => {
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : height + 10,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -(Math.random() * 0.5 + 0.2), // float upwards
        alpha: Math.random() * 0.5 + 0.1,
        fadeSpeed: Math.random() * 0.005 + 0.002,
      };
    };

    for (let i = 0; i < 35; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw digital grids inside CANVAS optionally or keep it minimal
      ctx.fillStyle = "rgba(0, 243, 255, 0.05)";

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce horizontally off walls
        if (p.x < 0 || p.x > width) p.speedX *= -1;

        // Reset if out of screen or faded
        if (p.y < 0) {
          particles[idx] = createParticle(false);
          particles[idx].y = height;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 243, 255, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(0, 243, 255, 0.4)";
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
      });

      // Draw occasional technological node linkages
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(
            particles[i].x - particles[j].x,
            particles[i].y - particles[j].y
          );
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 243, 255, ${(1 - dist / 100) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base deep background */}
      <div className="absolute inset-0 bg-[#06080d]" />

      {/* Grid pattern overlays */}
      <div className="absolute inset-0 cyber-grid opacity-60" />
      <div className="absolute inset-0 cyber-grid-fine opacity-40" />

      {/* Cybernetic particle simulation canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Scanline atmospheric tint */}
      <div className="absolute inset-0 scanline opacity-30" />

      {/* Ambient background energy glows */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-cyber-blue/15 filter blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[35rem] h-[35rem] rounded-full bg-cyber-purple/10 filter blur-[180px]" />
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-cyber-cyan/10 filter blur-[120px]" />

      {/* Technical HUD Framing elements for architectural aesthetics */}
      <div className="absolute top-4 left-6 flex items-center gap-2 text-[10px] font-mono text-cyan-400/50 tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping" />
        <span>SYS LOG: ACTIVE</span>
        <span className="text-slate-600">/</span>
        <span>SYS: SECURE</span>
      </div>

      <div className="absolute bottom-4 right-6 text-[10px] font-mono text-cyan-400/40 tracking-widest uppercase">
        <span>CYBER-EVO PROTOCOL INT v4.95</span>
      </div>

      {/* Sweeping holographic telemetry laser line */}
      {activeScan && (
        <div 
          className="absolute left-0 right-0 h-[2px] bg-cyan-400/30 shadow-[0_0_15px_rgba(0,243,255,0.7)]" 
          style={{
            animation: "sweep 10s infinite linear",
            top: 0
          }}
        />
      )}

      {/* CSS injected specifically for the holographic sweep animation */}
      <style>{`
        @keyframes sweep {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
