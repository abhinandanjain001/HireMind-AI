import React, { useState, useEffect } from "react";
import { 
  Users, 
  Briefcase, 
  Sparkles, 
  TrendingUp, 
  Presentation, 
  HelpCircle, 
  ShieldAlert, 
  Layers, 
  Zap, 
  Download,
  Terminal,
  Activity,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

import { AnalyzedJD, SourcingAnalytics } from "./types";
import Dashboard from "./components/Dashboard";
import JDAnalyzer from "./components/JDAnalyzer";
import CandidateList from "./components/CandidateList";
import CandidateDetails from "./components/CandidateDetails";
import CandidateCompare from "./components/CandidateCompare";
import AnalyticsCharts from "./components/AnalyticsCharts";
import Documentation from "./components/Documentation";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active Job Description Sourcing criteria
  const [activeJD, setActiveJD] = useState<AnalyzedJD>({
    title: "Senior Machine Learning Engineer",
    requiredSkills: ["Python", "ML", "SQL", "Spark", "Embeddings"],
    preferredSkills: ["Pinecone", "FAISS", "NLP", "Kubernetes"],
    minExperience: 5,
    education: ["B.E.", "B.Tech", "M.Tech", "M.Sc"],
    locations: ["Hyderabad", "Bangalore", "Gurgaon", "Remote"],
    salaryBudgetMaxLpa: 45,
    certifications: ["AWS", "Google Cloud"],
    industries: ["Software", "Food Delivery", "AI/ML"]
  });

  // Active analytical distribution results
  const [analytics, setAnalytics] = useState<SourcingAnalytics | null>(null);

  // Fetch initial active JD from Server
  useEffect(() => {
    const fetchActiveJD = async () => {
      try {
        const res = await fetch("/api/jd");
        const data = await res.json();
        if (data) {
          setActiveJD(data);
        }
      } catch (err) {
        console.error("Error loading server active JD:", err);
      }
    };
    fetchActiveJD();
  }, []);

  // Fetch Sourcing Analytics (refetches automatically whenever activeJD changes)
  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      if (data) {
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Error loading sourcing analytics:", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeJD]);

  // Handle addition/removal of candidates from compare queue (max 3)
  const handleToggleCompare = (candidateId: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      if (prev.length >= 3) {
        return prev; // Lock ceiling of comparison at 3
      }
      return [...prev, candidateId];
    });
  };

  const handleJDUpdated = (newJD: AnalyzedJD) => {
    setActiveJD(newJD);
    // Back to dashboard to review updated scoring stats
    setActiveTab("dashboard");
    setSelectedCandidateId(null);
  };

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
  };

  const handleNavigate = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedCandidateId(null);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-200">
      
      {/* Sidebar Navigation (Large Screens) */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/20 border-r border-white/5 p-5 flex flex-col justify-between backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:shrink-0`}>
        
        <div className="space-y-6">
          {/* Platform Logo */}
          <div className="flex items-center gap-2 px-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Zap className="w-4 h-4 text-white stroke-[2.5px]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">REDROB</span>
              <span className="text-[9px] font-mono text-cyan-400 block uppercase font-light tracking-[0.2em] mt-0.5">AI Intelligence</span>
            </div>
          </div>

          {/* Sourcing State KPIs in sidebar */}
          <div className="bg-gradient-to-br from-cyan-950/30 to-slate-900 border border-white/10 rounded-2xl p-4 space-y-3">
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block font-semibold tracking-wider">Active Sourcing Criteria</span>
              <div className="text-xs font-semibold text-slate-200 line-clamp-1 mt-0.5">{activeJD.title}</div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] font-mono text-cyan-400 font-bold">
                <span>Processing Load</span>
                <span>68%</span>
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: "68%" }}></div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
              <span>100k profiles synced</span>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1">
            <button
              onClick={() => handleNavigate("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all border cursor-pointer ${
                activeTab === "dashboard" && !selectedCandidateId
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Layers className="w-4 h-4" />
              Sourcing Overview
            </button>

            <button
              onClick={() => handleNavigate("jd")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all border cursor-pointer ${
                activeTab === "jd"
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Gemini JD Analyzer
            </button>

            <button
              onClick={() => handleNavigate("candidates")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all border cursor-pointer ${
                (activeTab === "candidates" || selectedCandidateId)
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              Candidate Directory
            </button>

            <button
              onClick={() => handleNavigate("compare")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all border cursor-pointer ${
                activeTab === "compare"
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>Candidate Comparison</span>
              </div>
              {selectedCompareIds.length > 0 && (
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 px-1.5 py-0.5 rounded-full font-bold">
                  {selectedCompareIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavigate("analytics")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all border cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Sourcing Analytics
            </button>

            <button
              onClick={() => handleNavigate("documentation")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all border cursor-pointer ${
                activeTab === "documentation"
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                  : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Presentation className="w-4 h-4" />
              Interactive PPT Deck
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/5 pt-4 space-y-3.5">
          <div className="flex items-center gap-2.5 px-1.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-300 block">Sourcing Node</span>
              <span className="text-[9px] font-mono text-cyan-400 font-bold block">Online - Port 3000</span>
            </div>
          </div>
          
          <div className="text-[10px] font-mono text-slate-500 text-center block">
            © 2026 Redrob Sourcing
          </div>
        </div>
      </aside>

      {/* Main Panel Frame (100vh scrolling) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Navigation Header Ticker */}
        <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-xl border border-white/10 text-slate-300 md:hidden hover:bg-white/5 hover:text-white cursor-pointer"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-slate-300">FAISS Cluster-A Active</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-slate-300 font-mono text-[10px] hidden md:block">
              Uptime: <span className="text-cyan-400 font-bold">100%</span>
            </div>
            
            <a 
              href="/api/export/csv"
              download="submission.csv"
              className="bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Sourced CSV
            </a>
          </div>
        </header>

        {/* Content Body Scroll block */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Main Dossier view override takes priority if active */}
          {selectedCandidateId ? (
            <CandidateDetails 
              candidateId={selectedCandidateId} 
              onBackToList={() => setSelectedCandidateId(null)} 
            />
          ) : (
            <>
              {activeTab === "dashboard" && (
                <Dashboard 
                  activeJD={activeJD} 
                  totalShortlisted={100} 
                  onJDUpdated={handleJDUpdated} 
                  onNavigate={handleNavigate}
                />
              )}

              {activeTab === "jd" && (
                <JDAnalyzer 
                  activeJD={activeJD} 
                  onJDUpdated={handleJDUpdated} 
                />
              )}

              {activeTab === "candidates" && (
                <CandidateList 
                  onSelectCandidate={handleSelectCandidate} 
                  selectedCompareIds={selectedCompareIds} 
                  onToggleCompare={handleToggleCompare}
                />
              )}

              {activeTab === "compare" && (
                <CandidateCompare 
                  compareIds={selectedCompareIds} 
                  onToggleCompare={handleToggleCompare} 
                  onSelectCandidate={handleSelectCandidate}
                />
              )}

              {activeTab === "analytics" && analytics && (
                <AnalyticsCharts 
                  data={analytics} 
                />
              )}

              {activeTab === "documentation" && (
                <Documentation />
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}
