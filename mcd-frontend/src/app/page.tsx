"use client";
import { useState } from "react";
import VoiceInput from "@/components/VoiceInput";
import DocumentUpload from "@/components/DocumentUpload";
import SplitScreenView from "@/components/SplitScreenView";
import RecentIngestions from "@/components/RecentIngestions";
import SystemStatus from "@/components/SystemStatus";

export default function Home() {
  const [draft, setDraft] = useState("");
  const [sources, setSources] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePromptSubmit = async (audioBlob: Blob, textPrompt: string) => {
    setIsProcessing(true);
    setDraft("Analyzing administrative directive, performing semantic registry search...");
    setSources([]);

    try {
        const formData = new FormData();
        formData.append("prompt", textPrompt || "null");
        if (audioBlob && audioBlob.size > 0) {
            formData.append("audio", audioBlob, "query.webm");
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/draft`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        const data = await res.json();
        setDraft(data.draft);
        setSources(data.sources);

    } catch (error) {
        console.error("Submission failed", error);
        setDraft("❌ Critical Failure: Communication with the AI Intelligence Engine interrupted. Ensure the service is active and responsive.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 container mx-auto max-w-[1600px] animate-fade-in">
      {/* Premium Header Branding */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 animate-slide-up">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-16 h-16 glass-panel rounded-full flex items-center justify-center text-3xl shadow-2xl border-white/20">
              🏛️
            </div>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter font-display uppercase mcd-header-gradient">
              MCD AI Copilot
            </h1>
            <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.4em] mt-1">
              Commissioner&apos;s Intelligence Hub • Secured Environment
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
           <div className="px-4 py-2 flex flex-col items-center">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Latency</span>
              <span className="text-xs font-bold text-emerald-500">24ms</span>
           </div>
           <div className="w-[1px] h-8 bg-white/10"></div>
           <div className="px-4 py-2 flex flex-col items-center">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Integrity</span>
              <span className="text-xs font-bold text-blue-400">Locked</span>
           </div>
        </div>
      </header>

      {/* Bento-Grid Like Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation & Status Sidebar */}
        <aside className="lg:col-span-3 space-y-8 animate-slide-up [animation-delay:200ms]">
          <SystemStatus />
          {/* Informational Bento Box */}
          <div className="glass-panel rounded-3xl p-6 border-white/5 hover:border-blue-500/20 transition-all duration-500">
             <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Operations Manual</h4>
             <ul className="space-y-4">
                {[
                  { icon: '🔒', text: 'End-to-end Local Encryption active.' },
                  { icon: '🎙️', text: 'Conversational Hinglish processing enabled.' },
                  { icon: '⚖️', text: 'RAG-Verified administrative citations.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-xs font-medium text-slate-400 leading-relaxed">
                    <span className="opacity-70">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
             </ul>
          </div>
          <RecentIngestions />
        </aside>

        {/* Primary Action Console */}
        <div className="lg:col-span-9 space-y-8">
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-slide-up [animation-delay:400ms]">
              <div className="h-full">
                <DocumentUpload />
              </div>
              <div className="h-full">
                <VoiceInput onAudioSubmit={handlePromptSubmit} isProcessing={isProcessing} />
              </div>
           </div>
           
           {/* Detailed Retrieval & Drafting View */}
           <div className="animate-slide-up [animation-delay:600ms]">
              <SplitScreenView draftText={draft} sources={sources} />
           </div>
        </div>
      </div>
      
      <footer className="mt-20 border-t border-white/5 pt-10 pb-20 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
         <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
           Municipal Corporation of Delhi © 2026 • AI Administrative Division
         </p>
         <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-600">
            <span>Security Policy</span>
            <span>Local Vault</span>
            <span>Audit Logs</span>
         </div>
      </footer>
    </div>
  );
}
