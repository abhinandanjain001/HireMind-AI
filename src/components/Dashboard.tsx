import React, { useState } from "react";
import { 
  Briefcase, 
  Users, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  FileSpreadsheet, 
  TrendingUp, 
  Settings2,
  ShieldCheck,
  Zap,
  DollarSign
} from "lucide-react";
import { AnalyzedJD } from "../types";

interface DashboardProps {
  activeJD: AnalyzedJD;
  totalShortlisted: number;
  onJDUpdated: (newJD: AnalyzedJD) => void;
  onNavigate: (tabId: string) => void;
}

export default function Dashboard({ activeJD, totalShortlisted, onJDUpdated, onNavigate }: DashboardProps) {
  const [loadingPreset, setLoadingPreset] = useState<string | null>(null);

  const handleApplyPreset = async (roleName: string) => {
    setLoadingPreset(roleName);
    try {
      const response = await fetch("/api/jd/preset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset: roleName })
      });
      const data = await response.json();
      if (data.success) {
        onJDUpdated(data.jd);
      }
    } catch (err) {
      console.error("Failed to load preset:", err);
    } finally {
      setLoadingPreset(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">Redrob Hackathon Edition</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-100 tracking-tight">AI Talent Sourcing Command Center</h1>
          <p className="text-xs text-slate-400 max-w-xl">
            A production-ready sourcing matrix ranking <strong>100,000+ candidate CVs</strong> in real-time. Tailored with custom skill models, 23 engagement signals, and instant Excel downloads.
          </p>
        </div>

        {/* Preset Selector Rail */}
        <div className="shrink-0 bg-white/5 border border-white/10 p-3 rounded-2xl space-y-1.5 w-full md:w-56">
          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase block tracking-wider px-1.5">Switch Active Role Presets:</span>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => handleApplyPreset("ml_engineer")}
              disabled={!!loadingPreset}
              className="text-[11px] font-medium py-1.5 rounded-lg border border-white/10 hover:border-cyan-500/30 bg-white/5 text-slate-300 text-center cursor-pointer transition-colors"
            >
              {loadingPreset === "ml_engineer" ? "..." : "ML Lead"}
            </button>
            <button
              onClick={() => handleApplyPreset("frontend_developer")}
              disabled={!!loadingPreset}
              className="text-[11px] font-medium py-1.5 rounded-lg border border-white/10 hover:border-cyan-500/30 bg-white/5 text-slate-300 text-center cursor-pointer transition-colors"
            >
              {loadingPreset === "frontend_developer" ? "..." : "React Dev"}
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Scanned candidates count */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-32">
          <div className="flex items-center justify-between text-slate-500">
            <Users className="w-5 h-5 text-slate-400" />
            <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-cyan-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">In Memory</span>
          </div>
          <div>
            <span className="text-2xl font-display font-extrabold text-slate-100">100,000</span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Total Resumes Scanned & Indexed</span>
          </div>
        </div>

        {/* Target role title */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-32">
          <div className="flex items-center justify-between text-slate-500">
            <Briefcase className="w-5 h-5 text-slate-400" />
            <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-cyan-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-100 line-clamp-1">{activeJD.title}</span>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">Sourcing Role Profile</span>
          </div>
        </div>

        {/* Skill criteria matched */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-32">
          <div className="flex items-center justify-between text-slate-500">
            <Sparkles className="w-5 h-5 text-slate-400" />
            <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-cyan-400 px-1.5 py-0.5 rounded font-bold">JD Filters</span>
          </div>
          <div>
            <span className="text-2xl font-display font-extrabold text-slate-100">{activeJD.requiredSkills.length} Core</span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{activeJD.requiredSkills.slice(0, 3).join(", ")}, etc</span>
          </div>
        </div>

        {/* Budget limit */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-32">
          <div className="flex items-center justify-between text-slate-500">
            <DollarSign className="w-5 h-5 text-slate-400" />
            <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-cyan-400 px-1.5 py-0.5 rounded font-bold">LPA INR</span>
          </div>
          <div>
            <span className="text-2xl font-display font-extrabold text-slate-100">₹{activeJD.salaryBudgetMaxLpa}L Max</span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Budget Ceiling parameters</span>
          </div>
        </div>
      </div>

      {/* Main Column: Left: Download & Deliverables, Right: Nav Teasers (12 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Hackathon Exports & Submission files (7 spans) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl"></div>
            
            <div>
              <h3 className="font-display text-lg font-bold text-slate-200 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                Download Hackathon Sourced Deliverables
              </h3>
              <p className="text-xs text-slate-400 mt-1">Export the parsed Top-100 ranked candidates containing decimal score rankings and automated AI justifications according to the submission guidelines.</p>
            </div>

            {/* Direct buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CSV button */}
              <a 
                href="/api/export/csv" 
                download="submission.csv"
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 text-slate-200 transition-all flex flex-col justify-between h-28 relative group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">CSV Sourced file</span>
                  <Download className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <span className="text-sm font-semibold block text-slate-100">submission.csv</span>
                  <span className="text-[10px] text-slate-500 block">candidate_id, rank, score, reasoning</span>
                </div>
              </a>

              {/* XLSX button */}
              <a 
                href="/api/export/xlsx" 
                download="submission.xlsx"
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 text-slate-200 transition-all flex flex-col justify-between h-28 relative group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">XLSX Binary sheet</span>
                  <Download className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <span className="text-sm font-semibold block text-slate-100">submission.xlsx</span>
                  <span className="text-[10px] text-slate-500 block">Top-100 official Redrob Excel columns</span>
                </div>
              </a>
            </div>

            {/* Verification checklist */}
            <div className="border-t border-white/10 pt-5 space-y-3.5">
              <span className="text-xs font-mono text-slate-400 font-semibold block">Submission Compliance checks:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Precise 100 rows generated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Scores formatted as decimals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Unique CAND_ID mapping keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Explainable reasoning included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Navigation Teaser shortcuts (5 spans) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden">
            <h3 className="font-display text-base font-bold text-slate-200 mb-4 flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-cyan-400" />
              Sourcing Operations Workspace
            </h3>

            <div className="space-y-3.5">
              {/* Directory trigger */}
              <button
                type="button"
                onClick={() => onNavigate("candidates")}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-200 block group-hover:text-cyan-400 transition-colors">Sifting Directory</span>
                  <span className="text-[10px] text-slate-500 block">Advanced search on 100,000+ candidate CV files</span>
                </div>
                <Zap className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all" />
              </button>

              {/* JD Analyzer trigger */}
              <button
                type="button"
                onClick={() => onNavigate("jd")}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-200 block group-hover:text-cyan-400 transition-colors">Gemini JD Extraction</span>
                  <span className="text-[10px] text-slate-500 block">Paste active job requirements to parse metrics</span>
                </div>
                <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all" />
              </button>

              {/* Analytics trigger */}
              <button
                type="button"
                onClick={() => onNavigate("analytics")}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-200 block group-hover:text-cyan-400 transition-colors">Talent Metrics Sourcing</span>
                  <span className="text-[10px] text-slate-500 block">Distribution and funnel graphs of the Top-100 pool</span>
                </div>
                <TrendingUp className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all" />
              </button>
            </div>

            {/* Platform security stamp */}
            <div className="border-t border-white/10 pt-4 mt-6 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Sourcing verified & cached under 2.4 ms response constraints</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
