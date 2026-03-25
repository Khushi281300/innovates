"use client";

export default function SplitScreenView({ 
    draftText, 
    sources 
  }: { 
    draftText: string, 
    sources: { content: string, metadata: any }[] 
  }) {
    
  const copyToClipboard = () => {
    if (!draftText) return;
    navigator.clipboard.writeText(draftText);
    alert("Administrative Draft Copied to Clipboard.");
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 mt-12 h-[700px] animate-fade-in anim-delay-500">
      {/* Left Side: Policy Retrieval Log */}
      <div className="flex-1 glass-panel rounded-[2rem] p-8 flex flex-col h-full border-white/5 relative group">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-500/15 transition-colors duration-700"></div>
        
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-4">
            <span className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </span>
            Retrieval Log
          </h2>
          <span className="text-[10px] font-black tracking-widest bg-white/5 text-slate-400 px-4 py-1.5 rounded-full border border-white/10 uppercase">
            {sources.length} Segments Retrieved
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-6">
          {sources.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4 opacity-50">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
               <p className="text-sm font-bold uppercase tracking-widest italic">Awaiting Registry Retrieval...</p>
            </div>
          ) : (
            sources.map((source, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 relative group/card hover:ring-2 hover:ring-blue-500/20">
                <div className="flex items-center justify-between text-[10px] font-black text-blue-400 mb-4 uppercase tracking-[0.2em] border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-md bg-blue-500/20 flex items-center justify-center text-[8px]">📄</span>
                    {source.metadata?.source?.split('/').pop() || "MCD POLICY RECORD"}
                  </div>
                  <span className="px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/10">Segment {index + 1}</span>
                </div>
                <div className="text-slate-400 leading-relaxed text-sm font-medium italic">
                   &ldquo;{source.content}&rdquo;
                </div>
                {source.metadata?.page && (
                   <div className="mt-4 flex justify-end">
                      <span className="text-[10px] font-bold text-slate-600 bg-white/5 px-2 py-1 rounded">REF: PAGE {source.metadata.page}</span>
                   </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side: Administrative Draft Output */}
      <div className="flex-1 glass-panel rounded-[2rem] p-8 flex flex-col h-full border-white/5 relative group">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-700"></div>
        
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-4">
            <span className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
            </span>
            Official Correspondence
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={copyToClipboard}
              className="glass-card text-[10px] font-black uppercase text-slate-300 px-5 py-2 rounded-xl border-white/10 hover:border-amber-500/30 hover:text-amber-500 flex items-center gap-2 transition-all active:scale-95"
            >
              📋 Copy
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase px-6 py-2 rounded-xl transition-all hover:scale-[1.05] active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              🚀 Finalize
            </button>
          </div>
        </div>
        
        <div className="flex-1 glass-card rounded-3xl p-8 overflow-y-auto custom-scrollbar border-white/5 relative group/draft">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
          {draftText ? (
            <div className="relative font-serif text-slate-200 text-lg leading-[2] animate-fade-in drop-shadow-sm">
              {draftText}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4 opacity-30 text-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>
               <p className="text-sm font-bold uppercase tracking-widest italic animate-pulse">Awaiting Cognitive Input...</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-600">
           <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Drafting Real-time
           </div>
           <div>MCD-SEC-DASHBOARD</div>
        </div>
      </div>
    </div>
  );
}
