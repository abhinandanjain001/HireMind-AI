import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  GraduationCap, 
  CheckCircle2, 
  Award, 
  Settings,
  HelpCircle,
  UploadCloud,
  Check
} from "lucide-react";
import { AnalyzedJD } from "../types";

interface JDAnalyzerProps {
  activeJD: AnalyzedJD;
  onJDUpdated: (newJD: AnalyzedJD) => void;
}

export default function JDAnalyzer({ activeJD, onJDUpdated }: JDAnalyzerProps) {
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState("ml_engineer");
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);

  const handlePresetSelect = async (presetName: string) => {
    setLoading(true);
    setActivePreset(presetName);
    setAnalysisStatus("Loading preset criteria...");
    try {
      const response = await fetch("/api/jd/preset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset: presetName })
      });
      const data = await response.json();
      if (data.success) {
        onJDUpdated(data.jd);
        setAnalysisStatus("Preset loaded successfully!");
        setTimeout(() => setAnalysisStatus(null), 2500);
      }
    } catch (err) {
      console.error("Failed to load preset:", err);
      setAnalysisStatus("Failed to apply preset.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeText = async () => {
    if (!jdText.trim()) return;
    setLoading(true);
    setAnalysisStatus("Sourcing Gemini AI context engines...");
    try {
      const response = await fetch("/api/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText })
      });
      const data = await response.json();
      if (data.success) {
        onJDUpdated(data.jd);
        setAnalysisStatus(data.fallback ? "Rule-based analysis parsed." : "Gemini analysis structured!");
        setTimeout(() => setAnalysisStatus(null), 3000);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalysisStatus("Failed to query analysis endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: JD Sourcing Entry (7 spans) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl"></div>
          
          <h2 className="font-display text-xl font-bold mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Job Description Analyzer
          </h2>
          <p className="text-xs text-slate-400 mb-6">Paste a Job Description (JD) below to let Gemini analyze required credentials and update candidate rankings instantly.</p>

          {/* Quick Presets */}
          <div className="mb-6">
            <span className="text-xs text-slate-400 font-medium block mb-2">Sourcing Role Quick Presets:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handlePresetSelect("ml_engineer")}
                disabled={loading}
                className={`text-xs px-3 py-2 rounded-lg font-medium border transition-all cursor-pointer ${
                  activePreset === "ml_engineer"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-slate-700"
                }`}
              >
                ML Engineer
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect("frontend_developer")}
                disabled={loading}
                className={`text-xs px-3 py-2 rounded-lg font-medium border transition-all cursor-pointer ${
                  activePreset === "frontend_developer"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-slate-700"
                }`}
              >
                Frontend Developer
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect("devops_architect")}
                disabled={loading}
                className={`text-xs px-3 py-2 rounded-lg font-medium border transition-all cursor-pointer ${
                  activePreset === "devops_architect"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-slate-700"
                }`}
              >
                DevOps Lead
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect("finance_accountant")}
                disabled={loading}
                className={`text-xs px-3 py-2 rounded-lg font-medium border transition-all cursor-pointer ${
                  activePreset === "finance_accountant"
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-slate-700"
                }`}
              >
                Lead Accountant
              </button>
            </div>
          </div>

          {/* JD Input Area */}
          <div className="space-y-4">
            <textarea
              className="w-full h-80 bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 resize-none font-sans"
              placeholder="Paste job description requirements, responsibilities, and expected competencies here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              disabled={loading}
            ></textarea>

            {/* Drag & Drop Upload Mock */}
            <div className="border border-dashed border-white/10 hover:border-cyan-500/30 rounded-xl p-6 text-center bg-white/5 transition-all cursor-pointer">
              <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-300">Drag and drop JD files (.pdf, .docx, .txt)</p>
              <p className="text-[10px] text-slate-600 mt-1">Files are parsed locally via secure server OCR</p>
            </div>

            {/* Sourcing Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                {analysisStatus ? (
                  <span className="text-cyan-400 animate-pulse">{analysisStatus}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>In-memory scoring ready</span>
                  </>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleAnalyzeText}
                disabled={loading || !jdText.trim()}
                className={`px-5 py-2.5 rounded-xl font-display font-medium text-sm flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
                  loading || !jdText.trim()
                    ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-100 font-semibold shadow-cyan-500/10"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {loading ? "Analyzing..." : "Analyze with Gemini AI"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: AI Extraction Results (5 spans) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-panel p-6 rounded-2xl h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
          
          <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2 text-slate-200 border-b border-white/10 pb-3">
            <Settings className="w-4 h-4 text-cyan-400" />
            AI Sourced Filters
          </h3>

          <div className="space-y-5">
            {/* Job Title */}
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Target Role Title:</span>
              <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400 shrink-0" />
                {activeJD.title}
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Required Skills (100% Weight):</span>
              <div className="flex flex-wrap gap-1.5">
                {activeJD.requiredSkills.map((skill, index) => (
                  <span key={index} className="text-xs bg-white/5 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                    <Check className="w-3 h-3 shrink-0 text-cyan-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            {activeJD.preferredSkills.length > 0 && (
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Preferred Competencies (Bonus Weight):</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeJD.preferredSkills.map((skill, index) => (
                    <span key={index} className="text-xs bg-white/5 text-blue-400 border border-blue-500/10 px-2.5 py-1 rounded-md font-medium">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience & Salary Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Min Experience:</span>
                <div className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                  {activeJD.minExperience}+ Years
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Max Budget LPA:</span>
                <div className="text-sm font-semibold text-slate-200 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-cyan-400 shrink-0" />
                  ₹{activeJD.salaryBudgetMaxLpa} LPA
                </div>
              </div>
            </div>

            {/* Target Locations */}
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">Target Locations:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeJD.locations.map((loc, idx) => (
                  <span key={idx} className="text-xs bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* Education alignment */}
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">Target Academic Credentials:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeJD.education.map((edu, idx) => (
                  <span key={idx} className="text-xs bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    {edu}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications & Industries */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">Certifications:</span>
                <div className="flex flex-wrap gap-1">
                  {activeJD.certifications.length > 0 ? (
                    activeJD.certifications.map((c, i) => (
                      <span key={i} className="text-[11px] text-slate-300 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">{c}</span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None Specified</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">Industries:</span>
                <div className="flex flex-wrap gap-1">
                  {activeJD.industries.map((ind, i) => (
                    <span key={i} className="text-[11px] text-slate-300 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">{ind}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
