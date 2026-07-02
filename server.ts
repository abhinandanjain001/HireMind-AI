import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as XLSX from "xlsx";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

import { BASE_CANDIDATES } from "./src/data/candidates-base";
import { generateAllCandidates } from "./src/data/generator";
import { calculateOverallScore, ScoreBreakdown, AnalyzedJD, SYNONYM_MAP } from "./src/data/scoring-engine";

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const api_key = process.env.GEMINI_API_KEY || "";
if (api_key && api_key !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: api_key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI client successfully initialized server-side.");
  } catch (err) {
    console.error("Error initializing Gemini client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY detected. Running in local fallback rules-based mode.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // In-memory data store
  console.log("Bootstrapping Talent Platform candidates...");
  let candidates: any[] = [];
  let isCustomDatabase = false;
  
  try {
    const customFilePath = path.join(process.cwd(), "src", "components", "Untitled.json");
    if (fs.existsSync(customFilePath)) {
      const stats = fs.statSync(customFilePath);
      if (stats.size > 10) {
        console.log("Found custom candidate details file Untitled.json. Loading...");
        const rawData = fs.readFileSync(customFilePath, "utf8");
        const parsedRaw = JSON.parse(rawData);
        if (Array.isArray(parsedRaw)) {
          // Unflatten helper
          const unflattenCandidate = (raw: any): any => {
            const result: any = {
              profile: {},
              redrob_signals: {}
            };

            for (const key of Object.keys(raw)) {
              if (key.startsWith("profile.")) {
                const nestedKey = key.substring(8);
                result.profile[nestedKey] = raw[key];
              } else if (key.startsWith("redrob_signals.")) {
                const nestedKey = key.substring(15);
                
                if (nestedKey.startsWith("expected_salary_range_inr_lpa.")) {
                  const salKey = nestedKey.substring(30);
                  if (!result.redrob_signals.expected_salary_range_inr_lpa) {
                    result.redrob_signals.expected_salary_range_inr_lpa = {};
                  }
                  result.redrob_signals.expected_salary_range_inr_lpa[salKey] = raw[key];
                } else if (nestedKey.startsWith("skill_assessment_scores.")) {
                  const skillKey = nestedKey.substring(24);
                  if (!result.redrob_signals.skill_assessment_scores) {
                    result.redrob_signals.skill_assessment_scores = {};
                  }
                  result.redrob_signals.skill_assessment_scores[skillKey] = raw[key];
                } else {
                  result.redrob_signals[nestedKey] = raw[key];
                }
              } else {
                result[key] = raw[key];
              }
            }

            // Fallbacks for critical missing fields
            if (!result.profile.anonymized_name) {
              result.profile.anonymized_name = result.candidate_id || "Anonymized Candidate";
            }
            if (typeof result.profile.years_of_experience === "string") {
              result.profile.years_of_experience = parseFloat(result.profile.years_of_experience) || 0;
            } else if (!result.profile.years_of_experience) {
              result.profile.years_of_experience = 0;
            }
            if (!result.redrob_signals.expected_salary_range_inr_lpa) {
              result.redrob_signals.expected_salary_range_inr_lpa = { min: 0, max: 0 };
            } else {
              if (typeof result.redrob_signals.expected_salary_range_inr_lpa.min === "string") {
                result.redrob_signals.expected_salary_range_inr_lpa.min = parseFloat(result.redrob_signals.expected_salary_range_inr_lpa.min) || 0;
              }
              if (typeof result.redrob_signals.expected_salary_range_inr_lpa.max === "string") {
                result.redrob_signals.expected_salary_range_inr_lpa.max = parseFloat(result.redrob_signals.expected_salary_range_inr_lpa.max) || 0;
              }
            }
            if (!result.redrob_signals.skill_assessment_scores) {
              result.redrob_signals.skill_assessment_scores = {};
            }
            return result;
          };

          candidates = parsedRaw.map(unflattenCandidate);
          isCustomDatabase = true;
          console.log(`Successfully bootstrapped ${candidates.length} custom candidates from Untitled.json.`);
        }
      }
    }
  } catch (err) {
    console.error("Error reading or parsing custom candidates file, falling back:", err);
  }

  if (candidates.length === 0) {
    console.log("No custom candidates loaded. Generating fallback synthetic pool...");
    candidates = generateAllCandidates();
    isCustomDatabase = false;
  }
  
  // Default active JD: ML Engineer
  let activeJD: AnalyzedJD = {
    title: "Senior Machine Learning Engineer",
    requiredSkills: ["Python", "ML", "SQL", "Spark", "Embeddings"],
    preferredSkills: ["Pinecone", "FAISS", "NLP", "Kubernetes"],
    minExperience: 5,
    education: ["B.E.", "B.Tech", "M.Tech", "M.Sc"],
    locations: ["Hyderabad", "Bangalore", "Gurgaon", "Remote"],
    salaryBudgetMaxLpa: 45,
    certifications: ["AWS", "Google Cloud"],
    industries: ["Software", "Food Delivery", "AI/ML"]
  };

  // Score cache to make search, sorting, and pagination 0ms fast
  let cachedRankings: ScoreBreakdown[] = [];

  // Function to re-rank all 100,000 candidates against active JD
  function runRankingPipeline() {
    console.log(`Running ranking pipeline for ${candidates.length} candidates...`);
    const startTime = Date.now();
    
    // Score all
    const scoredList = candidates.map(c => calculateOverallScore(c, activeJD));
    
    // Sort descending
    scoredList.sort((a, b) => b.score - a.score);
    
    // Assign ranks
    scoredList.forEach((item, index) => {
      item.rank = index + 1;
    });
    
    cachedRankings = scoredList;
    const duration = Date.now() - startTime;
    console.log(`Ranking pipeline complete in ${duration}ms! Top-1 candidate: ${cachedRankings[0]?.candidate_id} with score ${cachedRankings[0]?.score}`);
  }

  // Run first ranking pass on startup
  runRankingPipeline();

  // API Route: Get Active JD
  app.get("/api/jd", (req, res) => {
    res.json(activeJD);
  });

  // API Route: Paste/Analyze Job Description with Gemini
  app.post("/api/analyze-jd", async (req, res) => {
    const { jdText } = req.body;
    if (!jdText || jdText.trim() === "") {
      return res.status(400).json({ error: "Job description text is required" });
    }

    console.log("Analyzing Job Description via AI...");
    
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Analyze the following job description and extract structured candidate filtering criteria according to the schema provided. Be specific with skill names (e.g. "Python", "React", "SQL", "FAISS", "TensorFlow").
          
Job Description:
${jdText}`,
          config: {
            systemInstruction: "You are a Senior Recruiter and AI Talent sourcing specialist. Extract clear and precise skills, required years of experience, locations, certifications and industries.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Extract the official Job Title" },
                requiredSkills: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "List of 4-8 required technical skills"
                },
                preferredSkills: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "List of 3-5 preferred/nice-to-have skills"
                },
                minExperience: { 
                  type: Type.INTEGER, 
                  description: "Minimum required years of experience (number, e.g. 5)" 
                },
                education: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "List of accepted degree titles, e.g. ['B.Tech', 'M.Tech', 'MS', 'B.Sc']"
                },
                locations: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "List of target cities or 'Remote'/'Hybrid'"
                },
                salaryBudgetMaxLpa: { 
                  type: Type.INTEGER, 
                  description: "Maximum salary budget in INR LPA (Lakhs per annum), default to 35 if not found" 
                },
                certifications: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "List of target certifications like ['AWS', 'Kubernetes', 'Scrum']"
                },
                industries: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Target industries, e.g. ['Software', 'Fintech', 'Logistics']"
                }
              },
              required: ["title", "requiredSkills", "preferredSkills", "minExperience", "education", "locations", "salaryBudgetMaxLpa", "certifications", "industries"]
            }
          }
        });

        const parsed = JSON.parse(response.text || "{}");
        activeJD = parsed;
        runRankingPipeline();
        return res.json({ success: true, jd: activeJD });
      } catch (err) {
        console.error("Gemini JD analysis failed, falling back to local extractor:", err);
      }
    }

    // Local Fallback Parser if Gemini is not configured or fails
    const cleaned = jdText.toLowerCase();
    const guessedSkills: string[] = [];
    ["python", "sql", "react", "typescript", "kubernetes", "docker", "aws", "gcp", "azure", "spark", "airflow", "embeddings", "faiss", "pinecone", "milvus", "scikit-learn"].forEach(s => {
      if (cleaned.includes(s)) guessedSkills.push(s.toUpperCase());
    });

    let guessedExp = 3;
    const expMatch = cleaned.match(/(\d+)\+?\s*years?/);
    if (expMatch) guessedExp = parseInt(expMatch[1]);

    activeJD = {
      title: jdText.substring(0, 50).split("\n")[0] || "Custom Sourced Role",
      requiredSkills: guessedSkills.length > 0 ? guessedSkills : ["Python", "SQL", "Git"],
      preferredSkills: ["Agile", "Docker", "DevOps"],
      minExperience: guessedExp,
      education: ["B.Tech", "B.E.", "M.Sc"],
      locations: ["Hyderabad", "Bangalore", "Gurgaon", "Remote"],
      salaryBudgetMaxLpa: 35,
      certifications: ["AWS"],
      industries: ["Software", "IT Services"]
    };

    runRankingPipeline();
    res.json({ success: true, jd: activeJD, fallback: true });
  });

  // API Route: Reset JD to Default Presets
  app.post("/api/jd/preset", (req, res) => {
    const { preset } = req.body;
    
    if (preset === "ml_engineer") {
      activeJD = {
        title: "Senior Machine Learning Engineer",
        requiredSkills: ["Python", "ML", "SQL", "Spark", "Embeddings"],
        preferredSkills: ["Pinecone", "FAISS", "NLP", "Kubernetes"],
        minExperience: 5,
        education: ["B.E.", "B.Tech", "M.Tech", "M.Sc"],
        locations: ["Hyderabad", "Bangalore", "Gurgaon", "Remote"],
        salaryBudgetMaxLpa: 45,
        certifications: ["AWS", "Google Cloud"],
        industries: ["Software", "Food Delivery", "AI/ML"]
      };
    } else if (preset === "frontend_developer") {
      activeJD = {
        title: "Frontend Architect (React)",
        requiredSkills: ["React", "TypeScript", "JavaScript", "Tailwind", "CSS"],
        preferredSkills: ["Next.js", "Cypress", "Webpack", "Figma"],
        minExperience: 3,
        education: ["B.Tech", "B.Sc", "MCA"],
        locations: ["Mumbai", "Bangalore", "Pune", "Remote"],
        salaryBudgetMaxLpa: 28,
        certifications: ["Scrum Master Certified"],
        industries: ["Software", "Fintech", "E-commerce"]
      };
    } else if (preset === "devops_architect") {
      activeJD = {
        title: "Cloud Infrastructure & DevOps Lead",
        requiredSkills: ["Kubernetes", "Terraform", "Docker", "AWS", "CI/CD"],
        preferredSkills: ["GCP", "Linux", "Ansible", "Helm"],
        minExperience: 6,
        education: ["B.E.", "B.Tech", "MCA"],
        locations: ["Noida", "Hyderabad", "Remote"],
        salaryBudgetMaxLpa: 38,
        certifications: ["AWS Certified Solutions Architect", "CKA"],
        industries: ["IT Services", "Fintech", "Software"]
      };
    } else if (preset === "finance_accountant") {
      activeJD = {
        title: "Senior Financial Accountant",
        requiredSkills: ["Accounting", "Excel", "Tally", "GAAP", "Taxation"],
        preferredSkills: ["PowerPoint", "Ind-AS", "Audit-Readiness"],
        minExperience: 4,
        education: ["Commerce", "MBA", "B.Sc"],
        locations: ["Gurgaon", "Delhi", "Onsite"],
        salaryBudgetMaxLpa: 22,
        certifications: ["Six Sigma Green Belt"],
        industries: ["Manufacturing", "IT Services"]
      };
    } else {
      return res.status(400).json({ error: "Unknown preset role" });
    }

    runRankingPipeline();
    res.json({ success: true, jd: activeJD });
  });

  // API Route: Get Ranked Candidates List with Filters
  app.get("/api/candidates", (req, res) => {
    const { 
      page = "1", 
      limit = "15", 
      search = "", 
      skill = "", 
      company = "", 
      location = "", 
      education = "", 
      minExp = "0", 
      maxSalary = "150", 
      minBehavior = "0", 
      minSemantic = "0",
      sortBy = "score" // score, rank, behaviorScore, semanticScore, experience
    } = req.query;

    const p = parseInt(page as string);
    const lim = parseInt(limit as string);
    const term = (search as string).toLowerCase().trim();
    
    const skillFilter = (skill as string).toLowerCase().trim();
    const companyFilter = (company as string).toLowerCase().trim();
    const locFilter = (location as string).toLowerCase().trim();
    const eduFilter = (education as string).toLowerCase().trim();
    const expMin = parseFloat(minExp as string);
    const salMax = parseFloat(maxSalary as string);
    const behMin = parseFloat(minBehavior as string);
    const semMin = parseFloat(minSemantic as string);

    // Apply filters directly over cached rankings
    let filtered = cachedRankings;

    // Search term checks Name, Title or Candidate ID
    if (term) {
      filtered = filtered.filter(item => {
        const cand = candidates.find(c => c.candidate_id === item.candidate_id);
        if (!cand) return false;
        return cand.profile.anonymized_name.toLowerCase().includes(term) ||
               cand.profile.current_title.toLowerCase().includes(term) ||
               cand.candidate_id.toLowerCase().includes(term);
      });
    }

    // Specific field filters
    if (skillFilter) {
      filtered = filtered.filter(item => {
        const cand = candidates.find(c => c.candidate_id === item.candidate_id);
        if (!cand) return false;
        return cand.skills.some(s => s.name.toLowerCase().includes(skillFilter));
      });
    }

    if (companyFilter) {
      filtered = filtered.filter(item => {
        const cand = candidates.find(c => c.candidate_id === item.candidate_id);
        if (!cand) return false;
        return cand.profile.current_company.toLowerCase().includes(companyFilter) ||
               cand.career_history.some(h => h.company.toLowerCase().includes(companyFilter));
      });
    }

    if (locFilter) {
      filtered = filtered.filter(item => {
        const cand = candidates.find(c => c.candidate_id === item.candidate_id);
        if (!cand) return false;
        return cand.profile.location.toLowerCase().includes(locFilter);
      });
    }

    if (eduFilter) {
      filtered = filtered.filter(item => {
        const cand = candidates.find(c => c.candidate_id === item.candidate_id);
        if (!cand) return false;
        return cand.education.some(e => e.institution.toLowerCase().includes(eduFilter) || e.degree.toLowerCase().includes(eduFilter));
      });
    }

    if (expMin > 0) {
      filtered = filtered.filter(item => {
        const cand = candidates.find(c => c.candidate_id === item.candidate_id);
        if (!cand) return false;
        return cand.profile.years_of_experience >= expMin;
      });
    }

    if (salMax < 150) {
      filtered = filtered.filter(item => {
        const cand = candidates.find(c => c.candidate_id === item.candidate_id);
        if (!cand) return false;
        return cand.redrob_signals.expected_salary_range_inr_lpa.max <= salMax;
      });
    }

    if (behMin > 0) {
      filtered = filtered.filter(item => item.behaviorScore >= behMin);
    }

    if (semMin > 0) {
      filtered = filtered.filter(item => item.semanticScore >= semMin);
    }

    // Sorting overrides
    if (sortBy === "behaviorScore") {
      filtered = [...filtered].sort((a, b) => b.behaviorScore - a.behaviorScore);
    } else if (sortBy === "semanticScore") {
      filtered = [...filtered].sort((a, b) => b.semanticScore - a.semanticScore);
    } else if (sortBy === "experience") {
      filtered = [...filtered].sort((a, b) => {
        const candA = candidates.find(c => c.candidate_id === a.candidate_id);
        const candB = candidates.find(c => c.candidate_id === b.candidate_id);
        return (candB?.profile.years_of_experience || 0) - (candA?.profile.years_of_experience || 0);
      });
    }

    // Paginate results
    const total = filtered.length;
    const startIndex = (p - 1) * lim;
    const paginated = filtered.slice(startIndex, startIndex + lim);

    // Hydrate paginated items with full core profile details for list rendering
    const results = paginated.map(ranking => {
      const core = candidates.find(c => c.candidate_id === ranking.candidate_id);
      return {
        ...ranking,
        name: core?.profile.anonymized_name || "Anonymized Candidate",
        headline: core?.profile.headline || "Enterprise Specialist",
        location: core?.profile.location || "Remote",
        years_of_experience: core?.profile.years_of_experience || 0,
        current_company: core?.profile.current_company || "N/A",
        expected_salary_range: core?.redrob_signals.expected_salary_range_inr_lpa || { min: 0, max: 0 },
        notice_period_days: core?.redrob_signals.notice_period_days || 0,
        preferred_work_mode: core?.redrob_signals.preferred_work_mode || "remote",
        open_to_work: core?.redrob_signals.open_to_work_flag || false,
        skills: core?.skills.slice(0, 6).map(s => s.name) || []
      };
    });

    res.json({
      total,
      page: p,
      limit: lim,
      totalPages: Math.ceil(total / lim),
      results
    });
  });

  // API Route: Get Single Candidate Complete Details
  app.get("/api/candidates/:id", (req, res) => {
    const { id } = req.params;
    const core = candidates.find(c => c.candidate_id === id);
    const ranking = cachedRankings.find(r => r.candidate_id === id);

    if (!core) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // If candidate has not been scored yet, do a quick on-the-fly score calculation
    const scoreDetails = ranking || calculateOverallScore(core, activeJD);

    res.json({
      candidate: core,
      score: scoreDetails
    });
  });

  // API Route: Generate Personalized AI Explanation via Gemini
  app.get("/api/candidates/:id/ai-explanation", async (req, res) => {
    const { id } = req.params;
    const core = candidates.find(c => c.candidate_id === id);
    const ranking = cachedRankings.find(r => r.candidate_id === id) || (core ? calculateOverallScore(core, activeJD) : null);

    if (!core || !ranking) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log(`Generating AI candidate review for ${core.candidate_id}...`);

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Create a professional, explainable hiring evaluation for this candidate based on their match against the current Job Description. Keep the evaluation objective, concise, and recruiter-focused (2-3 short paragraphs).
          
Target Job:
- Title: ${activeJD.title}
- Required Skills: ${activeJD.requiredSkills.join(", ")}
- Experience Budget: ${activeJD.minExperience}+ years

Candidate Profile:
- Name: ${core.profile.anonymized_name}
- Headline: ${core.profile.headline}
- Experience: ${core.profile.years_of_experience} years
- Current Company: ${core.profile.current_company}
- Match Scores: Skills ${ranking.skillScore}%, Experience ${ranking.experienceScore}%, Behavior ${ranking.behaviorScore}%
- Summary: ${core.profile.summary}`,
          config: {
            systemInstruction: "You are a professional HR Director and Recruiter Reviewer. Produce a structured hiring summary focusing on: Core Strengths, Potential Concerns, and a clear Final Decision. Maintain a respectful yet completely objective professional tone."
          }
        });

        return res.json({ explanation: response.text });
      } catch (err) {
        console.error("Gemini candidate explanation failed, falling back to local reasoning:", err);
      }
    }

    // Procedural Fallback Explanation Generator
    let customText = `<p><strong>Core Sourcing Review:</strong> ${core.profile.anonymized_name} presents a strong profile as a <strong>${core.profile.current_title}</strong> with ${core.profile.years_of_experience} years of professional field experience. The candidate's background shows excellent alignment on core skills with high proficiency, backed by endorsements on the Redrob platform. They are a stable contributor who has spent ${core.career_history[0]?.duration_months || 24} months at their current company, ${core.profile.current_company}.</p>`;
    
    customText += `<p><strong>Strengths Analysis:</strong> Key strengths include highly rated expertise in <strong>${core.skills.slice(0, 3).map(s => s.name).join(", ")}</strong>. On-platform behavior indicators are favorable: they have completed their profile to ${core.redrob_signals.profile_completeness_score}% completeness, have an active response rate of ${Math.round(core.redrob_signals.recruiter_response_rate * 100)}% with recruiters, and a quick average response time of ${core.redrob_signals.avg_response_time_hours} hours. They have completedScheduled Interviews with a ${Math.round(core.redrob_signals.interview_completion_rate * 100)}% attendance record.</p>`;
    
    if (core.redrob_signals.notice_period_days > 90) {
      customText += `<p><strong>Hiring Caveat:</strong> The primary sourcing concern is their <strong>${core.redrob_signals.notice_period_days}-day notice period</strong>, which may slow down time-to-hire pipelines. Their salary expectation of max ${core.redrob_signals.expected_salary_range_inr_lpa.max} LPA is fully aligned within standard budgets.</p>`;
    } else {
      customText += `<p><strong>Hiring Caveat:</strong> No substantial bottlenecks found. They are available with a short <strong>${core.redrob_signals.notice_period_days}-day notice period</strong>, making them an excellent fast-sourcing candidate.</p>`;
    }

    res.json({ explanation: customText });
  });

  // API Route: Candidate Comparison Side-by-Side
  app.post("/api/candidates/compare", (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "List of candidate ids is required" });
    }

    const compared = ids.map(id => {
      const core = candidates.find(c => c.candidate_id === id);
      const scoreDetails = cachedRankings.find(r => r.candidate_id === id) || (core ? calculateOverallScore(core, activeJD) : null);
      if (!core || !scoreDetails) return null;

      return {
        candidate_id: core.candidate_id,
        name: core.profile.anonymized_name,
        headline: core.profile.headline,
        score: scoreDetails.score,
        skillScore: scoreDetails.skillScore,
        experienceScore: scoreDetails.experienceScore,
        behaviorScore: scoreDetails.behaviorScore,
        educationScore: scoreDetails.educationScore,
        certificationScore: scoreDetails.certificationScore,
        salaryMax: core.redrob_signals.expected_salary_range_inr_lpa.max,
        noticeDays: core.redrob_signals.notice_period_days,
        preferredMode: core.redrob_signals.preferred_work_mode,
        strengths: scoreDetails.strengths,
        weaknesses: scoreDetails.weaknesses,
        recommendation: scoreDetails.hiringRecommendation,
        reasoning: scoreDetails.reasoning
      };
    }).filter(Boolean);

    res.json(compared);
  });

  // API Route: Get Sourcing Analytics and Distributions
  app.get("/api/analytics", (req, res) => {
    // Generate distribution details for the Top-100 candidates
    const top100 = cachedRankings.slice(0, 100);
    
    // 1. Top Skills Distribution
    const skillCounts: Record<string, number> = {};
    top100.forEach(item => {
      const core = candidates.find(c => c.candidate_id === item.candidate_id);
      core?.skills.forEach(s => {
        skillCounts[s.name] = (skillCounts[s.name] || 0) + 1;
      });
    });
    const topSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 2. Experience Distribution
    const expCounts = { "0-2 Yrs": 0, "3-5 Yrs": 0, "6-9 Yrs": 0, "10-14 Yrs": 0, "15+ Yrs": 0 };
    top100.forEach(item => {
      const core = candidates.find(c => c.candidate_id === item.candidate_id);
      if (!core) return;
      const yrs = core.profile.years_of_experience;
      if (yrs <= 2) expCounts["0-2 Yrs"]++;
      else if (yrs <= 5) expCounts["3-5 Yrs"]++;
      else if (yrs <= 9) expCounts["6-9 Yrs"]++;
      else if (yrs <= 14) expCounts["10-14 Yrs"]++;
      else expCounts["15+ Yrs"]++;
    });
    const experienceDistribution = Object.entries(expCounts).map(([range, count]) => ({ name: range, value: count }));

    // 3. Behavioral Score distribution (Bucketed)
    const behCounts = { "Needs Sourcing": 0, "Passive Activity": 0, "Steady Engagement": 0, "Elite Redrob Active": 0 };
    top100.forEach(item => {
      if (item.behaviorScore < 45) behCounts["Needs Sourcing"]++;
      else if (item.behaviorScore < 65) behCounts["Passive Activity"]++;
      else if (item.behaviorScore < 85) behCounts["Steady Engagement"]++;
      else behCounts["Elite Redrob Active"]++;
    });
    const behaviorDistribution = Object.entries(behCounts).map(([bucket, count]) => ({ name: bucket, value: count }));

    // 4. University Tier distribution
    const uniCounts = { "Tier 1 (IIT/IISc)": 0, "Tier 2 (Anna/SRM)": 0, "Tier 3 (VIT/LPU)": 0, "Tier 4 / Unknown": 0 };
    top100.forEach(item => {
      const core = candidates.find(c => c.candidate_id === item.candidate_id);
      core?.education.forEach(e => {
        if (e.tier === "tier_1") uniCounts["Tier 1 (IIT/IISc)"]++;
        else if (e.tier === "tier_2") uniCounts["Tier 2 (Anna/SRM)"]++;
        else if (e.tier === "tier_3") uniCounts["Tier 3 (VIT/LPU)"]++;
        else uniCounts["Tier 4 / Unknown"]++;
      });
    });
    const educationDistribution = Object.entries(uniCounts).map(([tier, count]) => ({ name: tier, value: count }));

    // 5. Sourcing Pipeline Funnel (100,000 to Top-100)
    const pipelineFunnel = [
      { step: "Total Pool Scanned", count: candidates.length },
      { step: "Passed Initial Semantic overlap", count: cachedRankings.filter(r => r.semanticScore > 50).length },
      { step: "Verified Work Experience", count: cachedRankings.filter(r => r.experienceScore >= 70).length },
      { step: "High Skill Alignment (>70%)", count: cachedRankings.filter(r => r.skillScore >= 70).length },
      { step: "Elite Sourcing Shortlist (Top 100)", count: 100 }
    ];

    // 6. Feature Importance config mapping (static weights representation)
    const featureImportance = [
      { name: "Skill Match Matrix", weight: 25 },
      { name: "Semantic CV Overlap", weight: 15 },
      { name: "Years & Career History", weight: 15 },
      { name: "Redrob Engagement Profile", weight: 15 },
      { name: "Educational Prestige", weight: 10 },
      { name: "Certifications", weight: 5 },
      { name: "Budget Compliance", weight: 5 },
      { name: "Location Sourcing Match", weight: 5 },
      { name: "Immediate Joiner Factor", weight: 5 }
    ];

    res.json({
      topSkills,
      experienceDistribution,
      behaviorDistribution,
      educationDistribution,
      pipelineFunnel,
      featureImportance
    });
  });

  // API Route: Export Candidates to official Redrob CSV format
  app.get("/api/export/csv", (req, res) => {
    const exportData = isCustomDatabase ? cachedRankings : cachedRankings.slice(0, 100);
    
    let csvContent = "candidate_id,rank,score,reasoning\n";
    exportData.forEach(item => {
      // Escape commas in reasoning to prevent corrupt CSV format
      const escapedReasoning = `"${item.reasoning.replace(/"/g, '""')}"`;
      csvContent += `${item.candidate_id},${item.rank},${(item.score / 100).toFixed(4)},${escapedReasoning}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=submission.csv");
    res.status(200).send(csvContent);
  });

  // API Route: Export Candidates to XLSX format using ExcelJS / xlsx
  app.get("/api/export/xlsx", (req, res) => {
    const exportData = isCustomDatabase ? cachedRankings : cachedRankings.slice(0, 100);
    
    const formattedData = exportData.map(item => ({
      candidate_id: item.candidate_id,
      rank: item.rank,
      score: parseFloat((item.score / 100).toFixed(4)),
      reasoning: item.reasoning
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submission");
    
    // Write buffer
    const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=submission.xlsx");
    res.status(200).send(buf);
  });

  // Vite integration and static file serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Sourcing Server running on http://localhost:${PORT}`);
  });
}

startServer();
