"use client";
import { useState, useRef } from "react";

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setStatus("Processing document structure for RAG indexing...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/ingest", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setStatus(`Successfully indexed ${result.chunks} segments to MCD Registry.`);
        setFile(null);
      } else {
        const err = await response.json();
        setStatus(`Indexing Failure: ${err.detail}`);
      }
    } catch (e) {
      setStatus("Security Breach: Connection to AI Engine refused.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-8 border-white/5 relative overflow-hidden group">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -z-10 group-hover:bg-accent/10 transition-colors duration-500"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="text-xl font-bold text-white font-display tracking-tight flex items-center gap-3">
            <span className="p-2 bg-accent/10 rounded-xl text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </span>
            Policy Ingestion
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-medium">Upload MCD official records for secure local analysis.</p>
        </div>
        
        <button 
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="relative group/btn overflow-hidden bg-accent text-slate-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:grayscale disabled:scale-100 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Indexing...
            </span>
          ) : (
            "Finalize Ingestion"
          )}
        </button>
      </div>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group/drop
          ${file ? 'border-accent bg-accent/5' : 'border-white/10 hover:border-white/20 bg-white/5'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          accept=".pdf" 
          onChange={handleFileChange}
          className="hidden"
        />
        
        {file ? (
          <div className="flex flex-col items-center text-center animate-fade-in">
             <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-4 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             <p className="text-sm font-bold text-white">{file.name}</p>
             <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tighter">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF Ready</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 mb-4 transition-transform group-hover/drop:scale-110 group-hover/drop:text-accent">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <p className="text-sm font-bold text-slate-300">Drop MCD Policy Document</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">Select PDF from system storage</p>
          </>
        )}
      </div>
      
      {status && (
        <div className={`mt-6 p-4 rounded-2xl animate-slide-up flex items-center gap-3 border ${
          status.includes('Breach') || status.includes('Failure') 
          ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' 
          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
        }`}>
          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          <p className="text-[11px] font-bold tracking-tight">{status}</p>
        </div>
      )}
    </div>
  );
}
