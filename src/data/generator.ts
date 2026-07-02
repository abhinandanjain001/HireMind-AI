import { Candidate, BASE_CANDIDATES } from "./candidates-base";

const FIRST_NAMES = ["Aarav", "Aanya", "Aditya", "Anika", "Arjun", "Diya", "Ira", "Kabir", "Kavya", "Krishna", "Myra", "Nikhil", "Pooja", "Pranav", "Rohan", "Saanvi", "Samar", "Tanya", "Vihaan", "Vivaan", "Amit", "Siddharth", "Rahul", "Neha", "Ritu", "Avni", "Rajesh", "Priya", "Vikram"];
const LAST_NAMES = ["Agarwal", "Bansal", "Bose", "Chatterjee", "Desai", "Iyengar", "Joshi", "Kapoor", "Khanna", "Kumar", "Malhotra", "Mehra", "Mishra", "Mukherjee", "Nair", "Pandey", "Patel", "Reddy", "Sethi", "Vora", "Shah", "Sen", "Trivedi", "Khanna", "Chowdary", "Naidu", "Pillai"];

const LOCATIONS = [
  { city: "Mumbai", country: "India" },
  { city: "Gurgaon", country: "India" },
  { city: "Bangalore", country: "India" },
  { city: "Hyderabad", country: "India" },
  { city: "Noida", country: "India" },
  { city: "Pune", country: "India" },
  { city: "Chennai", country: "India" },
  { city: "Kolkata", country: "India" },
  { city: "Delhi", country: "India" },
  { city: "Toronto", country: "Canada" },
  { city: "London", country: "UK" },
  { city: "New York", country: "USA" },
  { city: "San Francisco", country: "USA" },
  { city: "Austin", country: "USA" },
  { city: "Sydney", country: "Australia" },
  { city: "Berlin", country: "Germany" },
  { city: "Dubai", country: "UAE" }
];

const ROLES = [
  {
    title: "Backend Engineer",
    headline: "Backend Engineer | SQL, Node.js, Cloud",
    industry: "Software",
    skills: ["SQL", "Node.js", "Express", "PostgreSQL", "AWS", "Git", "REST APIs", "Redis"]
  },
  {
    title: "Frontend Engineer",
    headline: "Frontend Architect | React, TypeScript, Tailwind",
    industry: "Software",
    skills: ["React", "TypeScript", "JavaScript", "Tailwind", "CSS", "Git", "Webpack", "Next.js"]
  },
  {
    title: "Full Stack Developer",
    headline: "Full Stack Developer | React, Node.js, Cloud Solutions",
    industry: "Software",
    skills: ["React", "Node.js", "TypeScript", "SQL", "MongoDB", "Express", "Docker", "Git"]
  },
  {
    title: "DevOps Engineer",
    headline: "DevOps & Cloud Engineer | Kubernetes, Terraform, CI/CD",
    industry: "IT Services",
    skills: ["Kubernetes", "Terraform", "Docker", "AWS", "CI/CD", "Git", "Linux", "GCP"]
  },
  {
    title: "Data Engineer",
    headline: "Data Engineer | Spark, BigQuery, Airflow Pipelines",
    industry: "IT Services",
    skills: ["Spark", "Airflow", "SQL", "Python", "BigQuery", "Snowflake", "ETL", "Kafka"]
  },
  {
    title: "Machine Learning Engineer",
    headline: "ML / NLP Engineer | PyTorch, Hugging Face, LLMs",
    industry: "AI/ML",
    skills: ["Python", "ML", "PyTorch", "Hugging Face Transformers", "Sentence Transformers", "Embeddings", "NLP", "scikit-learn"]
  },
  {
    title: "Recommendation Systems Engineer",
    headline: "ML Engineer | Search, Ranking & Retrieval",
    industry: "AI/ML",
    skills: ["Python", "ML", "FAISS", "Pinecone", "Milvus", "Embeddings", "scikit-learn", "Object Detection"]
  },
  {
    title: "Project Manager",
    headline: "Technical Project Manager | Agile Delivery & Scrum",
    industry: "IT Services",
    skills: ["Project Management", "Agile", "Scrum", "Excel", "PowerPoint", "Jira", "Salesforce CRM"]
  },
  {
    title: "Operations Manager",
    headline: "Operations & Logistics Manager | Process Optimization",
    industry: "Manufacturing",
    skills: ["Project Management", "Excel", "Six Sigma", "SAP", "Operations", "Agile"]
  },
  {
    title: "Business Analyst",
    headline: "Business Intelligence & Strategy Analyst",
    industry: "IT Services",
    skills: ["SQL", "Excel", "PowerPoint", "Tableau", "Python", "Scrum", "Agile"]
  },
  {
    title: "Accountant",
    headline: "Chartered Accountant | Ind-AS, GAAP & Tally",
    industry: "IT Services",
    skills: ["Accounting", "Excel", "Tally", "GAAP", "Taxation", "PowerPoint"]
  },
  {
    title: "Customer Support",
    headline: "Customer Success Lead | Technical SLA Management",
    industry: "IT Services",
    skills: ["Customer Support", "Excel", "SLA Management", "Jira", "Zendesk"]
  },
  {
    title: "QA Engineer",
    headline: "Test Automation Engineer | Selenium, Cypress",
    industry: "Software",
    skills: ["QA Automation", "Selenium", "Cypress", "JavaScript", "Python", "Git"]
  },
  {
    title: "HR Manager",
    headline: "Talent Acquisition & HR Business Partner",
    industry: "IT Services",
    skills: ["Recruitment", "HR Policies", "Excel", "Communication", "Sourcing"]
  }
];

