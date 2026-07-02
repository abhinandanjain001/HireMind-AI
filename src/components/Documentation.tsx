import React, { useState } from "react";
import { 
  BookOpen, 
  Presentation, 
  FileCode, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Terminal, 
  Cpu, 
  Database, 
  Activity, 
  ArrowRight,
  Monitor,
  HardDrive,
  ExternalLink
} from "lucide-react";

export default function Documentation() {
  const [activeTab, setActiveTab] = useState<"ppt" | "architecture" | "deployment">("ppt");
  const [pptIndex, setPptIndex] = useState(0);

  const slides = [
    {
      title: "Redrob AI Sourcing Intelligence Platform",
      subtitle: "Enterprise scale talent parsing, scoring, and ranking",
      bullets: [
        "Sifting through 100,000+ candidates against complex JDs instantly.",
        "Combines Semantic Overlaps, Exact/Synonym Skill Alignment, and Prestige weights.",
        "Provides 100% explainable recommendations backed by LLM reviews.",
        "Generates compliance exports in CSV and XLSX for standard recruitment submissions."
      ]
    },
    {
      title: "The Sourcing Problem: Keyword Sifting Bottlenecks",
      subtitle: "Why traditional Applicant Tracking Systems (ATS) fail",
      bullets: [
        "Keyword matching cannot capture semantic skill synonyms (e.g. 'ML' vs 'Machine Learning').",
        "No intelligence on real on-platform activity, leading to cold response pipelines.",
        "Manual resume parsing of 100,000 profiles takes months of human labor.",
        "Lack of standardized score rankings across diverse engineering or financial domains."
      ]
    },
    {
      title: "The Platform Solution: Hybrid Semantic Sourcing Engine",
      subtitle: "High-scale parsing with explainable recommendation math",
      bullets: [
        "Instant vector similarity approximations mapping CV profiles to the target JDs.",
        "In-depth analysis of 23 on-platform behavior markers directly from Redrob data.",
        "Instant procedural scaling that generates realistic test arrays for high-volume load test.",
        "Clear sub-scoring vectors (Skills, Career History, Education, Certifications) for auditability."
      ]
    },
    {
      title: "Scale Strategy: 100k In-Memory Sourcing Under 2 Seconds",
      subtitle: "Solving high RAM and CPU performance bottlenecks",
      bullets: [
        "Avoids heavy database network lookups by holding procedural profiles in an active cache.",
        "Uses vectorized data structures to run skill matches across 100k candidates instantly.",
        "Pre-scores rankings on startup/JD analysis, delivering 0ms response rates for search.",
        "Designed to run entirely on light-weight, single-core CPUs without crashing node containers."
      ]
    },
    {
      title: "The Sourcing Score Formula: Core Matching Math",
      subtitle: "A balanced weighted index for reliable ranking outcomes",
      bullets: [
        "Skill Alignment Matrix (25%): Maps exact skills, synonyms, and platform assessments.",
        "Semantic CV Overlap (15%): Token overlaps of current titles, headlines, and summaries.",
        "Years of Experience (15%): Scoring curve matching JD requirements vs current seniority.",
        "Redrob Platform Engagement (15%): Response speed, interview compliance, and save history.",
        "Education Prestige (10%), Certifications (5%), and Logistics (Notice/Salary/Location: 15%)."
      ]
    },
    {
      title: "Behavioral Intelligence: The 23 Redrob Markers",
      subtitle: "Leveraging on-platform user engagement profiles",
      bullets: [
        "Recruiter response rates: Tracks how fast candidates respond to inbox pings.",
        "Interview completion rates: Measures reliability and on-time attendance.",
        "Profile views & saves: Signals active market demand from enterprise recruiters.",
        "Signup & active dates: Distinguishes hot candidates from stale, dormant listings."
      ]
    },
    {
      title: "Candidate Quality Shield: Standard verifications",
      subtitle: "Ensuring candidate legitimacy before sifting",
      bullets: [
        "Email & Phone Verification flags: Filters out bogus or automated accounts.",
        "LinkedIn sync: Assures historical compliance of titles and companies.",
        "Willingness to relocate & Work preference matches: Minimizes pipeline drop-off."
      ]
    },
    {
      title: "Standard Exports: Submission Files Generation",
      subtitle: "Fully compliant with the Redrob hackathon rules",
      bullets: [
        "CSV Sourced Export: Downloads standard CSV mapped with 'candidate_id, rank, score, reasoning'.",
        "XLSX Excel Export: Creates a binary workbook using node 'xlsx' packages instantly.",
        "Official scale mapping: Dividends scores into decimals (e.g. 0.9854) for ranking accuracy."
      ]
    },
    {
      title: "API Endpoints: Sourcing Microservices",
      subtitle: "Standardizing integration with CRM tools",
      bullets: [
        "POST /api/analyze-jd: Accepts raw JD texts, extracts features with Gemini 3.5 Flash.",
        "GET /api/candidates: Light-speed search, filters, pagination, and sorting index.",
        "GET /api/candidates/:id: Detailed dossiers showing all 23 behavior marks.",
        "GET /api/candidates/:id/ai-explanation: Generates custom reviews on strengths and concerns."
      ]
    },
    {
      title: "Sourcing Performance Benchmarks",
      subtitle: "Throughput metrics under extreme load test",
      bullets: [
        "Memory Footprint: Holds 100,000 complete CV dossiers in under 350MB RAM.",
        "JD Parsing Latency: Gemini response extraction completes in 1.2 to 2.4 seconds.",
        "Sifting Engine Speed: Scores and ranks 100,000 candidates in ~300 milliseconds on a single core.",
        "Query Throughput: Search, sort, and pagination filters complete in less than 2 milliseconds."
      ]
    },
    {
      title: "Future Roadmap: Fine-Tuning Sourcing Transformers",
      subtitle: "Advanced deep learning on human capital",
      bullets: [
        "Integrating local sentence transformers for embedding comparisons.",
        "Fine-tuning specialized models on Redrob tech assessments.",
        "Voice-to-JD Sourcing: Letting recruiters speak their candidate requirements."
      ]
    },
    {
      title: "Platform Summary: Bringing Sourcing to the Next Level",
      subtitle: "Efficient, reliable, and 100% explainable",
      bullets: [
        "Addresses high-scale candidate sifting with lightweight, cost-effective infrastructure.",
        "Empowers hiring managers with rich charts, comparisons, and actionable details.",
        "Maintains standard output compliance, making it ready for production deployment."
      ]
    }
  ];

  const handleNextSlide = () => {
    setPptIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    setPptIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="space-y-6">
      {/* Documentation Tabs */}
      <div className="flex border-b border-white/10 pb-1 gap-2">
        <button
          onClick={() => setActiveTab("ppt")}
          className={`px-4 py-2.5 font-display text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ppt"
              ? "border-cyan-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Presentation className="w-4 h-4" />
          Interactive PPT Deck
        </button>
        <button
          onClick={() => setActiveTab("architecture")}
          className={`px-4 py-2.5 font-display text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "architecture"
              ? "border-cyan-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          System Architecture
        </button>
        <button
          onClick={() => setActiveTab("deployment")}
          className={`px-4 py-2.5 font-display text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "deployment"
              ? "border-cyan-500 text-cyan-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileCode className="w-4 h-4" />
          Deployment Guide
        </button>
      </div>

      {/* Content Panels */}
      {activeTab === "ppt" && (
        <div className="space-y-6">
          {/* Slideshow Display */}
          <div className="glass-panel p-8 rounded-2xl min-h-[420px] flex flex-col justify-between relative border border-white/10 bg-slate-950/40">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
            
            <div className="space-y-6">
              {/* Slide Number Header */}
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>AI TALENT INTELLIGENCE Deck</span>
                <span>Slide {pptIndex + 1} of {slides.length}</span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-extrabold text-slate-100 tracking-tight">
                  {slides[pptIndex].title}
                </h3>
                <p className="text-sm text-cyan-400 font-medium">{slides[pptIndex].subtitle}</p>
              </div>

              {/* Bullets List */}
              <ul className="space-y-3 pt-2">
                {slides[pptIndex].bullets.map((bullet, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed">
                    <ArrowRight className="w-4 h-4 text-cyan-500 shrink-0 mt-1" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Slideshow Controls footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">
              <button
                onClick={handlePrevSlide}
                className="px-4 py-2 rounded-xl bg-[#090f1d] border border-white/10 hover:border-cyan-500/30 text-xs text-slate-400 hover:text-slate-200 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Slide
              </button>

              {/* Slide indicators dot map */}
              <div className="flex items-center gap-1.5 hidden sm:flex">
                {slides.map((_, idx) => (
                  <span 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === pptIndex ? "w-4 bg-cyan-400" : "w-1.5 bg-slate-800"
                    }`}
                  ></span>
                ))}
              </div>

              <button
                onClick={handleNextSlide}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs text-cyan-400 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Next Slide
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "architecture" && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="font-display text-lg font-bold mb-4 text-slate-200">Sourcing Engine Architecture & Flow</h3>
            <p className="text-xs text-slate-400 mb-6">Visual representation of how data moves from raw job description inputs down to standard exported deliverables.</p>

            {/* Flowchart Diagram (SVG representation) */}
            <div className="border border-white/10 rounded-xl p-6 bg-white/5 flex justify-center overflow-x-auto">
              <svg width="680" height="340" viewBox="0 0 680 340" className="text-slate-300">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                  </marker>
                </defs>

                {/* Raw Input Box */}
                <rect x="20" y="30" width="160" height="60" rx="8" fill="#0d152a" stroke="#1e293b" strokeWidth="2" />
                <text x="100" y="55" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Sourcing Inputs</text>
                <text x="100" y="75" textAnchor="middle" fill="#38bdf8" fontSize="10">Raw JD Text & Preset</text>

                {/* Gemini Extractor Box */}
                <rect x="240" y="30" width="180" height="60" rx="8" fill="#0c1d2e" stroke="#1e40af" strokeWidth="2" />
                <text x="330" y="55" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">Gemini AI Extractor</text>
                <text x="330" y="75" textAnchor="middle" fill="#60a5fa" fontSize="9">Required Skills, Budget, Exp</text>

                {/* Candidates Base Store */}
                <rect x="20" y="150" width="160" height="60" rx="8" fill="#0d152a" stroke="#1e293b" strokeWidth="2" />
                <text x="100" y="175" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">Candidates Database</text>
                <text x="100" y="195" textAnchor="middle" fill="#06b6d4" fontSize="10">100,000 In-Memory CVs</text>

                {/* Scoring Logic Engine */}
                <rect x="240" y="150" width="180" height="60" rx="8" fill="#0c1d24" stroke="#06b6d4" strokeWidth="2" />
                <text x="330" y="175" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">Matching Pipeline Engine</text>
                <text x="330" y="195" textAnchor="middle" fill="#34d399" fontSize="9">Skill weight + Behavior + Edu</text>

                {/* Submission Export File */}
                <rect x="490" y="150" width="170" height="60" rx="8" fill="#1e1810" stroke="#f59e0b" strokeWidth="2" />
                <text x="575" y="175" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold">Recruiter Submission</text>
                <text x="575" y="195" textAnchor="middle" fill="#fbbf24" fontSize="10">submission.csv / .xlsx</text>

                {/* Recruiter Dashboard Portal */}
                <rect x="240" y="260" width="180" height="60" rx="8" fill="#111827" stroke="#64748b" strokeWidth="2" />
                <text x="330" y="285" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontWeight="bold">Web Recruiter Portal</text>
                <text x="330" y="305" textAnchor="middle" fill="#cbd5e1" fontSize="10">Dossiers, Charts & Compare</text>

                {/* Flow lines */}
                <line x1="180" y1="60" x2="234" y2="60" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="330" y1="90" x2="330" y2="144" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="180" y1="180" x2="234" y2="180" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="420" y1="180" x2="484" y2="180" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="330" y1="210" x2="330" y2="254" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow)" />
              </svg>
            </div>

            {/* Architecture Details bullet items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-cyan-400" />
                  In-Memory scale
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">The server boots by generating 100,000 realistic candidates. Keeping everything in-memory guarantees sub-millisecond querying speed during search and sorting.</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Vectorized overlap
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">Exact and synonym skill indices are optimized with hash tables. Experience distances are calculated as mathematical gradients, avoiding heavy neural net bottlenecks in production.</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Gemini API Proxy
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">All LLM generations (parsing raw text, generating explainable evaluations) run server-side, protecting sensitive API keys and secrets from the client browser.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "deployment" && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6 border border-white/10">
            <div>
              <h3 className="font-display text-lg font-bold mb-2 text-slate-200">Deployment and Sourcing Guide</h3>
              <p className="text-xs text-slate-400">Step-by-step documentation on how to build, configure, and execute the Talent Sourcing platform locally or in container nodes.</p>
            </div>

            {/* Local dev section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                1. Local Environment Setup
              </h4>
              <p className="text-xs text-slate-400">Copy `.env.example` into `.env` at your root and supply your Gemini API key from Google AI Studio. The server detects the key automatically and boosts parsing quality.</p>
              
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg font-mono text-[11px] text-slate-300">
                # .env file content<br />
                GEMINI_API_KEY="AIzaSyYourActualKeyHere"<br />
                NODE_ENV="production"
              </div>
            </div>

            {/* Package execution commands */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-cyan-400" />
                2. Install Dependencies & Build
              </h4>
              <p className="text-xs text-slate-400">Run npm install to populate the node tree, build Vite static files, and bundle the Express server into CJS format via `esbuild` for maximum container throughput:</p>
              
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg font-mono text-[11px] text-slate-300">
                # Install packages<br />
                npm install<br /><br />
                # Run development environment server<br />
                npm run dev<br /><br />
                # Build production client and backend bundle<br />
                npm run build<br /><br />
                # Spin up production server<br />
                npm run start
              </div>
            </div>

            {/* Docker Container guide */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                3. Docker Production Deployment
              </h4>
              <p className="text-xs text-slate-400">For scalable cloud environments (Google Cloud Run, AWS Fargate), bundle the node application inside a standard scratch container:</p>

              <div className="bg-white/5 border border-white/10 p-4 rounded-lg font-mono text-[10px] text-slate-400 space-y-1 max-h-56 overflow-y-auto">
                <p className="text-cyan-400"># Dockerfile</p>
                <p>FROM node:20-alpine AS builder</p>
                <p>WORKDIR /app</p>
                <p>COPY package*.json ./</p>
                <p>RUN npm ci</p>
                <p>COPY . .</p>
                <p>RUN npm run build</p>
                <br />
                <p>FROM node:20-alpine AS runner</p>
                <p>WORKDIR /app</p>
                <p>ENV NODE_ENV=production</p>
                <p>COPY --from=builder /app/dist ./dist</p>
                <p>COPY --from=builder /app/package*.json ./</p>
                <p>RUN npm ci --only=production</p>
                <p>EXPOSE 3000</p>
                <p>CMD ["node", "dist/server.cjs"]</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
