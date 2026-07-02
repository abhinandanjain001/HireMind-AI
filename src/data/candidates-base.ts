export interface Candidate {
  candidate_id: string;
  profile: {
    anonymized_name: string;
    headline: string;
    summary: string;
    location: string;
    country: string;
    years_of_experience: number;
    current_title: string;
    current_company: string;
    current_company_size: string;
    current_industry: string;
  };
  career_history: Array<{
    company: string;
    title: string;
    start_date: string;
    end_date: string | null;
    duration_months: number;
    is_current: boolean;
    industry: string;
    company_size: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field_of_study: string;
    start_year: number;
    end_year: number;
    grade: string | null;
    tier: "tier_1" | "tier_2" | "tier_3" | "tier_4" | "unknown";
  }>;
  skills: Array<{
    name: string;
    proficiency: "beginner" | "intermediate" | "advanced" | "expert";
    endorsements: number;
    duration_months: number;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: number;
  }>;
  languages?: Array<{
    language: string;
    proficiency: "basic" | "conversational" | "professional" | "native";
  }>;
  redrob_signals: {
    profile_completeness_score: number;
    signup_date: string;
    last_active_date: string;
    open_to_work_flag: boolean;
    profile_views_received_30d: number;
    applications_submitted_30d: number;
    recruiter_response_rate: number;
    avg_response_time_hours: number;
    skill_assessment_scores: Record<string, number>;
    connection_count: number;
    endorsements_received: number;
    notice_period_days: number;
    expected_salary_range_inr_lpa: {
      min: number;
      max: number;
    };
    preferred_work_mode: "remote" | "hybrid" | "onsite" | "flexible";
    willing_to_relocate: boolean;
    github_activity_score: number;
    search_appearance_30d: number;
    saved_by_recruiters_30d: number;
    interview_completion_rate: number;
    offer_acceptance_rate: number;
    verified_email: boolean;
    verified_phone: boolean;
    linkedin_connected: boolean;
  };
}

