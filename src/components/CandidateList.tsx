import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  CheckSquare, 
  Square,
  Award,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  User,
  ArrowUpDown,
  FileCheck,
  Percent,
  TrendingUp,
  Zap,
  Globe
} from "lucide-react";
import { HydratedRanking } from "../types";

interface CandidateListProps {
  onSelectCandidate: (candidateId: string) => void;
  selectedCompareIds: string[];
  onToggleCompare: (candidateId: string) => void;
}

export default function CandidateList({ onSelectCandidate, selectedCompareIds, onToggleCompare }: CandidateListProps) {
  // Query States
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [minExp, setMinExp] = useState(0);
  const [maxSalary, setMaxSalary] = useState(150);
  const [minBehavior, setMinBehavior] = useState(0);
  const [minSemantic, setMinSemantic] = useState(0);
  const [sortBy, setSortBy] = useState("score");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Response States
  const [candidates, setCandidates] = useState<HydratedRanking[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch candidates from API on query change
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          search,
          skill,
          company,
          location,
          education,
          minExp: String(minExp),
          maxSalary: String(maxSalary),
          minBehavior: String(minBehavior),
          minSemantic: String(minSemantic),
          sortBy
        });
        
        const response = await fetch(`/api/candidates?${queryParams.toString()}`);
        const data = await response.json();
        setCandidates(data.results || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching ranked candidates:", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce fast typing
    const delayDebounce = setTimeout(() => {
      fetchCandidates();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [page, search, skill, company, location, education, minExp, maxSalary, minBehavior, minSemantic, sortBy]);

  // Reset page when filters change
  const handleFilterChange = (setter: any, value: any) => {
    setter(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSkill("");
    setCompany("");
    setLocation("");
    setEducation("");
    setMinExp(0);
    setMaxSalary(150);
    setMinBehavior(0);
    setMinSemantic(0);
    setSortBy("score");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search and Sort Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 font-sans"
            placeholder="Search by name, title, or CAND_ID..."
            value={search}
            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
          />
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Advanced Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              showFilters || skill || company || location || education || minExp > 0 || maxSalary < 150 || minBehavior > 0 || minSemantic > 0
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:border-slate-700"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Advanced Filters
          </button>

          {/* Sort Menu */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              className="bg-transparent border-none text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer pr-4"
              value={sortBy}
              onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
            >
              <option value="score" className="bg-[#0b1224] text-slate-300">Final AI Score</option>
              <option value="behaviorScore" className="bg-[#0b1224] text-slate-300">On-Platform Behavior</option>
              <option value="semanticScore" className="bg-[#0b1224] text-slate-300">Semantic Match</option>
              <option value="experience" className="bg-[#0b1224] text-slate-300">Years of Experience</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {(showFilters || skill || company || location || education || minExp > 0 || maxSalary < 150 || minBehavior > 0 || minSemantic > 0) && (
        <div className="glass-panel p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleResetFilters}
              className="text-[10px] font-mono font-semibold text-rose-300 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Filter by Skill Name:</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
              placeholder="e.g. PyTorch, React, SQL..."
              value={skill}
              onChange={(e) => handleFilterChange(setSkill, e.target.value)}
            />
          </div>

          {/* Company Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Filter by Company Name:</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
              placeholder="e.g. Mindtree, Wipro, TCS..."
              value={company}
              onChange={(e) => handleFilterChange(setCompany, e.target.value)}
            />
          </div>

          {/* Location Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Filter by Location City:</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
              placeholder="e.g. Bangalore, London, New York..."
              value={location}
              onChange={(e) => handleFilterChange(setLocation, e.target.value)}
            />
          </div>

          {/* Education Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">School / Degree:</label>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
              placeholder="e.g. IIT, master, Ph.D..."
              value={education}
              onChange={(e) => handleFilterChange(setEducation, e.target.value)}
            />
          </div>

          {/* Experience Range */}
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Min Experience: {minExp} Yrs</label>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              value={minExp}
              onChange={(e) => handleFilterChange(setMinExp, parseInt(e.target.value))}
            />
          </div>

          {/* Salary Ceiling */}
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Max Salary Budget: ₹{maxSalary} LPA</label>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              value={maxSalary}
              onChange={(e) => handleFilterChange(setMaxSalary, parseInt(e.target.value))}
            />
          </div>

          {/* Min Behavior Score */}
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Min Behavior Score: {minBehavior}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              value={minBehavior}
              onChange={(e) => handleFilterChange(setMinBehavior, parseInt(e.target.value))}
            />
          </div>

          {/* Min Semantic Match */}
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Min Semantic Score: {minSemantic}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              value={minSemantic}
              onChange={(e) => handleFilterChange(setMinSemantic, parseInt(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Comparison Drawer Indicator */}
      {selectedCompareIds.length > 0 && (
        <div className="bg-[#0b1224]/80 backdrop-blur-md border border-cyan-500/20 p-4 rounded-xl flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs text-slate-300 font-medium">
              <span className="font-bold text-cyan-400">{selectedCompareIds.length}</span> candidates added to comparison queue.
            </span>
          </div>
          <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            Go to Comparison tab to view side-by-side
          </span>
        </div>
      )}

      {/* Grid of Candidates (3 cards per row on large, responsive) */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-cyan-500 animate-spin"></div>
          <p className="text-sm font-mono text-slate-500">Analyzing matching indexes...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl">
          <p className="text-sm text-slate-500">No candidates match your current search constraints.</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:border-cyan-500/30 cursor-pointer"
          >
            Clear Search Criteria
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((item) => {
            const isCompareChecked = selectedCompareIds.includes(item.candidate_id);
            const isTop3 = item.rank <= 3;
            const rankLabel = isTop3 
              ? item.rank === 1 ? "🥇 Rank 1" : item.rank === 2 ? "🥈 Rank 2" : "🥉 Rank 3" 
              : `#${item.rank}`;

            return (
              <div 
                key={item.candidate_id}
                className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between h-full relative"
              >
                {/* Upper row: Rank and Compare Checkbox */}
                <div className="flex items-center justify-between mb-3.5">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                    isTop3 
                      ? "bg-amber-400/10 border-amber-500/20 text-amber-400" 
                      : "bg-white/5 border-white/10 text-slate-400"
                  }`}>
                    {rankLabel}
                  </span>

                  {/* Add to Compare button */}
                  <button
                    type="button"
                    onClick={() => onToggleCompare(item.candidate_id)}
                    className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer p-1"
                    title={isCompareChecked ? "Remove from comparison" : "Add to comparison"}
                  >
                    {isCompareChecked ? (
                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Candidate Summary */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display font-bold text-base text-slate-100 line-clamp-1 hover:underline cursor-pointer" onClick={() => onSelectCandidate(item.candidate_id)}>
                        {item.name}
                      </h4>
                      <p className="text-xs text-cyan-400 font-mono line-clamp-1 mt-0.5">{item.headline}</p>
                    </div>

                    {/* Circular Progress score */}
                    <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10">
                      <div className="absolute inset-0.5 rounded-full border border-dashed border-cyan-500/20 animate-spin" style={{ animationDuration: '20s' }}></div>
                      <span className="text-[13px] font-display font-bold text-slate-200">
                        {Math.round(item.score)}
                      </span>
                    </div>
                  </div>

                  {/* Tags Row */}
                  <div className="flex flex-wrap gap-1">
                    {item.open_to_work && (
                      <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium">
                        <Zap className="w-2.5 h-2.5" />
                        Open to Work
                      </span>
                    )}
                    {item.notice_period_days <= 30 && (
                      <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-medium">
                        Immediate Joiner
                      </span>
                    )}
                  </div>
                </div>

                {/* Core Sourcing attributes */}
                <div className="border-t border-white/10 pt-3.5 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{item.current_company} • {item.years_of_experience} yrs exp</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{item.notice_period_days}D Notice</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Max expected: ₹{item.expected_salary_range.max} LPA</span>
                    </div>
                    <span className="text-[11px] font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded capitalize">{item.preferred_work_mode}</span>
                  </div>
                </div>

                {/* Skills tags list */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {item.skills.map((skill, index) => (
                    <span key={index} className="text-[10px] text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* AI Reasoning summary footer */}
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 line-clamp-1 w-2/3">
                    {item.reasoning}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => onSelectCandidate(item.candidate_id)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    View Sourcing Profile
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-xs text-slate-500 font-mono">
            Showing <span className="text-slate-300 font-bold">{(page - 1) * limit + 1}</span> to{" "}
            <span className="text-slate-300 font-bold">{Math.min(page * limit, total)}</span> of{" "}
            <span className="text-slate-300 font-bold">{total.toLocaleString()}</span> shortlisted candidates
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                page === 1
                  ? "border-white/5 text-slate-700 cursor-not-allowed"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400">
              Page <span className="text-slate-200 font-semibold">{page}</span> of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                page === totalPages
                  ? "border-white/5 text-slate-700 cursor-not-allowed"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