const COMPANIES = ["Mindtree", "TCS", "Wipro", "Infosys", "Cognizant", "Tech Mahindra", "Stark Industries", "Acme Corp", "Dunder Mifflin", "Initech", "Globex Inc", "Pied Piper", "Hooli", "Zomato", "Swiggy", "Ola", "CRED", "Razorpay", "Flipkart", "Google", "Amazon", "Microsoft", "Meta"];
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10001+"];

const INSTITUTIONS = [
  { name: "IIT Bombay", tier: "tier_1" as const },
  { name: "IIT Delhi", tier: "tier_1" as const },
  { name: "IIT Madras", tier: "tier_1" as const },
  { name: "IISc Bangalore", tier: "tier_1" as const },
  { name: "BITS Pilani", tier: "tier_1" as const },
  { name: "Delhi College of Engineering", tier: "tier_2" as const },
  { name: "Anna University", tier: "tier_2" as const },
  { name: "SRM University", tier: "tier_2" as const },
  { name: "VIT Chennai", tier: "tier_3" as const },
  { name: "Lovely Professional University", tier: "tier_3" as const },
  { name: "Amity University", tier: "tier_3" as const },
  { name: "Chandigarh University", tier: "tier_3" as const },
  { name: "Local Engineering College", tier: "tier_4" as const },
  { name: "Generic State University", tier: "tier_4" as const }
];

const DEGREES = ["B.E.", "B.Tech", "M.Tech", "M.Sc", "Ph.D", "B.Sc", "MBA", "MCA"];
const FIELDS = ["Computer Science", "Information Technology", "Data Science", "Machine Learning", "Artificial Intelligence", "Electronics", "Mathematics", "Statistics", "Mechanical Engineering", "Civil Engineering", "Physics", "Commerce"];

