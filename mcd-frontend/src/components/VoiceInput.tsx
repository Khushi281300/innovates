"use client";
import { useState, useRef } from "react";

export default function VoiceInput({ onAudioSubmit, isProcessing }: { onAudioSubmit: (audioBlob: Blob, textPrompt: string) => void, isProcessing: boolean }) {
  const [isRecording, setIsRecording] = useState(false);
  const [textPrompt, setTextPrompt] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            onAudioSubmit(audioBlob, textPrompt);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (err) {
        console.error("Error accessing microphone", err);
        alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-8 border-white/5 relative overflow-hidden group h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white font-display tracking-tight flex items-center gap-3">
          <span className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
          </span>
          Command Console
        </h3>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5">Hinglish Core</span>
        </div>
      </div>
      
      <div className="flex-1 relative mb-6">
        <textarea
          className="w-full h-full glass-card rounded-2xl p-5 text-slate-200 text-sm placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none custom-scrollbar leading-relaxed"
          placeholder="Enter administrative directive or use secure dictation..."
          value={textPrompt}
          onChange={(e) => setTextPrompt(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      
      <div className="flex gap-4 items-center">
        {!isRecording ? (
          <button 
            onClick={startRecording} 
            disabled={isProcessing}
            className="flex-1 glass-card border-white/10 hover:border-rose-500/30 text-slate-300 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all group/mic"
          >
            <span className="relative flex h-3 w-3">
               <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500/20 group-hover/mic:animate-ping"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500/40"></span>
            </span>
            Start Dictation
          </button>
        ) : (
          <button 
            onClick={stopRecording} 
            className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest animate-pulse flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
          >
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Terminate & Analyze
          </button>
        )}
        
        <button 
            onClick={() => onAudioSubmit(new Blob(), textPrompt)} 
            disabled={isProcessing || (!textPrompt && !isRecording)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:opacity-20 disabled:grayscale"
        >
          {isProcessing ? (
             <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : "Submit Directive"}
        </button>
      </div>
      
      {isRecording && (
        <div className="absolute bottom-28 left-0 w-full px-8 flex justify-center gap-1 pointer-events-none animate-fade-in">
           {[...Array(12)].map((_, i) => (
             <div key={i} className="w-1 bg-rose-400/30 rounded-full animate-pulse-slow" style={{ height: `${Math.random() * 30 + 10}px`, animationDelay: `${i * 0.1}s` }}></div>
           ))}
        </div>
      )}
    </div>
  );
}
