"use client";

export default function RecentIngestions() {
  const recentFiles = [
    { name: "MCD_Sanitation_Bylaws_2023.pdf", date: "2 mins ago", chunks: 42 },
    { name: "Property_Tax_Directive_Zone_3.pdf", date: "1 hour ago", chunks: 18 },
    { name: "Ward_Officer_SOP.pdf", date: "Yesterday", chunks: 125 }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border-white/5 mt-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3 font-display">
        <span className="w-4 h-4 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 text-[10px]">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25" /></svg>
        </span>
        Registry Archive
      </h3>
      
      <div className="space-y-4">
        {recentFiles.map((file, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group/item">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover/item:text-blue-400 group-hover/item:bg-blue-500/10 transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200 truncate max-w-[180px] tracking-tight">{file.name}</span>
                <span className="text-[10px] font-medium text-slate-500">{file.date}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/10">{file.chunks} SEC_CHUNKS</span>
               <span className="text-[8px] font-bold text-emerald-500 uppercase mt-1">VERIFIED</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest glass-card border-white/5 rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
        Access Complete Vector Vault
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
      </button>
    </div>
  );
}