const CERTIFICATIONS_POOL = [
  { name: "AWS Certified Solutions Architect", issuer: "AWS" },
  { name: "AWS Certified Cloud Practitioner", issuer: "AWS" },
  { name: "Google Cloud Professional Data Engineer", issuer: "Google" },
  { name: "Microsoft Certified: Azure Fundamentals", issuer: "Microsoft" },
  { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF" },
  { name: "Snowflake SnowPro Core", issuer: "Snowflake" },
  { name: "Databricks Certified Associate Developer", issuer: "Databricks" },
  { name: "Scrum Master Certified", issuer: "Scrum Alliance" },
  { name: "Six Sigma Green Belt", issuer: "ASQ" }
];

export function generateSyntheticCandidate(idNum: number): Candidate {
  const randElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randRange = (min: number, max: number): number => Math.random() * (max - min) + min;
  const randInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
  const randBool = (probability = 0.5): boolean => Math.random() < probability;

  const candidate_id = `CAND_${String(idNum).padStart(7, "0")}`;
  const firstName = randElement(FIRST_NAMES);
  const lastName = randElement(LAST_NAMES);
  const anonymized_name = `${firstName} ${lastName}`;

  const role = randElement(ROLES);
  const loc = randElement(LOCATIONS);

  const years_of_experience = Math.round(randRange(1.0, 15.0) * 10) / 10;
  const current_company = randElement(COMPANIES);
  const current_company_size = randElement(COMPANY_SIZES);

  // Profile
  const profile = {
    anonymized_name,
    headline: role.headline,
    summary: `Professional with ${years_of_experience} years of experience in my domain. Highly skilled in ${role.skills.slice(0, 3).join(", ")}. Comfort zone is in building reliable systems, driving SLA compliance, and cross-functional leadership. Looking for roles to grow my technical scope.`,
    location: loc.city,
    country: loc.country,
    years_of_experience,
    current_title: role.title,
    current_company,
    current_company_size,
    current_industry: role.industry
  };

  // Career History (1 or 2 items)
  const career_history = [
    {
      company: current_company,
      title: role.title,
      start_date: "2023-01-15",
      end_date: null,
      duration_months: randInt(12, 40),
      is_current: true,
      industry: role.industry,
      company_size: current_company_size,
      description: `Led development, managed reporting pipelines, and collaborated on core deliverables using ${role.skills.slice(0, 2).join(", ")}.`
    }
  ];

  if (years_of_experience > 4) {
    const prevCompany = randElement(COMPANIES.filter(c => c !== current_company));
    career_history.push({
      company: prevCompany,
      title: `Associate ${role.title}`,
      start_date: "2019-06-10",
      end_date: "2022-12-20",
      duration_months: randInt(24, 48),
      is_current: false,
      industry: role.industry,
      company_size: randElement(COMPANY_SIZES),
      description: `Contributed to backend infrastructure, improved search metrics, and automated reporting systems.`
    });
  }

  // Education (1 item)
  const inst = randElement(INSTITUTIONS);
  const start_year = randInt(2005, 2018);
  const education = [
    {
      institution: inst.name,
      degree: randElement(DEGREES),
      field_of_study: randElement(FIELDS),
      start_year,
      end_year: start_year + randInt(3, 4),
      grade: randBool(0.7) ? `${randRange(6.5, 9.5).toFixed(2)} CGPA` : `${randInt(65, 95)}%`,
      tier: inst.tier
    }
  ];

  // Skills
  const skills: Array<{ name: string; proficiency: "beginner" | "intermediate" | "advanced" | "expert"; endorsements: number; duration_months: number; }> = role.skills.map((skillName, index) => {
    const profs: Array<"beginner" | "intermediate" | "advanced" | "expert"> = ["beginner", "intermediate", "advanced", "expert"];
    const proficiency = index < 3 ? randElement<"beginner" | "intermediate" | "advanced" | "expert">(["advanced", "expert"]) : randElement(profs);
    return {
      name: skillName,
      proficiency,
      endorsements: randInt(0, 80),
      duration_months: randInt(6, Math.floor(years_of_experience * 12))
    };
  });

  // Dynamic add some adjacent/AI/ML skills to 15% of candidates for variety
  if (idNum % 7 === 0) {
    skills.push({
      name: "FAISS",
      proficiency: "intermediate",
      endorsements: randInt(2, 20),
      duration_months: randInt(6, 24)
    });
    skills.push({
      name: "Pinecone",
      proficiency: "intermediate",
      endorsements: randInt(1, 15),
      duration_months: randInt(6, 24)
    });
  }

  // Certifications (0 to 2)
  const certifications: Array<{ name: string; issuer: string; year: number }> = [];
  if (randBool(0.4)) {
    const cert = randElement(CERTIFICATIONS_POOL);
    certifications.push({
      name: cert.name,
      issuer: cert.issuer,
      year: randInt(2018, 2026)
    });
  }

  // Languages
  const languages: Array<{ language: string; proficiency: "basic" | "conversational" | "professional" | "native" }> = [
    { language: "English", proficiency: randElement(["professional", "native"]) }
  ];
  if (randBool(0.8)) {
    languages.push({ language: "Hindi", proficiency: randElement(["conversational", "professional", "native"]) });
  }

  // Redrob Signals (All 23 signals matching schema)
  const open_to_work_flag = randBool(0.45);
  const verified_email = randBool(0.85);
  const verified_phone = randBool(0.75);
  const linkedin_connected = randBool(0.6);
  
  // Notice period days influence
  let notice_period_days = randElement([0, 15, 30, 45, 60, 90, 120, 150]);
  if (open_to_work_flag) notice_period_days = randElement([0, 15, 30]);

  // Expected salary range INR LPA
  const minSal = Math.round(randRange(years_of_experience * 1.5, years_of_experience * 3.5) * 10) / 10;
  const maxSal = Math.round((minSal + randRange(3.0, 15.0)) * 10) / 10;

  const skill_assessment_scores: Record<string, number> = {};
  if (skills.length > 0) {
    skill_assessment_scores[skills[0].name] = randInt(35, 98);
  }

  const redrob_signals = {
    profile_completeness_score: Math.round(randRange(50.0, 100.0) * 10) / 10,
    signup_date: `2024-${String(randInt(1, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`,
    last_active_date: `2026-06-${String(randInt(1, 30)).padStart(2, "0")}`,
    open_to_work_flag,
    profile_views_received_30d: randInt(0, 150),
    applications_submitted_30d: randInt(0, 15),
    recruiter_response_rate: Math.round(randRange(0.05, 0.98) * 100) / 100,
    avg_response_time_hours: Math.round(randRange(1.0, 250.0) * 10) / 10,
    skill_assessment_scores,
    connection_count: randInt(10, 1200),
    endorsements_received: randInt(0, 120),
    notice_period_days,
    expected_salary_range_inr_lpa: {
      min: minSal,
      max: maxSal
    },
    preferred_work_mode: randElement(["remote", "hybrid", "onsite", "flexible"] as const),
    willing_to_relocate: randBool(0.4),
    github_activity_score: role.title.match(/(Engineer|Developer)/) ? (randBool(0.6) ? randInt(10, 95) : -1) : -1,
    search_appearance_30d: randInt(2, 600),
    saved_by_recruiters_30d: randInt(0, 20),
    interview_completion_rate: Math.round(randRange(0.3, 1.0) * 100) / 100,
    offer_acceptance_rate: randBool(0.7) ? Math.round(randRange(0.2, 1.0) * 100) / 100 : -1,
    verified_email,
    verified_phone,
    linkedin_connected
  };

  return {
    candidate_id,
    profile,
    career_history,
    education,
    skills,
    certifications,
    languages,
    redrob_signals
  };
}

// Generate the full list of 100,000 candidates
export function generateAllCandidates(): Candidate[] {
  console.log("Starting procedural candidate generation...");
  const candidates = [...BASE_CANDIDATES];
  
  // Add base count
  const targetCount = 100000;
  const startNum = candidates.length + 1;
  
  // Fill remaining synthetically
  for (let i = startNum; i <= targetCount; i++) {
    candidates.push(generateSyntheticCandidate(i));
  }
  
  console.log(`Procedural generation complete! Total candidates: ${candidates.length}`);
  return candidates;
}
