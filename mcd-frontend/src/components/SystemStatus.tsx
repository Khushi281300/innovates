"use client";
import { useState, useEffect } from "react";

export default function SystemStatus() {
  const [status, setStatus] = useState({ backend: "checking", ollama: "checking" });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("http://localhost:8000/");
        if (res.ok) {
          setStatus(prev => ({ ...prev, backend: "online" }));
        } else {
          setStatus(prev => ({ ...prev, backend: "error" }));
        }
      } catch {
        setStatus(prev => ({ ...prev, backend: "offline" }));
      }
    };

    const interval = setInterval(checkStatus, 5000);
    checkStatus();
    return () => clearInterval(interval);
  }, []);

  const StatusBadge = ({ label, value, colorClass }: { label: string, value: string, colorClass: string }) => (
    <div className="flex items-center justify-between gap-4 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${colorClass} animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></span>
        <span className={`text-[10px] font-black uppercase tracking-tight ${colorClass.replace('bg-', 'text-')}`}>
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="glass-panel rounded-2xl p-5 border-white/10 relative overflow-hidden group">
      {/* Decorative Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2 font-display">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_10px_#f59e0b]"></span>
          </span>
          Terminal Registry
        </h4>
        <span className="text-[9px] font-medium text-slate-500 bg-white/5 py-1 px-2 rounded-md border border-white/5">v1.2.0-STABLE</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <StatusBadge 
          label="FastAPI Gateway" 
          value={status.backend} 
          colorClass={status.backend === 'online' ? 'bg-emerald-400' : 'bg-rose-500'} 
        />
        
        <StatusBadge 
          label="Whisper Core" 
          value="Secured" 
          colorClass="bg-blue-400" 
        />
        
        <StatusBadge 
          label="AI Inference" 
          value="Ollama Optimized" 
          colorClass="bg-indigo-400" 
        />
      </div>

      {status.backend !== 'online' && status.backend !== 'checking' && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-300 font-medium leading-relaxed animate-slide-up">
          <span className="font-black text-rose-500 mr-1">CRITICAL:</span> 
          Registry connection failed. Ensure the python backend is running on port 8000.
        </div>
      )}
    </div>
  );
}
