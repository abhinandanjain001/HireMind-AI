import { Candidate } from "./candidates-base";

export interface AnalyzedJD {
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperience: number;
  education: string[];
  locations: string[];
  salaryBudgetMaxLpa: number;
  certifications: string[];
  industries: string[];
}

export interface ScoreBreakdown {
  candidate_id: string;
  rank: number;
  score: number; // 0 to 100
  semanticScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  certificationScore: number;
  behaviorScore: number;
  locationScore: number;
  salaryScore: number;
  noticeScore: number;
  strengths: string[];
  weaknesses: string[];
  hiringRecommendation: "Strong Hire" | "Hire" | "Pass" | "Strong Pass";
  reasoning: string;
}

// Map synonyms for fuzzy/semantic matches
export const SYNONYM_MAP: Record<string, string[]> = {
  "python": ["py", "python3", "pypy", "scripting"],
  "ml": ["machine learning", "machine-learning", "ai/ml", "applied ml", "deep learning", "statistical modeling"],
  "ai": ["artificial intelligence", "genai", "generative ai", "applied ai", "nlp", "llms"],
  "llm": ["large language model", "transformer", "bert", "gpt", "hugging face", "fine-tuning llms", "prompt engineering", "langchain"],
  "vector search": ["faiss", "milvus", "pinecone", "qdrant", "weaviate", "embeddings"],
  "gcp": ["google cloud", "google cloud platform", "google-cloud"],
  "aws": ["amazon web services", "amazon-web-services", "certified cloud practitioner"],
  "azure": ["microsoft azure", "microsoft-azure"],
  "spark": ["pyspark", "apache spark", "spark streaming", "data pipelines"],
  "kubernetes": ["k8s", "helm", "docker", "devops"],
  "sql": ["postgresql", "mysql", "postgres", "sqlite", "snowflake", "bigquery", "data warehouses"],
  "react": ["next.js", "nextjs", "typescript", "javascript", "tailwind", "frontend"]
};

// Check if skill names match (exact or synonym or fuzzy)
export function checkSkillMatch(candSkill: string, jdSkill: string): boolean {
  const cNorm = candSkill.toLowerCase().trim();
  const jNorm = jdSkill.toLowerCase().trim();
  
  if (cNorm === jNorm) return true;
  
  // Synonym matching
  for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
    const keyMatch = (key === jNorm || synonyms.includes(jNorm));
    if (keyMatch) {
      if (cNorm === key || synonyms.includes(cNorm)) {
        return true;
      }
    }
  }
  
  // Fuzzy substring match
  if (cNorm.includes(jNorm) || jNorm.includes(cNorm)) return true;
  
  return false;
}

export function calculateSkillScore(candidate: Candidate, jd: AnalyzedJD): { score: number, matches: string[] } {
  if (jd.requiredSkills.length === 0) return { score: 100, matches: [] };
  
  let matchesCount = 0;
  const matchedSkills: string[] = [];
  
  // Weight per skill level
  const proficiencyWeights = {
    expert: 1.0,
    advanced: 0.9,
    intermediate: 0.75,
    beginner: 0.5
  };
  
  for (const jdSkill of jd.requiredSkills) {
    let matched = false;
    for (const candSkill of candidate.skills) {
      if (checkSkillMatch(candSkill.name, jdSkill)) {
        const weight = proficiencyWeights[candSkill.proficiency] || 0.75;
        // Endorsements bonus
        const endorsementBonus = Math.min(candSkill.endorsements * 0.01, 0.1);
        matchesCount += Math.min(weight + endorsementBonus, 1.0);
        matchedSkills.push(jdSkill);
        matched = true;
        break;
      }
    }
  }
  
  // Preferred skills bonus
  let preferredMatches = 0;
  for (const prefSkill of jd.preferredSkills) {
    for (const candSkill of candidate.skills) {
      if (checkSkillMatch(candSkill.name, prefSkill)) {
        preferredMatches += 0.2; // Small incremental bonus
        matchedSkills.push(prefSkill);
        break;
      }
    }
  }
  
  const baseScore = (matchesCount / jd.requiredSkills.length) * 100;
  const finalScore = Math.min(baseScore + preferredMatches * 10, 100);
  
  return {
    score: Math.round(finalScore * 100) / 100,
    matches: Array.from(new Set(matchedSkills))
  };
}

