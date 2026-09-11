import {
  CommunityQuestion,
  CommunityAnswer,
  INITIAL_COMMUNITY_QUESTIONS,
} from "@/data/communityData";

const STORAGE_KEY = "amrita_community_posts_v3";

export const getCommunityQuestions = (): CommunityQuestion[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: CommunityQuestion[] = JSON.parse(saved);
      return parsed.filter((q) => !["q-1", "q-2", "q-3", "q-4", "q-5", "q-6"].includes(q.id));
    }
  } catch (err) {
    console.error("Error reading community questions from localStorage", err);
  }
  return [];
};

const saveCommunityQuestions = (questions: CommunityQuestion[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error("Error saving community questions", err);
  }
};

export const getQuestionById = (id: string): CommunityQuestion | null => {
  const all = getCommunityQuestions();
  return all.find((q) => q.id === id) || null;
};

export interface CreateQuestionInput {
  title: string;
  content: string;
  codeSnippet?: string;
  subCommunity: any;
  department: string;
  subject: string;
  semester: number;
  tags: string[];
  authorUsername: string;
  authorDepartment: string;
  authorYear: number;
  authorFlair?: string;
  authorId?: string;
}

export const createQuestion = (input: CreateQuestionInput): CommunityQuestion => {
  const all = getCommunityQuestions();
  const username = input.authorUsername?.startsWith("u/")
    ? input.authorUsername
    : `u/${input.authorUsername || "student"}`;

  const newQuestion: CommunityQuestion = {
    id: `q-${Date.now()}`,
    authorId: input.authorId || `u-${Date.now()}`,
    authorUsername: username,
    authorDepartment: input.authorDepartment,
    authorYear: input.authorYear || 2,
    authorFlair: input.authorFlair || `${input.department.slice(0, 4)} Year ${input.authorYear}`,
    subCommunity: input.subCommunity || "r/all",
    title: input.title,
    content: input.content,
    codeSnippet: input.codeSnippet?.trim() ? input.codeSnippet.trim() : undefined,
    department: input.department as any,
    subject: input.subject,
    semester: input.semester,
    tags: input.tags,
    upvotes: 1,
    downvotes: 0,
    userVote: 1,
    views: 1,
    isResolved: false,
    createdAt: new Date().toISOString(),
    answers: [],
  };

  const updated = [newQuestion, ...all];
  saveCommunityQuestions(updated);
  return newQuestion;
};

export interface CreateAnswerInput {
  questionId: string;
  content: string;
  codeSnippet?: string;
  authorUsername: string;
  authorDepartment: string;
  authorYear: number;
  authorFlair?: string;
  authorId?: string;
}

export const createAnswer = (input: CreateAnswerInput): CommunityAnswer | null => {
  const all = getCommunityQuestions();
  const qIndex = all.findIndex((q) => q.id === input.questionId);
  if (qIndex === -1) return null;

  const username = input.authorUsername?.startsWith("u/")
    ? input.authorUsername
    : `u/${input.authorUsername || "senior"}`;

  const newAnswer: CommunityAnswer = {
    id: `ans-${Date.now()}`,
    questionId: input.questionId,
    authorId: input.authorId || `u-${Date.now()}`,
    authorUsername: username,
    authorDepartment: input.authorDepartment,
    authorYear: input.authorYear || 3,
    authorFlair: input.authorFlair || (input.authorYear >= 3 ? "Senior Mentor ⭐" : `Year ${input.authorYear}`),
    content: input.content,
    codeSnippet: input.codeSnippet?.trim() ? input.codeSnippet.trim() : undefined,
    upvotes: 1,
    isAccepted: false,
    createdAt: new Date().toISOString(),
  };

  all[qIndex].answers.push(newAnswer);
  saveCommunityQuestions(all);
  return newAnswer;
};

// Reddit-style Upvote/Downvote toggle on Question
export const voteOnQuestion = (questionId: string, direction: 1 | -1): { upvotes: number; downvotes: number; userVote: number } => {
  const all = getCommunityQuestions();
  const q = all.find((item) => item.id === questionId);
  if (!q) return { upvotes: 0, downvotes: 0, userVote: 0 };

  if (q.userVote === direction) {
    // Undo vote
    if (direction === 1) q.upvotes = Math.max(0, q.upvotes - 1);
    else q.downvotes = Math.max(0, q.downvotes - 1);
    q.userVote = 0;
  } else if (q.userVote === -direction) {
    // Switch vote
    if (direction === 1) {
      q.upvotes += 1;
      q.downvotes = Math.max(0, q.downvotes - 1);
    } else {
      q.downvotes += 1;
      q.upvotes = Math.max(0, q.upvotes - 1);
    }
    q.userVote = direction;
  } else {
    // New vote
    if (direction === 1) q.upvotes += 1;
    else q.downvotes += 1;
    q.userVote = direction;
  }

  saveCommunityQuestions(all);
  return { upvotes: q.upvotes, downvotes: q.downvotes, userVote: q.userVote || 0 };
};

// Reddit-style Upvote on Answer
export const voteOnAnswer = (questionId: string, answerId: string, delta: number = 1): number => {
  const all = getCommunityQuestions();
  const q = all.find((item) => item.id === questionId);
  if (q) {
    const ans = q.answers.find((a) => a.id === answerId);
    if (ans) {
      ans.upvotes = Math.max(0, ans.upvotes + delta);
      saveCommunityQuestions(all);
      return ans.upvotes;
    }
  }
  return 0;
};

export const acceptAnswer = (questionId: string, answerId: string): boolean => {
  const all = getCommunityQuestions();
  const q = all.find((item) => item.id === questionId);
  if (q) {
    q.isResolved = true;
    q.acceptedAnswerId = answerId;
    q.answers.forEach((a) => {
      a.isAccepted = a.id === answerId;
    });
    saveCommunityQuestions(all);
    return true;
  }
  return false;
};

export const incrementQuestionViews = (questionId: string): void => {
  const all = getCommunityQuestions();
  const q = all.find((item) => item.id === questionId);
  if (q) {
    q.views += 1;
    saveCommunityQuestions(all);
  }
};
