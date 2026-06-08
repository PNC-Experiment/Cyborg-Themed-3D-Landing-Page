/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect } from "react";
import { Terminal, Trash2, Play, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { DiagnosticsLog } from "../types";

interface TerminalLogsProps {
  logs: DiagnosticsLog[];
  onClearLogs: () => void;
  onRunDiagnostic: () => void;
}

export default function TerminalLogs({
  logs,
  onClearLogs,
  onRunDiagnostic,
}: TerminalLogsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: DiagnosticsLog["type"]) => {
    switch (type) {
      case "success":
        return "text-[#40ff73]";
      case "warn":
        return "text-[#ffbf00]";
      case "critical":
        return "text-[#ff4545] font-semibold animate-pulse";
      case "info":
      default:
        return "text-[#00e1ff]";
    }
  };

  const getLogIcon = (type: DiagnosticsLog["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-3 h-3 text-[#40ff73] shrink-0" />;
      case "warn":
        return <AlertCircle className="w-3 h-3 text-[#ffbf00] shrink-0" />;
      case "critical":
        return <AlertCircle className="w-3 h-3 text-[#ff4545] shrink-0" />;
      case "info":
      default:
        return <Info className="w-3 h-3 text-[#00e1ff] shrink-0" />;
    }
  };

  return (
    <div className="cyber-glass rounded-xl p-4 flex flex-col h-full overflow-hidden border border-cyber-border relative font-mono text-xs">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-cyan" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-cyan" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-cyan" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-cyan" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/10 mb-3 select-none">
        <div className="flex items-center gap-1.5 font-bold tracking-widest text-[#00f3ff]">
          <Terminal className="w-4 h-4" />
          <span>SYS.DIAGNOSTICS_LOGS</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Diagnostic stimulation button */}
          <button
            onClick={onRunDiagnostic}
            id="btn-run-diag"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/40 hover:bg-cyan-900/60 transition-all border border-cyan-500/30 text-cyan-400 font-mono text-[10px] hover:text-[#00f3ff] cursor-pointer"
            title="Inject random system stimulator"
          >
            <Play className="w-3 h-3 text-cyan-400" />
            <span>RUN STIM</span>
          </button>
          
          <button
            onClick={onClearLogs}
            id="btn-clear-logs"
            className="p-1 px-1.5 rounded hover:bg-red-950/45 hover:text-red-400 text-slate-500 transition-colors cursor-pointer"
            title="Clear Terminal Cache"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 font-mono text-[11px] leading-relaxed select-text"
        style={{ scrollBehavior: "smooth" }}
      >
        {logs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center py-6">
            <span className="mb-2 text-slate-600">[ BUFFER CLEAR ]</span>
            <span>No log reports registered in diagnostic memory.</span>
            <span>Click `RUN STIM` above to transmit system telemetry.</span>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="group flex gap-2 p-1.5 hover:bg-cyan-950/20 rounded transition-colors items-start"
            >
              {/* Timestamp */}
              <span className="text-slate-500 shrink-0 font-medium select-none">
                [{log.timestamp}]
              </span>

              {/* Icon indicator */}
              <div className="mt-0.5 shrink-0 select-none">
                {getLogIcon(log.type)}
              </div>

              {/* Payload content */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-1">
                <span className="text-slate-400 font-bold shrink-0 uppercase tracking-tight select-none">
                  {log.source}:
                </span>
                <span className={`${getLogColor(log.type)} break-all`}>
                  {log.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-cyan-500/10 text-[9px] text-slate-500 select-none">
        <span>VIRTUAL_BUFFER: {logs.length}/50</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>TEL_STREAM_ONLINE</span>
        </div>
      </div>
    </div>
  );
}
