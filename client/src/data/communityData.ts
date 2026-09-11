import { DEPARTMENTS } from "./academicConstants";

export interface CommunityAnswer {
  id: string;
  questionId: string;
  authorId: string;
  authorUsername: string; // e.g. u/karthik_senior
  authorDepartment: string;
  authorYear: number;
  authorFlair?: string; // e.g. "Senior Mentor", "CSE '26"
  content: string;
  codeSnippet?: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface CommunityQuestion {
  id: string;
  authorId: string;
  authorUsername: string; // e.g. u/rahul_v
  authorDepartment: string;
  authorYear: number;
  authorFlair?: string;
  subCommunity: "r/all" | "r/cse" | "r/aiml" | "r/datascience" | "r/cybersec" | "r/bigdata" | "r/ece" | "r/eee" | "r/mech" | "r/civil" | "r/placements" | "r/general";
  title: string;
  content: string;
  codeSnippet?: string;
  department: typeof DEPARTMENTS[number] | "General Engineering";
  subject: string;
  semester: number;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote?: 1 | -1 | 0;
  views: number;
  isResolved: boolean;
  acceptedAnswerId?: string;
  createdAt: string;
  answers: CommunityAnswer[];
}

export const SUB_COMMUNITIES = [
  { id: "r/all", label: "r/all", desc: "All-in-One Community Feed", icon: "🌐" },
  { id: "r/cse", label: "r/cse", desc: "Computer Science & Engineering", icon: "💻" },
  { id: "r/aiml", label: "r/aiml", desc: "CSE (AI & Machine Learning)", icon: "🤖" },
  { id: "r/datascience", label: "r/datascience", desc: "CSE (Data Science & Analytics)", icon: "📊" },
  { id: "r/cybersec", label: "r/cybersec", desc: "CSE (Cyber Security & Defense)", icon: "🛡️" },
  { id: "r/bigdata", label: "r/bigdata", desc: "CSE (Big Data Analytics)", icon: "🗄️" },
  { id: "r/ece", label: "r/ece", desc: "Electronics & Communication", icon: "⚡" },
  { id: "r/eee", label: "r/eee", desc: "Electrical & Electronics", icon: "🔋" },
  { id: "r/mech", label: "r/mech", desc: "Mechanical Engineering", icon: "⚙️" },
  { id: "r/civil", label: "r/civil", desc: "Civil Engineering", icon: "🏗️" },
  { id: "r/placements", label: "r/placements", desc: "Placements, Resumes & Drives", icon: "💼" },
  { id: "r/general", label: "r/general", desc: "General Campus & Student Life", icon: "🎓" },
] as const;

// Real community questions only - populated by active students and faculty
export const INITIAL_COMMUNITY_QUESTIONS: CommunityQuestion[] = [];
