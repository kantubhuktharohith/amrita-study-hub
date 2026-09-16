import { CommunityQuestion,CommunityAnswer } from "@/data/communityData";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "amrita_community_posts_real_v1";

export const COMMUNITY_QUESTIONS_CONTENT_ID = "00000000-0000-0000-0000-000000000001";
export const COMMUNITY_ANSWERS_CONTENT_ID = "00000000-0000-0000-0000-000000000002";

export const getCommunityQuestions = (): CommunityQuestion[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: CommunityQuestion[] = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (q) => !["q-1", "q-2", "q-3", "q-4", "q-5", "q-6"].includes(q.id),
        );
      }
    }
  } catch (err) {
    console.error("Error reading community questions from localStorage", err);
  }
  return [];
};

export const saveCommunityQuestions = (questions: CommunityQuestion[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error("Error saving community questions", err);
  }
};

/**
 * Fetch all real community questions from Supabase:
 * 1. Checks dedicated public.community_posts table
 * 2. Falls back to public.comments table
 */
export const fetchCommunityQuestions = async (): Promise<CommunityQuestion[]> => {
  try {
    // 1. Try fetching from dedicated public.community_posts table
    const { data: dedicatedPosts, error: dedicatedError } = await (supabase as any)
      .from("community_posts")
      .select("*, community_answers(*)")
      .order("created_at", { ascending: false });

    if (!dedicatedError && dedicatedPosts && dedicatedPosts.length > 0) {
      const mapped: CommunityQuestion[] = dedicatedPosts.map((p: any) => ({
        id: p.id,
        authorId: p.user_id,
        authorUsername: p.author_username,
        authorDepartment: p.author_department,
        authorYear: p.author_year,
        authorFlair: p.author_flair,
        subCommunity: p.sub_community,
        title: p.title,
        content: p.content,
        codeSnippet: p.code_snippet,
        department: p.department,
        subject: p.subject,
        semester: p.semester,
        tags: p.tags || [],
        upvotes: p.upvotes || 1,
        downvotes: p.downvotes || 0,
        views: p.views || 1,
        isResolved: p.is_resolved || false,
        acceptedAnswerId: p.accepted_answer_id,
        createdAt: p.created_at,
        answers: (p.community_answers || []).map((a: any) => ({
          id: a.id,
          questionId: a.question_id,
          authorId: a.user_id,
          authorUsername: a.author_username,
          authorDepartment: a.author_department,
          authorYear: a.author_year || 3,
          authorFlair: a.author_flair,
          content: a.content,
          codeSnippet: a.code_snippet,
          upvotes: a.upvotes || 1,
          isAccepted: a.is_accepted || false,
          createdAt: a.created_at,
        })),
      }));

      saveCommunityQuestions(mapped);
      return mapped;
    }

    // 2. Fetch from public.comments table (current fallback)
    const [qRes, aRes] = await Promise.all([
      supabase
        .from("comments")
        .select("*")
        .eq("content_type", "note")
        .eq("content_id", COMMUNITY_QUESTIONS_CONTENT_ID)
        .order("created_at", { ascending: false }),
      supabase
        .from("comments")
        .select("*")
        .eq("content_type", "note")
        .eq("content_id", COMMUNITY_ANSWERS_CONTENT_ID)
        .order("created_at", { ascending: true }),
    ]);

    const answersByQId: Record<string, CommunityAnswer[]> = {};

    if (aRes.data && aRes.data.length > 0) {
      aRes.data.forEach((row) => {
        try {
          const parsedAns = JSON.parse(row.body);
          if (parsedAns.questionId) {
            if (!answersByQId[parsedAns.questionId]) {
              answersByQId[parsedAns.questionId] = [];
            }
            answersByQId[parsedAns.questionId].push({
              ...parsedAns,
              supabaseCommentId: row.id,
              authorId: row.user_id || parsedAns.authorId,
              createdAt: parsedAns.createdAt || row.created_at,
            });
          }
        } catch {
          // ignore corrupted comment
        }
      });
    }

    const remoteQuestions: CommunityQuestion[] = [];

    if (qRes.data && qRes.data.length > 0) {
      qRes.data.forEach((row) => {
        try {
          const parsed = JSON.parse(row.body);
          const qId = parsed.id || row.id;
          remoteQuestions.push({
            ...parsed,
            id: qId,
            supabaseCommentId: row.id,
            authorId: row.user_id || parsed.authorId,
            createdAt: parsed.createdAt || row.created_at,
            answers: answersByQId[qId] || parsed.answers || [],
          });
        } catch {
          // ignore corrupted question
        }
      });
    }

    saveCommunityQuestions(remoteQuestions);
    return remoteQuestions;
  } catch (err) {
    console.error("Failed to fetch community questions from database:", err);
    return getCommunityQuestions();
  }
};

