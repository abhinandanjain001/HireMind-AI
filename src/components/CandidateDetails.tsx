import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Zap, 
  CheckCircle2, 
  XCircle,
  FileCheck,
  TrendingUp,
  Mail,
  Phone,
  Linkedin,
  Github,
  Calendar,
  Eye,
  Bookmark,
  Users
} from "lucide-react";
import { Candidate, ScoreBreakdown } from "../types";

interface CandidateDetailsProps {
  candidateId: string;
  onBackToList: () => void;
}

export default function CandidateDetails({ candidateId, onBackToList }: CandidateDetailsProps) {
  const [data, setData] = useState<{ candidate: Candidate; score: ScoreBreakdown } | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch candidate core data
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/candidates/${candidateId}`);
        const result = await response.json();
        setData(result);
        
        // Lazy load AI explanation
        fetchAiExplanation();
      } catch (err) {
        console.error("Error fetching candidate details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [candidateId]);

  // Fetch AI explanation
  const fetchAiExplanation = async () => {
    setAiLoading(true);
    try {
      const response = await fetch(`/api/candidates/${candidateId}/ai-explanation`);
      const result = await response.json();
      setAiExplanation(result.explanation);
    } catch (err) {
      console.error("Error fetching AI explanation:", err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-cyan-500 animate-spin"></div>
        <p className="text-sm font-mono text-slate-500">Hydrating candidate dossier...</p>
      </div>
    );
  }

  const { candidate, score } = data;
  const s = candidate.redrob_signals;

  return (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToList}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:border-cyan-500/30 text-slate-300 flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to shortlists
        </button>

        <span className="text-xs font-mono text-slate-500">
          Dossier ID: <span className="text-cyan-400 font-bold">{candidate.candidate_id}</span>
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
        
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-slate-100">{candidate.profile.anonymized_name}</h2>
            {s.open_to_work_flag && (
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-semibold uppercase tracking-wider flex items-center gap-0.5">
                <Zap className="w-3 h-3" />
                Active Sourcing
              </span>
            )}
            {s.notice_period_days <= 30 && (
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                Immediate Joiner
              </span>
            )}
          </div>
          
          <p className="text-sm font-semibold text-cyan-400 font-mono">{candidate.profile.headline}</p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>{candidate.profile.location}, {candidate.profile.country}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{candidate.profile.years_of_experience} Years Exp ({candidate.profile.current_industry})</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-slate-500" />
              <span>Expected Salary: ₹{s.expected_salary_range_inr_lpa.min} - ₹{s.expected_salary_range_inr_lpa.max} LPA</span>
            </div>
          </div>
        </div>

        {/* Big AI Score Circle */}
        <div className="shrink-0 flex items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl gap-4">
          <div className="text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Hiring Score</span>
            <span className="text-4xl font-display font-extrabold text-cyan-400">{Math.round(score.score)}</span>
            <span className="text-[10px] font-mono text-slate-400 block mt-1 font-semibold">{score.hiringRecommendation}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Dossier Summary, Right subscores & history (12 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: AI Review & Sourcing Signals (5 spans) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Explanation Sourcing dossier */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2 text-slate-200">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              AI Sourcing Explanation
            </h3>

            {aiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-white/5 border-t-cyan-500 animate-spin"></div>
                <p className="text-[11px] font-mono text-slate-500">Querying Gemini Review Models...</p>
              </div>
            ) : aiExplanation ? (
              <div 
                className="text-xs text-slate-300 space-y-3 leading-relaxed border-t border-white/10 pt-4"
                dangerouslySetInnerHTML={{ __html: aiExplanation }}
              ></div>
            ) : (
              <p className="text-xs text-slate-500">No explanation currently generated.</p>
            )}
          </div>

          {/* Sourcing Platform Activity: 23 Redrob behavioral signals */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2 text-slate-200">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Redrob Platform Signals (Behavior)
            </h3>
            
            <div className="space-y-4 border-t border-white/10 pt-4">
              {/* Profile Completion Bar */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                  <span className="text-slate-400 font-medium">Profile Completeness:</span>
                  <span className="text-cyan-400 font-bold">{s.profile_completeness_score}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5 border border-white/10">
                  <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${s.profile_completeness_score}%` }}></div>
                </div>
              </div>

              {/* Grid of Key verification signals */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg text-center">
                  <Mail className={`w-4 h-4 mx-auto mb-1 ${s.verified_email ? "text-cyan-400" : "text-slate-600"}`} />
                  <span className="text-[9px] font-mono text-slate-400 block font-semibold">Email Verified</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg text-center">
                  <Phone className={`w-4 h-4 mx-auto mb-1 ${s.verified_phone ? "text-cyan-400" : "text-slate-600"}`} />
                  <span className="text-[9px] font-mono text-slate-400 block font-semibold">Phone Verified</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg text-center">
                  <Linkedin className={`w-4 h-4 mx-auto mb-1 ${s.linkedin_connected ? "text-cyan-400" : "text-slate-600"}`} />
                  <span className="text-[9px] font-mono text-slate-400 block font-semibold">LinkedIn Sync</span>
                </div>
              </div>

              {/* Flat Sourcing list attributes */}
              <div className="space-y-2.5 text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    Profile views (30D):
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">{s.profile_views_received_30d}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                    Saved by recruiters (30D):
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">{s.saved_by_recruiters_30d}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                    Applications submitted:
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">{s.applications_submitted_30d}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Connection count:
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">{s.connection_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    Interview attendance rate:
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">{Math.round(s.interview_completion_rate * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    Offer acceptance rate:
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">
                    {s.offer_acceptance_rate > 0 ? `${Math.round(s.offer_acceptance_rate * 100)}%` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    Recruiter response rate:
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">{Math.round(s.recruiter_response_rate * 100)}%</span>
                </div>
              </div>

              {/* Sourcing assessment scores if available */}
              {Object.keys(s.skill_assessment_scores || {}).length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Platform Assessed Skills:</span>
                  <div className="space-y-2">
                    {Object.entries(s.skill_assessment_scores).map(([skill, skillScore]) => (
                      <div key={skill} className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">{skill} Assessment:</span>
                        <span className="font-mono text-cyan-400 font-bold">{skillScore} / 100</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Match scores breakdown & career timelines (7 spans) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Match Score Matrix */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2 text-slate-200">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              Sourcing Index Matching Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-4">
              {/* Skills Score */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Skill Alignment Match:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{Math.round(score.skillScore)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 border border-white/10">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${score.skillScore}%` }}></div>
                </div>
              </div>

              {/* Semantic Score */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Semantic CV Overlap:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{Math.round(score.semanticScore)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 border border-white/10">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${score.semanticScore}%` }}></div>
                </div>
              </div>

              {/* Experience Score */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Experience Seniority Curve:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{Math.round(score.experienceScore)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 border border-white/10">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${score.experienceScore}%` }}></div>
                </div>
              </div>

              {/* Education Score */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-400">Educational Prestige Index:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{Math.round(score.educationScore)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 border border-white/10">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${score.educationScore}%` }}></div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Platform Identified Strengths:</span>
                <ul className="space-y-2">
                  {score.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-cyan-300 flex items-start gap-1.5 leading-tight">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Hiring Caveats & Limits:</span>
                <ul className="space-y-2">
                  {score.weaknesses.map((weak, idx) => (
                    <li key={idx} className="text-xs text-rose-300 flex items-start gap-1.5 leading-tight">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Timeline Node Tree: Work Experience */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2 text-slate-200">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Work History Timeline
            </h3>

            <div className="relative border-l border-white/10 pl-5 ml-2.5 space-y-6 pt-2">
              {candidate.career_history.map((hist, idx) => (
                <div key={idx} className="relative">
                  {/* node dot */}
                  <div className={`absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-2 bg-slate-950 ${
                    hist.is_current ? "border-cyan-500" : "border-white/20"
                  }`}></div>
                  
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h4 className="font-display text-sm font-bold text-slate-200">{hist.title}</h4>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {hist.start_date} - {hist.end_date || "Present"} ({hist.duration_months} Mos)
                      </span>
                    </div>
                    
                    <p className="text-xs font-semibold text-cyan-400 font-mono">{hist.company} ({hist.company_size} • {hist.industry})</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{hist.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Education Card */}
            <div className="glass-panel p-6 rounded-2xl">
              <h4 className="font-display text-sm font-bold mb-3 flex items-center gap-2 text-slate-200">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                Education Background
              </h4>
              <div className="space-y-4">
                {candidate.education.map((edu, idx) => (
                  <div key={idx} className="text-xs space-y-1 border-l-2 border-cyan-500/30 pl-3">
                    <div className="font-bold text-slate-300">{edu.institution}</div>
                    <div className="text-slate-400">{edu.degree} in {edu.field_of_study}</div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>{edu.start_year} - {edu.end_year}</span>
                      <span className="text-cyan-400 font-bold">{edu.grade}</span>
                    </div>
                    <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-1 rounded uppercase tracking-wider block w-max font-bold">{edu.tier.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Card */}
            <div className="glass-panel p-6 rounded-2xl">
              <h4 className="font-display text-sm font-bold mb-3 flex items-center gap-2 text-slate-200">
                <Award className="w-4 h-4 text-cyan-400" />
                Certifications Index
              </h4>
              <div className="space-y-3.5">
                {(candidate.certifications || []).length > 0 ? (
                  (candidate.certifications || []).map((cert, idx) => (
                    <div key={idx} className="text-xs space-y-0.5 border-l-2 border-cyan-500/30 pl-3">
                      <div className="font-bold text-slate-300">{cert.name}</div>
                      <div className="text-slate-400">{cert.issuer}</div>
                      <div className="text-[10px] font-mono text-slate-500">{cert.year}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-600 italic py-4">No specific credential files indexed.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