export const BASE_CANDIDATES: Candidate[] = [
  {
    "candidate_id": "CAND_0000001",
    "profile": {
      "anonymized_name": "Ira Vora",
      "headline": "Backend Engineer | SQL, Spark, Cloud",
      "summary": "Software / data professional with 6.9 years of experience building data pipelines, backend systems, and analytics infrastructure. Hybrid backend/data specialist.",
      "location": "Toronto",
      "country": "Canada",
      "years_of_experience": 6.9,
      "current_title": "Backend Engineer",
      "current_company": "Mindtree",
      "current_company_size": "10001+",
      "current_industry": "IT Services"
    },
    "career_history": [
      {
        "company": "Mindtree",
        "title": "Backend Engineer",
        "start_date": "2024-03-08",
        "end_date": null,
        "duration_months": 27,
        "is_current": true,
        "industry": "IT Services",
        "company_size": "10001+",
        "description": "Implemented streaming data pipelines on Kafka and Spark Streaming."
      },
      {
        "company": "Dunder Mifflin",
        "title": "Analytics Engineer",
        "start_date": "2019-07-03",
        "end_date": "2024-01-08",
        "duration_months": 55,
        "is_current": false,
        "industry": "Paper Products",
        "company_size": "201-500",
        "description": "Content writing and SEO strategy, reporting pipelines."
      }
    ],
    "education": [
      {
        "institution": "Lovely Professional University",
        "degree": "B.E.",
        "field_of_study": "Computer Science",
        "start_year": 2015,
        "end_year": 2019,
        "grade": "8.5 CGPA",
        "tier": "tier_3"
      }
    ],
    "skills": [
      { "name": "SQL", "proficiency": "expert", "endorsements": 45, "duration_months": 60 },
      { "name": "Spark", "proficiency": "expert", "endorsements": 35, "duration_months": 48 },
      { "name": "NLP", "proficiency": "advanced", "endorsements": 37, "duration_months": 26 },
      { "name": "Fine-tuning LLMs", "proficiency": "advanced", "endorsements": 21, "duration_months": 36 },
      { "name": "Milvus", "proficiency": "advanced", "endorsements": 40, "duration_months": 35 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 86.9,
      "signup_date": "2024-03-08",
      "last_active_date": "2026-06-25",
      "open_to_work_flag": true,
      "profile_views_received_30d": 85,
      "applications_submitted_30d": 12,
      "recruiter_response_rate": 0.76,
      "avg_response_time_hours": 1.5,
      "skill_assessment_scores": { "SQL": 92, "Spark": 88 },
      "connection_count": 320,
      "endorsements_received": 54,
      "notice_period_days": 30,
      "expected_salary_range_inr_lpa": { "min": 25, "max": 40 },
      "preferred_work_mode": "remote",
      "willing_to_relocate": true,
      "github_activity_score": 78,
      "search_appearance_30d": 120,
      "saved_by_recruiters_30d": 8,
      "interview_completion_rate": 0.95,
      "offer_acceptance_rate": 0.85,
      "verified_email": true,
      "verified_phone": true,
      "linkedin_connected": true
    }
  },
  {
    "candidate_id": "CAND_0000002",
    "profile": {
      "anonymized_name": "Anjali Sharma",
      "headline": "Marketing Manager | Brand Strategy & SEO",
      "summary": "Marketing professional with over 12 years of experience leading cross-functional teams, planning campaigns, and optimizing SEO channels.",
      "location": "Gurgaon",
      "country": "India",
      "years_of_experience": 12.3,
      "current_title": "Marketing Manager",
      "current_company": "Acme Corp",
      "current_company_size": "201-500",
      "current_industry": "Manufacturing"
    },
    "career_history": [
      {
        "company": "Acme Corp",
        "title": "Marketing Manager",
        "start_date": "2017-03-08",
        "end_date": null,
        "duration_months": 110,
        "is_current": true,
        "industry": "Manufacturing",
        "company_size": "201-500",
        "description": "Led visual branding, marketing execution, and SEO content writing."
      }
    ],
    "education": [
      {
        "institution": "Local Engineering College",
        "degree": "B.Sc",
        "field_of_study": "Mathematics",
        "start_year": 2007,
        "end_year": 2011,
        "grade": "77%",
        "tier": "tier_4"
      }
    ],
    "skills": [
      { "name": "Marketing", "proficiency": "expert", "endorsements": 34, "duration_months": 120 },
      { "name": "SEO", "proficiency": "expert", "endorsements": 28, "duration_months": 96 },
      { "name": "Project Management", "proficiency": "intermediate", "endorsements": 14, "duration_months": 23 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 78.7,
      "signup_date": "2025-07-28",
      "last_active_date": "2025-11-12",
      "open_to_work_flag": true,
      "profile_views_received_30d": 7,
      "applications_submitted_30d": 1,
      "recruiter_response_rate": 0.29,
      "avg_response_time_hours": 171.6,
      "skill_assessment_scores": {},
      "connection_count": 179,
      "endorsements_received": 3,
      "notice_period_days": 60,
      "expected_salary_range_inr_lpa": { "min": 8.8, "max": 9.0 },
      "preferred_work_mode": "flexible",
      "willing_to_relocate": false,
      "github_activity_score": -1,
      "search_appearance_30d": 107,
      "saved_by_recruiters_30d": 10,
      "interview_completion_rate": 0.62,
      "offer_acceptance_rate": -1,
      "verified_email": false,
      "verified_phone": false,
      "linkedin_connected": false
    }
  },
  {
    "candidate_id": "CAND_0000003",
    "profile": {
      "anonymized_name": "Yash Agarwal",
      "headline": "Customer Support Engineer | SLA Management",
      "summary": "Professional with experience in customer success, business analysis, and consulting. Deeply focused on processes and customer relations.",
      "location": "Austin",
      "country": "USA",
      "years_of_experience": 1.1,
      "current_title": "Customer Support",
      "current_company": "TCS",
      "current_company_size": "10001+",
      "current_industry": "IT Services"
    },
    "career_history": [
      {
        "company": "TCS",
        "title": "Customer Support",
        "start_date": "2025-05-02",
        "end_date": null,
        "duration_months": 13,
        "is_current": true,
        "industry": "IT Services",
        "company_size": "10001+",
        "description": "Handled enterprise client inquiries, process mapping, and consulting support."
      }
    ],
    "education": [
      {
        "institution": "Chandigarh University",
        "degree": "M.Sc",
        "field_of_study": "Information Technology",
        "start_year": 2017,
        "end_year": 2021,
        "grade": "87%",
        "tier": "tier_3"
      }
    ],
    "skills": [
      { "name": "Excel", "proficiency": "intermediate", "endorsements": 12, "duration_months": 24 },
      { "name": "Kubernetes", "proficiency": "intermediate", "endorsements": 8, "duration_months": 14 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 31.9,
      "signup_date": "2024-08-02",
      "last_active_date": "2026-03-21",
      "open_to_work_flag": false,
      "profile_views_received_30d": 1,
      "applications_submitted_30d": 9,
      "recruiter_response_rate": 0.46,
      "avg_response_time_hours": 119.4,
      "skill_assessment_scores": {},
      "connection_count": 19,
      "endorsements_received": 46,
      "notice_period_days": 150,
      "expected_salary_range_inr_lpa": { "min": 11.2, "max": 18.1 },
      "preferred_work_mode": "hybrid",
      "willing_to_relocate": false,
      "github_activity_score": -1,
      "search_appearance_30d": 28,
      "saved_by_recruiters_30d": 4,
      "interview_completion_rate": 0.86,
      "offer_acceptance_rate": -1,
      "verified_email": true,
      "verified_phone": false,
      "linkedin_connected": false
    }
  },
  {
    "candidate_id": "CAND_0000004",
    "profile": {
      "anonymized_name": "Anil Bose",
      "headline": "Marketing Lead & Design Systems",
      "summary": "Experienced marketer and mechanical engineer with 3.8 years of experience. Solid background in CAD, SolidWorks, and brand design.",
      "location": "Sydney",
      "country": "Australia",
      "years_of_experience": 3.8,
      "current_title": "Marketing Manager",
      "current_company": "Dunder Mifflin",
      "current_company_size": "201-500",
      "current_industry": "Paper Products"
    },
    "career_history": [
      {
        "company": "Dunder Mifflin",
        "title": "Marketing Manager",
        "start_date": "2025-04-02",
        "end_date": null,
        "duration_months": 14,
        "is_current": true,
        "industry": "Paper Products",
        "company_size": "201-500",
        "description": "Led product sub-system marketing campaigns and mechanical prototyping documentation."
      }
    ],
    "education": [
      {
        "institution": "Lovely Professional University",
        "degree": "Ph.D",
        "field_of_study": "Electronics",
        "start_year": 2013,
        "end_year": 2016,
        "grade": "7.61 CGPA",
        "tier": "tier_3"
      }
    ],
    "skills": [
      { "name": "JavaScript", "proficiency": "intermediate", "endorsements": 14, "duration_months": 29 },
      { "name": "Node.js", "proficiency": "intermediate", "endorsements": 1, "duration_months": 20 },
      { "name": "Airflow", "proficiency": "intermediate", "endorsements": 11, "duration_months": 27 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 28.5,
      "signup_date": "2025-07-21",
      "last_active_date": "2026-03-25",
      "open_to_work_flag": false,
      "profile_views_received_30d": 3,
      "applications_submitted_30d": 9,
      "recruiter_response_rate": 0.26,
      "avg_response_time_hours": 104.1,
      "skill_assessment_scores": {},
      "connection_count": 485,
      "endorsements_received": 22,
      "notice_period_days": 120,
      "expected_salary_range_inr_lpa": { "min": 4.6, "max": 6.7 },
      "preferred_work_mode": "onsite",
      "willing_to_relocate": true,
      "github_activity_score": -1,
      "search_appearance_30d": 5,
      "saved_by_recruiters_30d": 8,
      "interview_completion_rate": 0.35,
      "offer_acceptance_rate": -1,
      "verified_email": true,
      "verified_phone": true,
      "linkedin_connected": true
    }
  },
  {
    "candidate_id": "CAND_0000005",
    "profile": {
      "anonymized_name": "Aisha Sethi",
      "headline": "Lead Accountant | Month-End Close & GAAP",
      "summary": "Professional with 11 years of experience in month-end close, financial reporting, statutory compliance (GAAP / Ind-AS), and tax filings. Managed 3 staff accountants.",
      "location": "Gurgaon",
      "country": "India",
      "years_of_experience": 11.0,
      "current_title": "Accountant",
      "current_company": "Stark Industries",
      "current_company_size": "1001-5000",
      "current_industry": "Manufacturing"
    },
    "career_history": [
      {
        "company": "Stark Industries",
        "title": "Accountant",
        "start_date": "2022-02-17",
        "end_date": null,
        "duration_months": 52,
        "is_current": true,
        "industry": "Manufacturing",
        "company_size": "1001-5000",
        "description": "Owned the GL, fixed-asset register, and audit-readiness function. Reduced close cycle."
      }
    ],
    "education": [
      {
        "institution": "Chandigarh University",
        "degree": "M.Sc",
        "field_of_study": "Information Technology",
        "start_year": 2007,
        "end_year": 2012,
        "grade": "87%",
        "tier": "tier_3"
      }
    ],
    "skills": [
      { "name": "SQL", "proficiency": "beginner", "endorsements": 12, "duration_months": 12 },
      { "name": "Tailwind", "proficiency": "intermediate", "endorsements": 15, "duration_months": 35 },
      { "name": "Image Classification", "proficiency": "advanced", "endorsements": 50, "duration_months": 38 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 84.6,
      "signup_date": "2023-10-07",
      "last_active_date": "2025-10-01",
      "open_to_work_flag": true,
      "profile_views_received_30d": 12,
      "applications_submitted_30d": 2,
      "recruiter_response_rate": 0.37,
      "avg_response_time_hours": 116.7,
      "skill_assessment_scores": {},
      "connection_count": 300,
      "endorsements_received": 14,
      "notice_period_days": 30,
      "expected_salary_range_inr_lpa": { "min": 12.4, "max": 19.7 },
      "preferred_work_mode": "hybrid",
      "willing_to_relocate": true,
      "github_activity_score": -1,
      "search_appearance_30d": 67,
      "saved_by_recruiters_30d": 1,
      "interview_completion_rate": 0.74,
      "offer_acceptance_rate": -1,
      "verified_email": false,
      "verified_phone": true,
      "linkedin_connected": true
    }
  },
  {
    "candidate_id": "CAND_0000006",
    "profile": {
      "anonymized_name": "Rajesh Desai",
      "headline": "Senior Business Analyst",
      "summary": "Business Analyst with 6 years of experience. Strong stakeholder management, structured problem-solving, and consulting advice.",
      "location": "Austin",
      "country": "USA",
      "years_of_experience": 6.0,
      "current_title": "Business Analyst",
      "current_company": "Wayne Enterprises",
      "current_company_size": "10001+",
      "current_industry": "IT Services"
    },
    "career_history": [
      {
        "company": "Wayne Enterprises",
        "title": "Business Analyst",
        "start_date": "2023-09-10",
        "end_date": null,
        "duration_months": 33,
        "is_current": true,
        "industry": "Conglomerate",
        "company_size": "10001+",
        "description": "Owned reporting, stakeholder consulting and process re-engineering diagnostics."
      }
    ],
    "education": [
      {
        "institution": "Lovely Professional University",
        "degree": "B.Sc",
        "field_of_study": "Artificial Intelligence",
        "start_year": 2005,
        "end_year": 2008,
        "grade": "9.26 CGPA",
        "tier": "tier_3"
      }
    ],
    "skills": [
      { "name": "Django", "proficiency": "intermediate", "endorsements": 3, "duration_months": 11 },
      { "name": "SEO", "proficiency": "intermediate", "endorsements": 13, "duration_months": 31 },
      { "name": "Terraform", "proficiency": "beginner", "endorsements": 4, "duration_months": 13 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 29.7,
      "signup_date": "2026-04-26",
      "last_active_date": "2026-02-28",
      "open_to_work_flag": false,
      "profile_views_received_30d": 53,
      "applications_submitted_30d": 8,
      "recruiter_response_rate": 0.12,
      "avg_response_time_hours": 172.1,
      "skill_assessment_scores": {},
      "connection_count": 389,
      "endorsements_received": 29,
      "notice_period_days": 150,
      "expected_salary_range_inr_lpa": { "min": 7.7, "max": 11.7 },
      "preferred_work_mode": "remote",
      "willing_to_relocate": true,
      "github_activity_score": -1,
      "search_appearance_30d": 131,
      "saved_by_recruiters_30d": 9,
      "interview_completion_rate": 0.57,
      "offer_acceptance_rate": -1,
      "verified_email": true,
      "verified_phone": true,
      "linkedin_connected": false
    }
  },
  {
    "candidate_id": "CAND_0000007",
    "profile": {
      "anonymized_name": "Vihaan Bose",
      "headline": "AI Engineer & Data Scientist",
      "summary": "Highly motivated developer with 5.5 years of experience in data modeling, statistical analysis, and machine learning.",
      "location": "Gurgaon",
      "country": "India",
      "years_of_experience": 5.5,
      "current_title": "Civil Engineer",
      "current_company": "Wipro",
      "current_company_size": "10001+",
      "current_industry": "IT Services"
    },
    "career_history": [
      {
        "company": "Wipro",
        "title": "Civil Engineer",
        "start_date": "2023-04-13",
        "end_date": null,
        "duration_months": 38,
        "is_current": true,
        "industry": "IT Services",
        "company_size": "10001+",
        "description": "Architected database storage structures, managed analytics queries."
      }
    ],
    "education": [
      {
        "institution": "SRM University",
        "degree": "M.E.",
        "field_of_study": "Data Science",
        "start_year": 2009,
        "end_year": 2013,
        "grade": "8.28 CGPA",
        "tier": "tier_2"
      }
    ],
    "skills": [
      { "name": "MongoDB", "proficiency": "intermediate", "endorsements": 13, "duration_months": 9 },
      { "name": "Spark", "proficiency": "beginner", "endorsements": 14, "duration_months": 14 },
      { "name": "Content Writing", "proficiency": "beginner", "endorsements": 12, "duration_months": 14 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 74.6,
      "signup_date": "2025-09-29",
      "last_active_date": "2026-05-25",
      "open_to_work_flag": false,
      "profile_views_received_30d": 2,
      "applications_submitted_30d": 1,
      "recruiter_response_rate": 0.62,
      "avg_response_time_hours": 61.3,
      "skill_assessment_scores": {},
      "connection_count": 122,
      "endorsements_received": 50,
      "notice_period_days": 30,
      "expected_salary_range_inr_lpa": { "min": 6.7, "max": 14.6 },
      "preferred_work_mode": "onsite",
      "willing_to_relocate": true,
      "github_activity_score": -1,
      "search_appearance_30d": 104,
      "saved_by_recruiters_30d": 8,
      "interview_completion_rate": 0.47,
      "offer_acceptance_rate": -1,
      "verified_email": true,
      "verified_phone": true,
      "linkedin_connected": true
    }
  },
  {
    "candidate_id": "CAND_0000008",
    "profile": {
      "anonymized_name": "Shaurya Chatterjee",
      "headline": "Operations Lead | Demand Generation & CRM",
      "summary": "Operations specialist with 3.6 years of experience in demand generation, email outreach, marketing automation, and product pipelines.",
      "location": "Noida",
      "country": "India",
      "years_of_experience": 3.6,
      "current_title": "Operations Manager",
      "current_company": "Wipro",
      "current_company_size": "10001+",
      "current_industry": "IT Services"
    },
    "career_history": [
      {
        "company": "Wipro",
        "title": "Operations Manager",
        "start_date": "2022-11-14",
        "end_date": null,
        "duration_months": 43,
        "is_current": true,
        "industry": "IT Services",
        "company_size": "10001+",
        "description": "Led demand-generation pipelines, SEO channels, and perf marketing integrations."
      }
    ],
    "education": [
      {
        "institution": "Anna University",
        "degree": "B.Tech",
        "field_of_study": "Data Science",
        "start_year": 2008,
        "end_year": 2012,
        "grade": "8.60 CGPA",
        "tier": "tier_2"
      }
    ],
    "skills": [
      { "name": "Java", "proficiency": "intermediate", "endorsements": 2, "duration_months": 32 },
      { "name": "TypeScript", "proficiency": "intermediate", "endorsements": 14, "duration_months": 11 },
      { "name": "Rust", "proficiency": "intermediate", "endorsements": 12, "duration_months": 16 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 63.0,
      "signup_date": "2022-06-26",
      "last_active_date": "2025-12-13",
      "open_to_work_flag": false,
      "profile_views_received_30d": 28,
      "applications_submitted_30d": 5,
      "recruiter_response_rate": 0.42,
      "avg_response_time_hours": 98.4,
      "skill_assessment_scores": {},
      "connection_count": 285,
      "endorsements_received": 7,
      "notice_period_days": 90,
      "expected_salary_range_inr_lpa": { "min": 6.6, "max": 17.2 },
      "preferred_work_mode": "onsite",
      "willing_to_relocate": false,
      "github_activity_score": -1,
      "search_appearance_30d": 91,
      "saved_by_recruiters_30d": 0,
      "interview_completion_rate": 0.74,
      "offer_acceptance_rate": -1,
      "verified_email": true,
      "verified_phone": true,
      "linkedin_connected": false
    }
  },
  {
    "candidate_id": "CAND_0000009",
    "profile": {
      "anonymized_name": "Amit Shah",
      "headline": "Mechanical Engineer & Product Architect",
      "summary": "11 years of experience in product architecture, CAD/FEA modeling, SolidWorks, mechanical engineering and business analytics.",
      "location": "New York",
      "country": "USA",
      "years_of_experience": 11.0,
      "current_title": "Mechanical Engineer",
      "current_company": "Dunder Mifflin",
      "current_company_size": "201-500",
      "current_industry": "Paper Products"
    },
    "career_history": [
      {
        "company": "Dunder Mifflin",
        "title": "Mechanical Engineer",
        "start_date": "2022-10-15",
        "end_date": null,
        "duration_months": 44,
        "is_current": true,
        "industry": "Paper Products",
        "company_size": "201-500",
        "description": "Conducted business diagnostics, process re-engineering, and CAD design."
      }
    ],
    "education": [
      {
        "institution": "KIIT University",
        "degree": "B.Tech",
        "field_of_study": "Electronics",
        "start_year": 2009,
        "end_year": 2014,
        "grade": "7.89 CGPA",
        "tier": "tier_3"
      }
    ],
    "skills": [
      { "name": "Go", "proficiency": "intermediate", "endorsements": 12, "duration_months": 20 },
      { "name": "OpenCV", "proficiency": "intermediate", "endorsements": 12, "duration_months": 36 },
      { "name": "Snowflake", "proficiency": "intermediate", "endorsements": 5, "duration_months": 8 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 39.6,
      "signup_date": "2025-10-19",
      "last_active_date": "2026-01-27",
      "open_to_work_flag": false,
      "profile_views_received_30d": 50,
      "applications_submitted_30d": 8,
      "recruiter_response_rate": 0.53,
      "avg_response_time_hours": 202.0,
      "skill_assessment_scores": {},
      "connection_count": 516,
      "endorsements_received": 34,
      "notice_period_days": 150,
      "expected_salary_range_inr_lpa": { "min": 16.0, "max": 17.3 },
      "preferred_work_mode": "remote",
      "willing_to_relocate": false,
      "github_activity_score": -1,
      "search_appearance_30d": 74,
      "saved_by_recruiters_30d": 1,
      "interview_completion_rate": 0.54,
      "offer_acceptance_rate": 0.48,
      "verified_email": true,
      "verified_phone": true,
      "linkedin_connected": false
    }
  },
  {
    "candidate_id": "CAND_0000010",
    "profile": {
      "anonymized_name": "Aarav Kapoor",
      "headline": "Senior Data Engineer | Python, Spark, MLOps",
      "summary": "Data specialist with 4.6 years of experience building pipelines and analytic workflows. Expert in computer vision, GANs, and prompt engineering.",
      "location": "London",
      "country": "UK",
      "years_of_experience": 4.6,
      "current_title": "Data Engineer",
      "current_company": "Ola",
      "current_company_size": "5001-10000",
      "current_industry": "Transportation"
    },
    "career_history": [
      {
        "company": "Ola",
        "title": "Data Engineer",
        "start_date": "2021-11-19",
        "end_date": null,
        "duration_months": 55,
        "is_current": true,
        "industry": "Transportation",
        "company_size": "5001-10000",
        "description": "Spent 30% on sklearn/XGBoost modeling, 70% on data infrastructure/dashboards."
      }
    ],
    "education": [
      {
        "institution": "Generic State University",
        "degree": "B.E.",
        "field_of_study": "Mathematics",
        "start_year": 2007,
        "end_year": 2011,
        "grade": "85%",
        "tier": "tier_4"
      }
    ],
    "skills": [
      { "name": "Python", "proficiency": "intermediate", "endorsements": 7, "duration_months": 14 },
      { "name": "GANs", "proficiency": "advanced", "endorsements": 58, "duration_months": 57 },
      { "name": "Prompt Engineering", "proficiency": "advanced", "endorsements": 42, "duration_months": 35 },
      { "name": "Object Detection", "proficiency": "advanced", "endorsements": 55, "duration_months": 58 },
      { "name": "OpenCV", "proficiency": "advanced", "endorsements": 30, "duration_months": 24 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 81.6,
      "signup_date": "2026-01-18",
      "last_active_date": "2026-05-20",
      "open_to_work_flag": false,
      "profile_views_received_30d": 23,
      "applications_submitted_30d": 2,
      "recruiter_response_rate": 0.34,
      "avg_response_time_hours": 177.8,
      "skill_assessment_scores": { "NLP": 38.8, "Image Classification": 64.8, "Prompt Engineering": 75 },
      "connection_count": 356,
      "endorsements_received": 35,
      "notice_period_days": 60,
      "expected_salary_range_inr_lpa": { "min": 18.7, "max": 36.1 },
      "preferred_work_mode": "onsite",
      "willing_to_relocate": false,
      "github_activity_score": 9.2,
      "search_appearance_30d": 249,
      "saved_by_recruiters_30d": 4,
      "interview_completion_rate": 0.71,
      "offer_acceptance_rate": 0.58,
      "verified_email": true,
      "verified_phone": true,
      "linkedin_connected": false
    }
  },
  {
    "candidate_id": "CAND_0000031",
    "profile": {
      "anonymized_name": "Ela Singh",
      "headline": "Recommendation Systems Engineer | Search & Retrieval",
      "summary": "Machine Learning Engineer with 6.0 years of experience building recommendation models, search architectures, and vector indexing services. Expert in retrieval evaluation.",
      "location": "Hyderabad",
      "country": "India",
      "years_of_experience": 6.0,
      "current_title": "Recommendation Systems Engineer",
      "current_company": "Swiggy",
      "current_company_size": "5001-10000",
      "current_industry": "Food Delivery"
    },
    "career_history": [
      {
        "company": "Swiggy",
        "title": "Recommendation Systems Engineer",
        "start_date": "2025-04-02",
        "end_date": null,
        "duration_months": 14,
        "is_current": true,
        "industry": "Food Delivery",
        "company_size": "5001-10000",
        "description": "Shipped LightGBM discovery ranking feeds. Guided target optimization."
      }
    ],
    "education": [
      {
        "institution": "SRM University",
        "degree": "M.Tech",
        "field_of_study": "Computer Engineering",
        "start_year": 2002,
        "end_year": 2006,
        "grade": "9.16 CGPA",
        "tier": "tier_2"
      }
    ],
    "skills": [
      { "name": "FAISS", "proficiency": "advanced", "endorsements": 19, "duration_months": 35 },
      { "name": "Pinecone", "proficiency": "expert", "endorsements": 34, "duration_months": 88 },
      { "name": "Embeddings", "proficiency": "expert", "endorsements": 48, "duration_months": 60 },
      { "name": "Sentence Transformers", "proficiency": "expert", "endorsements": 16, "duration_months": 69 },
      { "name": "scikit-learn", "proficiency": "advanced", "endorsements": 41, "duration_months": 60 }
    ],
    "redrob_signals": {
      "profile_completeness_score": 83.4,
      "signup_date": "2026-01-28",
      "last_active_date": "2026-05-24",
      "open_to_work_flag": true,
      "profile_views_received_30d": 194,
      "applications_submitted_30d": 2,
      "recruiter_response_rate": 0.91,
      "avg_response_time_hours": 76.1,
      "skill_assessment_scores": { "MLflow": 75.1, "FAISS": 68.4, "Pinecone": 53.6 },
      "connection_count": 832,
      "endorsements_received": 177,
      "notice_period_days": 60,
      "expected_salary_range_inr_lpa": { "min": 27.3, "max": 60.2 },
      "preferred_work_mode": "flexible",
      "willing_to_relocate": true,
      "github_activity_score": 32.6,
      "search_appearance_30d": 778,
      "saved_by_recruiters_30d": 13,
      "interview_completion_rate": 0.6,
      "offer_acceptance_rate": 0.38,
      "verified_email": false,
      "verified_phone": true,
      "linkedin_connected": false
    }
  }
];