export const getQuestionById = (id: string): CommunityQuestion | null => {
  const all = getCommunityQuestions();
  return all.find((q) => q.id === id) || null;
};

export const fetchQuestionById = async (id: string): Promise<CommunityQuestion | null> => {
  const all = await fetchCommunityQuestions();
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

export const createQuestion = async (
  input: CreateQuestionInput,
): Promise<{ success: boolean; question?: CommunityQuestion; error?: string }> => {
  try {
    const sessionRes = await supabase.auth.getSession();
    const user = sessionRes.data.session?.user;

    if (!user) {
      return {
        success: false,
        error: "Please sign in to your student account to publish a post to the community.",
      };
    }

    const cleanUname = (input.authorUsername || user.email?.split("@")[0] || "student")
      .replace(/^u\//, "")
      .trim();
    const username = `u/${cleanUname || "student"}`;
    const authorFlair =
      input.authorFlair ||
      `${(input.department || "General").slice(0, 4)} Year ${input.authorYear || 2}`;

    const newQuestion: CommunityQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      authorId: user.id,
      authorUsername: username,
      authorDepartment: input.authorDepartment || input.department,
      authorYear: input.authorYear || 2,
      authorFlair,
      subCommunity: input.subCommunity || "r/all",
      title: input.title,
      content: input.content,
      codeSnippet: input.codeSnippet?.trim() ? input.codeSnippet.trim() : undefined,
      department: input.department as any,
      subject: input.subject,
      semester: input.semester,
      tags: input.tags && input.tags.length > 0 ? input.tags : ["general"],
      upvotes: 1,
      downvotes: 0,
      userVote: 1,
      views: 1,
      isResolved: false,
      createdAt: new Date().toISOString(),
      answers: [],
    };

    // 1. Attempt insert into dedicated community_posts table
    const { data: dedicatedData, error: dedicatedErr } = await (supabase as any)
      .from("community_posts")
      .insert({
        user_id: user.id,
        author_username: username,
        author_department: input.authorDepartment || input.department,
        author_year: input.authorYear || 2,
        author_flair: authorFlair,
        sub_community: input.subCommunity || "r/all",
        title: input.title,
        content: input.content,
        code_snippet: input.codeSnippet?.trim() || null,
        department: input.department,
        subject: input.subject,
        semester: input.semester,
        tags: input.tags,
      })
      .select();

    if (!dedicatedErr && dedicatedData && dedicatedData[0]) {
      newQuestion.id = dedicatedData[0].id;
    } else {
      // 2. Fallback insert to comments table
      const { data: commentsData, error: commentsErr } = await supabase
        .from("comments")
        .insert({
          content_type: "note",
          content_id: COMMUNITY_QUESTIONS_CONTENT_ID,
          user_id: user.id,
          body: JSON.stringify(newQuestion),
        })
        .select();

      if (commentsErr) {
        console.error("Supabase insert error:", commentsErr);
        return { success: false, error: `Database error: ${commentsErr.message}` };
      }

      if (commentsData && commentsData[0]) {
        (newQuestion as any).supabaseCommentId = commentsData[0].id;
      }
    }

    // Save to local cache
    const all = getCommunityQuestions();
    saveCommunityQuestions([newQuestion, ...all]);

    return { success: true, question: newQuestion };
  } catch (err: any) {
    console.error("Error creating community question:", err);
    return { success: false, error: err.message || "Failed to publish question" };
  }
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

export const createAnswer = async (
  input: CreateAnswerInput,
): Promise<{ success: boolean; answer?: CommunityAnswer; error?: string }> => {
  try {
    const sessionRes = await supabase.auth.getSession();
    const user = sessionRes.data.session?.user;

    if (!user) {
      return {
        success: false,
        error: "Please sign in to post a solution or comment.",
      };
    }

    const cleanUname = (input.authorUsername || user.email?.split("@")[0] || "senior")
      .replace(/^u\//, "")
      .trim();
    const username = `u/${cleanUname || "senior"}`;
    const authorFlair =
      input.authorFlair ||
      (input.authorYear >= 3 ? "Senior Mentor ⭐" : `Year ${input.authorYear}`);

    const newAnswer: CommunityAnswer = {
      id: `ans-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      questionId: input.questionId,
      authorId: user.id,
      authorUsername: username,
      authorDepartment: input.authorDepartment,
      authorYear: input.authorYear || 3,
      authorFlair,
      content: input.content,
      codeSnippet: input.codeSnippet?.trim() ? input.codeSnippet.trim() : undefined,
      upvotes: 1,
      isAccepted: false,
      createdAt: new Date().toISOString(),
    };

    // 1. Try dedicated community_answers table
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.questionId);
    let insertedDedicated = false;

    if (isUuid) {
      const { data: dedicatedAns, error: dedicatedAnsErr } = await (supabase as any)
        .from("community_answers")
        .insert({
          question_id: input.questionId,
          user_id: user.id,
          author_username: username,
          author_department: input.authorDepartment,
          author_year: input.authorYear || 3,
          author_flair: authorFlair,
          content: input.content,
          code_snippet: input.codeSnippet?.trim() || null,
        })
        .select();

      if (!dedicatedAnsErr && dedicatedAns && dedicatedAns[0]) {
        newAnswer.id = dedicatedAns[0].id;
        insertedDedicated = true;
      }
    }

    // 2. Fallback to comments table
    if (!insertedDedicated) {
      const { data: commentsData, error: commentsErr } = await supabase
        .from("comments")
        .insert({
          content_type: "note",
          content_id: COMMUNITY_ANSWERS_CONTENT_ID,
          user_id: user.id,
          body: JSON.stringify(newAnswer),
        })
        .select();

      if (commentsErr) {
        console.error("Supabase answer insert error:", commentsErr);
        return { success: false, error: `Database error: ${commentsErr.message}` };
      }

      if (commentsData && commentsData[0]) {
        (newAnswer as any).supabaseCommentId = commentsData[0].id;
      }
    }

    // Update local cache
    const all = getCommunityQuestions();
    const qIndex = all.findIndex((q) => q.id === input.questionId);
    if (qIndex !== -1) {
      all[qIndex].answers.push(newAnswer);
      saveCommunityQuestions(all);
    }

    return { success: true, answer: newAnswer };
  } catch (err: any) {
    console.error("Error creating community answer:", err);
    return { success: false, error: err.message || "Failed to post answer" };
  }
};

export const voteOnQuestion = (
  questionId: string,
  direction: 1 | -1,
): { upvotes: number; downvotes: number; userVote: number } => {
  const all = getCommunityQuestions();
  const q = all.find((item) => item.id === questionId);
  if (!q) return { upvotes: 0, downvotes: 0, userVote: 0 };

  if (q.userVote === direction) {
    if (direction === 1) q.upvotes = Math.max(0, q.upvotes - 1);
    else q.downvotes = Math.max(0, q.downvotes - 1);
    q.userVote = 0;
  } else if (q.userVote === -direction) {
    if (direction === 1) {
      q.upvotes += 1;
      q.downvotes = Math.max(0, q.downvotes - 1);
    } else {
      q.downvotes += 1;
      q.upvotes = Math.max(0, q.upvotes - 1);
    }
    q.userVote = direction;
  } else {
    if (direction === 1) q.upvotes += 1;
    else q.downvotes += 1;
    q.userVote = direction;
  }

  saveCommunityQuestions(all);
  return {
    upvotes: q.upvotes,
    downvotes: q.downvotes,
    userVote: q.userVote || 0,
  };
};

export const voteOnAnswer = (
  questionId: string,
  answerId: string,
  delta: number = 1,
): number => {
  const all = getCommunityQuestions();
  const q = all.find((item) => item.id === questionId);
  if (q) {
    const ans = (q.answers || []).find((a) => a.id === answerId);
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
    (q.answers || []).forEach((a) => {
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
    q.views = (q.views || 0) + 1;
    saveCommunityQuestions(all);
  }
};