export function calculateExperienceScore(candidate: Candidate, jd: AnalyzedJD): number {
  const expYears = candidate.profile.years_of_experience;
  const reqYears = jd.minExperience;
  
  if (reqYears === 0) return 100;
  
  // Base score from years of experience
  let score = 0;
  if (expYears >= reqYears) {
    score = 80 + Math.min((expYears - reqYears) * 4, 20); // 80 to 100 if candidate has enough or more experience
  } else {
    score = Math.max(30, (expYears / reqYears) * 80); // Scaled penalty down to 30 minimum
  }
  
  // Leadership & Title Alignment bonus
  const isLeader = candidate.profile.headline.toLowerCase().match(/(lead|senior|principal|architect|manager)/);
  if (isLeader && expYears > 5) score = Math.min(score + 5, 100);
  
  // Startup vs Enterprise experience bonus based on company sizes in history
  let startupExp = false;
  let enterpriseExp = false;
  
  candidate.career_history.forEach(history => {
    const size = history.company_size;
    if (["1-10", "11-50", "51-200"].includes(size)) {
      startupExp = true;
    }
    if (["1001-5000", "5001-10000", "10001+"].includes(size)) {
      enterpriseExp = true;
    }
  });
  
  // Small alignment points
  if (startupExp) score = Math.min(score + 2, 100);
  if (enterpriseExp) score = Math.min(score + 2, 100);
  
  return Math.round(score * 100) / 100;
}

export function calculateEducationScore(candidate: Candidate, jd: AnalyzedJD): number {
  if (candidate.education.length === 0) return 50; // Neutral default
  
  let bestEduScore = 40; // Default baseline
  
  const tierWeights = {
    tier_1: 100,
    tier_2: 85,
    tier_3: 70,
    tier_4: 55,
    unknown: 50
  };
  
  for (const edu of candidate.education) {
    let eduScore = tierWeights[edu.tier] || 50;
    
    // Degree level weight
    const degree = edu.degree.toLowerCase();
    if (degree.includes("ph.d") || degree.includes("phd") || degree.includes("doctorate")) {
      eduScore += 10;
    } else if (degree.includes("m.e") || degree.includes("m.tech") || degree.includes("m.s") || degree.includes("master")) {
      eduScore += 5;
    }
    
    // Grade bonus (GPA)
    if (edu.grade) {
      const gradeStr = edu.grade.toLowerCase();
      if (gradeStr.includes("cgpa")) {
        const cgpa = parseFloat(gradeStr);
        if (!isNaN(cgpa)) {
          eduScore += Math.max(0, (cgpa - 7.0) * 2); // Bonus for higher CGPA
        }
      } else if (gradeStr.includes("%")) {
        const percent = parseFloat(gradeStr);
        if (!isNaN(percent)) {
          eduScore += Math.max(0, (percent - 70) * 0.3); // Bonus for higher %
        }
      }
    }
    
    // Field of study match bonus
    const field = edu.field_of_study.toLowerCase();
    const isMlOrCs = field.includes("computer") || field.includes("data") || field.includes("machine") || field.includes("artificial") || field.includes("information");
    if (isMlOrCs) {
      eduScore += 5;
    }
    
    bestEduScore = Math.max(bestEduScore, eduScore);
  }
  
  return Math.min(bestEduScore, 100);
}

export function calculateCertificationScore(candidate: Candidate): number {
  const certifications = candidate.certifications || [];
  if (certifications.length === 0) {
    // Check if some skills are related to certification topics for a small baseline
    const cloudSkills = candidate.skills.filter(s => ["AWS", "Azure", "GCP", "Kubernetes", "Snowflake", "Databricks"].includes(s.name));
    return Math.min(40 + cloudSkills.length * 8, 70);
  }
  
  let score = 50; // Starting baseline with certifications
  
  for (const cert of certifications) {
    const name = cert.name.toLowerCase();
    const issuer = cert.issuer.toLowerCase();
    
    if (issuer.includes("aws") || name.includes("aws")) score += 15;
    if (issuer.includes("google") || name.includes("gcp") || issuer.includes("gcp")) score += 15;
    if (issuer.includes("azure") || name.includes("azure")) score += 12;
    if (name.includes("scrum") || name.includes("agile")) score += 8;
    if (name.includes("six sigma") || name.includes("green belt")) score += 8;
  }
  
  return Math.min(score, 100);
}

