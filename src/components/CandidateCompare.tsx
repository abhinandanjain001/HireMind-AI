import React, { useState, useEffect } from "react";
import { 
  Users, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  User, 
  DollarSign, 
  Clock, 
  MapPin, 
  ChevronRight 
} from "lucide-react";

interface CompareCandidate {
  candidate_id: string;
  name: string;
  headline: string;
  score: number;
  skillScore: number;
  experienceScore: number;
  behaviorScore: number;
  educationScore: number;
  certificationScore: number;
  salaryMax: number;
  noticeDays: number;
  preferredMode: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  reasoning: string;
}

interface CandidateCompareProps {
  compareIds: string[];
  onToggleCompare: (candidateId: string) => void;
  onSelectCandidate: (candidateId: string) => void;
}

export default function CandidateCompare({ compareIds, onToggleCompare, onSelectCandidate }: CandidateCompareProps) {
  const [compared, setCompared] = useState<CompareCandidate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompared = async () => {
      if (compareIds.length === 0) {
        setCompared([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("/api/candidates/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: compareIds })
        });
        const result = await response.json();
        setCompared(result);
      } catch (err) {
        console.error("Failed to load compared candidates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompared();
  }, [compareIds]);

  if (compareIds.length === 0) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl max-w-2xl mx-auto my-12 border border-white/10">
        <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="font-display text-lg font-bold text-slate-300">Compare Candidates Side-by-Side</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          Add up to 3 candidates from the Candidate Directory tab by checking the box on their profile cards to run deep, side-by-side matrices.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-cyan-500 animate-spin"></div>
        <p className="text-sm font-mono text-slate-500">Aligning comparison matrices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Candidate Comparison Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1"> Juxtaposes profiles, matching subscores, expected budgets, and sourcing recommendations.</p>
        </div>
        <span className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-bold">
          {compareIds.length} / 3 Candidates Sourced
        </span>
      </div>

      {/* Grid Table Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {compared.map((candidate) => (
          <div key={candidate.candidate_id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-full relative border border-white/10 hover:border-cyan-500/30 transition-all">
            {/* Trash button */}
            <button
              onClick={() => onToggleCompare(candidate.candidate_id)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
              title="Remove from comparison"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Header info */}
            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-mono text-slate-500 font-bold block">{candidate.candidate_id}</span>
              <h3 
                className="font-display text-lg font-bold text-slate-200 line-clamp-1 hover:underline cursor-pointer"
                onClick={() => onSelectCandidate(candidate.candidate_id)}
              >
                {candidate.name}
              </h3>
              <p className="text-xs text-cyan-400 font-mono font-medium line-clamp-1">{candidate.headline}</p>

              {/* Hires / recommendation metrics */}
              <div className="flex items-center gap-3 pt-2">
                <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-center shrink-0">
                  <span className="text-xs font-mono text-slate-500 block uppercase text-[8px]">Score</span>
                  <span className="text-lg font-display font-extrabold text-slate-200">{Math.round(candidate.score)}</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Recommendation</span>
                  <span className={`text-xs font-bold ${candidate.recommendation.includes("Strong Hire") ? "text-cyan-400" : "text-blue-400"}`}>
                    {candidate.recommendation}
                  </span>
                </div>
              </div>
            </div>

            {/* Subscores Grid */}
            <div className="space-y-3 border-t border-white/10 py-4">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Matching Index</h4>
              
              {/* Skill score */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                  <span>Skill Match Matrix</span>
                  <span>{Math.round(candidate.skillScore)}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${candidate.skillScore}%` }}></div>
                </div>
              </div>

              {/* Experience score */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                  <span>Experience Alignment</span>
                  <span>{Math.round(candidate.experienceScore)}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${candidate.experienceScore}%` }}></div>
                </div>
              </div>

              {/* Behavior score */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                  <span>Redrob Behavioral Index</span>
                  <span>{Math.round(candidate.behaviorScore)}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${candidate.behaviorScore}%` }}></div>
                </div>
              </div>

              {/* Education score */}
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                  <span>Educational Prestige</span>
                  <span>{Math.round(candidate.educationScore)}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${candidate.educationScore}%` }}></div>
                </div>
              </div>
            </div>

            {/* Logistics matrix */}
            <div className="border-t border-white/10 py-4 space-y-2 text-xs text-slate-400">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold mb-1">Logistics Match</h4>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> Notice period</span>
                <span className={`font-mono font-semibold ${candidate.noticeDays <= 30 ? "text-cyan-400" : "text-slate-200"}`}>{candidate.noticeDays} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-slate-500" /> Expected Salary</span>
                <span className="font-mono font-semibold text-slate-200">Max ₹{candidate.salaryMax} LPA</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> Preference</span>
                <span className="font-mono font-semibold text-slate-200 capitalize">{candidate.preferredMode}</span>
              </div>
            </div>

            {/* Strengths & Weaknesses list */}
            <div className="border-t border-white/10 py-4 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold mb-2">Strengths:</span>
                <ul className="space-y-1.5">
                  {candidate.strengths.slice(0, 2).map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-tight">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold mb-2">Caveats:</span>
                <ul className="space-y-1.5">
                  {candidate.weaknesses.slice(0, 2).map((weak, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5 leading-tight">
                      <XCircle className="w-3.5 h-3.5 text-rose-500/80 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Foot view action */}
            <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 line-clamp-1 w-2/3">
                {candidate.reasoning}
              </span>
              <button
                type="button"
                onClick={() => onSelectCandidate(candidate.candidate_id)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                Profile
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
