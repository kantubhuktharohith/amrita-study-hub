import { supabase } from "@/integrations/supabase/client";
import { getCommunityQuestions } from "./communityQueries";

export interface UserProfile {
  id?: string;
  user_id: string;
  full_name: string;
  department: string | null;
  year: number | null;
  avatar_url: string | null;
  bio?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  website_url?: string | null;
  skills?: string[];
  created_at?: string;
  updated_at?: string;
}

const PUBLIC_PROFILES_KEY = "amrita_community_user_profiles_v1";

const getStoredProfilesMap = (): Record<string, UserProfile> => {
  try {
    const raw = localStorage.getItem(PUBLIC_PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to read public profiles from localStorage", e);
    return {};
  }
};

const setStoredProfilesMap = (map: Record<string, UserProfile>) => {
  try {
    localStorage.setItem(PUBLIC_PROFILES_KEY, JSON.stringify(map));
  } catch (e) {
    console.error("Failed to write public profiles to localStorage", e);
  }
};

/**
 * Fetch a profile by user_id from Supabase and local cache
 */
export const getUserProfile = async (
  userId: string,
  fallbackMeta?: { username?: string; department?: string; year?: number }
): Promise<UserProfile | null> => {
  if (!userId) return null;

  const localMap = getStoredProfilesMap();
  const cached = localMap[userId];

  try {
    // 1. Fetch from Supabase profiles table
    const { data: remoteProfile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && remoteProfile) {
      const merged: UserProfile = {
        id: remoteProfile.id,
        user_id: remoteProfile.user_id,
        full_name: remoteProfile.full_name || cached?.full_name || fallbackMeta?.username || "Student",
        department: remoteProfile.department || cached?.department || fallbackMeta?.department || null,
        year: remoteProfile.year || cached?.year || fallbackMeta?.year || null,
        avatar_url: remoteProfile.avatar_url || cached?.avatar_url || null,
        bio: (remoteProfile as any).bio || cached?.bio || null,
        github_url: (remoteProfile as any).github_url || cached?.github_url || null,
        linkedin_url: (remoteProfile as any).linkedin_url || cached?.linkedin_url || null,
        twitter_url: (remoteProfile as any).twitter_url || cached?.twitter_url || null,
        website_url: (remoteProfile as any).website_url || cached?.website_url || null,
        skills: (remoteProfile as any).skills || cached?.skills || [],
        created_at: remoteProfile.created_at,
        updated_at: remoteProfile.updated_at,
      };

      // Keep cache synchronized
      localMap[userId] = merged;
      setStoredProfilesMap(localMap);
      return merged;
    }
  } catch (err) {
    console.warn("Could not fetch remote profile, using cached/fallback:", err);
  }

  // 2. Return cached if present
  if (cached) {
    return cached;
  }

  // 3. Synthesize a fallback profile from community metadata if available
  if (fallbackMeta?.username || fallbackMeta?.department) {
    const synth: UserProfile = {
      user_id: userId,
      full_name: fallbackMeta.username ? fallbackMeta.username.replace(/^u\//, "") : "Community Member",
      department: fallbackMeta.department || "Computer Science & Engineering",
      year: fallbackMeta.year || 3,
      avatar_url: null,
      bio: `Student at Amrita Sai Institute of Science & Technology (${fallbackMeta.department || "Engineering"}).`,
      skills: ["Problem Solving", "Academics", "Peer Learning"],
    };
    return synth;
  }

  return null;
};

/**
 * Save / Update user profile
 */
export const saveUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  const localMap = getStoredProfilesMap();
  const existing = localMap[userId] || {
    user_id: userId,
    full_name: "",
    department: null,
    year: null,
    avatar_url: null,
  };

  const updated: UserProfile = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // 1. Try to update public.profiles in Supabase with all fields
  try {
    const payload: any = {
      full_name: updated.full_name,
      department: updated.department,
      year: updated.year,
      avatar_url: updated.avatar_url,
      bio: updated.bio,
      github_url: updated.github_url,
      linkedin_url: updated.linkedin_url,
      twitter_url: updated.twitter_url,
      website_url: updated.website_url,
    };

    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("user_id", userId);

    if (error) {
      // Fallback if specific extra columns don't exist in Supabase schema yet
      await supabase
        .from("profiles")
        .update({
          full_name: updated.full_name,
          department: updated.department,
          year: updated.year,
          avatar_url: updated.avatar_url,
        })
        .eq("user_id", userId);
    }
  } catch (err) {
    console.warn("Supabase profile update warning:", err);
  }

  // 2. Also update Supabase auth metadata if this is the active user
  try {
    await supabase.auth.updateUser({
      data: {
        full_name: updated.full_name,
        department: updated.department,
        year: updated.year,
        bio: updated.bio,
        github: updated.github_url,
        linkedin: updated.linkedin_url,
        twitter: updated.twitter_url,
        website: updated.website_url,
      },
    });
  } catch (e) {
    // ignore if not active session
  }

  // 3. Save to local public cache
  localMap[userId] = updated;
  setStoredProfilesMap(localMap);

  return updated;
};

/**
 * Get community activity for a given user (Questions and Answers)
 */
export const getUserCommunityActivity = (userId: string) => {
  const allQuestions = getCommunityQuestions();
  const userQuestions = allQuestions.filter((q) => q.authorId === userId);

  const userAnswers: Array<{
    questionId: string;
    questionTitle: string;
    answer: any;
  }> = [];

  allQuestions.forEach((q) => {
    q.answers?.forEach((a) => {
      if (a.authorId === userId) {
        userAnswers.push({
          questionId: q.id,
          questionTitle: q.title,
          answer: a,
        });
      }
    });
  });

  return {
    questions: userQuestions,
    answers: userAnswers,
    totalContributions: userQuestions.length + userAnswers.length,
  };
};