export function calculateBehaviorScore(candidate: Candidate): number {
  const s = candidate.redrob_signals;
  if (!s) return 50;
  
  let score = 0;
  
  // 1. Profile completeness (15% weight)
  score += s.profile_completeness_score * 0.15;
  
  // 2. Open to Work and Recruiter Response Rate (20% weight)
  const openToWorkBonus = s.open_to_work_flag ? 15 : 0;
  score += (s.recruiter_response_rate * 85 + openToWorkBonus) * 0.20;
  
  // 3. Activity signals: views, submissions, appearances (20% weight)
  const viewsFactor = Math.min(s.profile_views_received_30d / 100, 1.0) * 40;
  const submissionsFactor = Math.min(s.applications_submitted_30d / 10, 1.0) * 30;
  const appearanceFactor = Math.min(s.search_appearance_30d / 500, 1.0) * 30;
  score += (viewsFactor + submissionsFactor + appearanceFactor) * 0.20;
  
  // 4. Verification and Connection points (15% weight)
  let verificationScore = 0;
  if (s.verified_email) verificationScore += 30;
  if (s.verified_phone) verificationScore += 30;
  if (s.linkedin_connected) verificationScore += 40;
  score += verificationScore * 0.15;
  
  // 5. GitHub and Endorsement Activity (15% weight)
  const ghFactor = s.github_activity_score > 0 ? s.github_activity_score : 10; // defaults to 10 if none
  const endorseFactor = Math.min(s.endorsements_received / 100, 1.0) * 100;
  score += ((ghFactor * 0.6) + (endorseFactor * 0.4)) * 0.15;
  
  // 6. Interview attendance and Acceptance rates (15% weight)
  const interviewFactor = s.interview_completion_rate * 60;
  const acceptFactor = s.offer_acceptance_rate > 0 ? s.offer_acceptance_rate * 40 : 35; // default 35
  score += (interviewFactor + acceptFactor) * 0.15;
  
  return Math.round(score * 100) / 100;
}

export function calculateLocationSalaryNoticeScore(candidate: Candidate, jd: AnalyzedJD): { locationScore: number, salaryScore: number, noticeScore: number } {
  // Location score
  let locationScore = 50; // Remote or Hybrid flexible default
  const candLoc = candidate.profile.location.toLowerCase();
  const candCountry = candidate.profile.country.toLowerCase();
  
  const matchesJdLoc = jd.locations.some(loc => {
    const lNorm = loc.toLowerCase();
    return candLoc.includes(lNorm) || lNorm.includes(candLoc) || candCountry.includes(lNorm);
  });
  
  if (matchesJdLoc) {
    locationScore = 100;
  } else if (candidate.redrob_signals.willing_to_relocate) {
    locationScore = 80; // Highly acceptable
  } else if (candidate.redrob_signals.preferred_work_mode === "remote" || candidate.redrob_signals.preferred_work_mode === "flexible") {
    locationScore = 70; // Flexible
  } else {
    locationScore = 40; // Relocation constraint
  }
  
  // Salary score
  let salaryScore = 100;
  const expectedMax = candidate.redrob_signals.expected_salary_range_inr_lpa.max;
  const budgetMax = jd.salaryBudgetMaxLpa;
  
  if (budgetMax > 0 && expectedMax > budgetMax) {
    const overPercent = (expectedMax - budgetMax) / budgetMax;
    salaryScore = Math.max(30, 100 - overPercent * 100); // Penalty for over budget
  }
  
  // Notice period score
  let noticeScore = 100;
  const noticeDays = candidate.redrob_signals.notice_period_days;
  if (noticeDays <= 15) {
    noticeScore = 100; // Immediate joiner
  } else if (noticeDays <= 30) {
    noticeScore = 95;
  } else if (noticeDays <= 60) {
    noticeScore = 80;
  } else if (noticeDays <= 90) {
    noticeScore = 60; // Fair penalty
  } else {
    noticeScore = 40; // Notice period constraint
  }
  
  return { locationScore, salaryScore, noticeScore };
}

export function calculateOverallScore(candidate: Candidate, jd: AnalyzedJD): ScoreBreakdown {
  const semanticScore = calculateSemanticSimilarity(candidate, jd);
  const skillResults = calculateSkillScore(candidate, jd);
  const skillScore = skillResults.score;
  const experienceScore = calculateExperienceScore(candidate, jd);
  const educationScore = calculateEducationScore(candidate, jd);
  const certificationScore = calculateCertificationScore(candidate);
  const behaviorScore = calculateBehaviorScore(candidate);
  
  const { locationScore, salaryScore, noticeScore } = calculateLocationSalaryNoticeScore(candidate, jd);
  
  // Core weights configuration matching Redrob scoring logic
  const weights = {
    semantic: 0.15,
    skills: 0.25,
    experience: 0.15,
    behavior: 0.15,
    education: 0.10,
    certification: 0.05,
    location: 0.05,
    salary: 0.05,
    notice: 0.05
  };
  
  const finalScore = 
    semanticScore * weights.semantic +
    skillScore * weights.skills +
    experienceScore * weights.experience +
    behaviorScore * weights.behavior +
    educationScore * weights.education +
    certificationScore * weights.certification +
    locationScore * weights.location +
    salaryScore * weights.salary +
    noticeScore * weights.notice;
    
  const score = Math.round(finalScore * 100) / 100;
  
  // Strengths and Weaknesses determination
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  if (skillScore >= 80) strengths.push("Excellent skills alignment with core requirements");
  if (experienceScore >= 85) strengths.push(`Strong career seniority (${candidate.profile.years_of_experience} yrs of experience)`);
  if (behaviorScore >= 80) strengths.push("Exceptional platform active response rate and high interview completion history");
  if (educationScore >= 80) strengths.push("Tier-1/Tier-2 educational background with technical alignment");
  if (candidate.redrob_signals.notice_period_days <= 30) strengths.push("Short notice period; available to join within 30 days");
  if (candidate.redrob_signals.github_activity_score > 40) strengths.push(`Active GitHub pipeline contributor (Score: ${candidate.redrob_signals.github_activity_score})`);
  
  if (skillScore < 60) weaknesses.push("Missing experience with some required core technologies");
  if (experienceScore < 60) weaknesses.push("Years of experience are below the ideal preferred threshold");
  if (candidate.redrob_signals.notice_period_days > 90) weaknesses.push(`Long notice period of ${candidate.redrob_signals.notice_period_days} days`);
  if (salaryScore < 60) weaknesses.push("Expected salary is higher than the standard specified role budget");
  if (behaviorScore < 50) weaknesses.push("Lower response rates to recruiters on the platform");
  
  if (strengths.length === 0) strengths.push("Solid foundational competence and steady history");
  if (weaknesses.length === 0) weaknesses.push("No significant bottlenecks or immediate concerns found");
  
  // Decide hiring recommendation
  let hiringRecommendation: "Strong Hire" | "Hire" | "Pass" | "Strong Pass" = "Pass";
  if (score >= 88) hiringRecommendation = "Strong Hire";
  else if (score >= 70) hiringRecommendation = "Hire";
  else if (score >= 50) hiringRecommendation = "Pass";
  else hiringRecommendation = "Strong Pass";
  
  // Realistic structured explanation
  let reasoning = `${candidate.profile.current_title} with ${candidate.profile.years_of_experience} years of experience. `;
  reasoning += `Has matched ${skillResults.matches.length} key required skills (${skillResults.matches.slice(0, 3).join(", ")}). `;
  
  if (candidate.redrob_signals.open_to_work_flag) {
    reasoning += "Active job seeker open to work immediately. ";
  }
  
  if (candidate.redrob_signals.notice_period_days > 90) {
    reasoning += `Concern: ${candidate.redrob_signals.notice_period_days}-day notice period. `;
  } else {
    reasoning += `Favorable ${candidate.redrob_signals.notice_period_days}-day notice. `;
  }
  
  return {
    candidate_id: candidate.candidate_id,
    rank: 0, // Assigned later in the main engine loop
    score,
    semanticScore,
    skillScore,
    experienceScore,
    educationScore,
    certificationScore,
    behaviorScore,
    locationScore,
    salaryScore,
    noticeScore,
    strengths,
    weaknesses,
    hiringRecommendation,
    reasoning
  };
}

// Fast word token overlap as local Semantic Similarity
export function calculateSemanticSimilarity(candidate: Candidate, jd: AnalyzedJD): number {
  const jdTokens = new Set([
    jd.title.toLowerCase(),
    ...jd.requiredSkills.map(s => s.toLowerCase()),
    ...jd.industries.map(i => i.toLowerCase())
  ].join(" ").split(/[^a-zA-Z]+/));
  
  const candTokens = new Set([
    candidate.profile.headline.toLowerCase(),
    candidate.profile.summary.toLowerCase(),
    candidate.profile.current_title.toLowerCase(),
    candidate.profile.current_industry.toLowerCase(),
    ...candidate.skills.map(s => s.name.toLowerCase())
  ].join(" ").split(/[^a-zA-Z]+/));
  
  let intersection = 0;
  for (const token of jdTokens) {
    if (token.length > 2 && candTokens.has(token)) {
      intersection++;
    }
  }
  
  const matchRatio = jdTokens.size > 0 ? (intersection / Math.sqrt(jdTokens.size * candTokens.size)) : 0;
  const score = Math.max(30, Math.min(matchRatio * 150 + 40, 100)); // Scaled 30 to 100
  
  return Math.round(score * 100) / 100;
}
