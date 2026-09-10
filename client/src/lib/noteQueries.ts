import { supabase } from "@/integrations/supabase/client";
import type { NoteWithProfile } from "@/components/NoteCard";
import type { Tables } from "@/integrations/supabase/types";

export type ExamPaperWithProfile = Tables<"exam_papers"> & { uploader_name?: string };

export async function fetchNotesWithProfiles(
  filters?: { userId?: string; status?: string; limit?: number; orderBy?: string }
): Promise<NoteWithProfile[]> {
  let query = supabase.from("notes").select("*");
  if (filters?.userId) query = query.eq("user_id", filters.userId);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.orderBy) {
    query = query.order(filters.orderBy, { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }
  if (filters?.limit) query = query.limit(filters.limit);

  const { data: notes, error } = await query;
  if (error) throw error;
  if (!notes || notes.length === 0) return [];

  const profileMap = await getProfileMap(notes.map((n) => n.user_id));
  return notes.map((n) => ({ ...n, uploader_name: profileMap.get(n.user_id) || "Unknown" }));
}

export async function fetchNoteById(id: string): Promise<NoteWithProfile | null> {
  const { data: note, error } = await supabase.from("notes").select("*").eq("id", id).single();
  if (error) throw error;
  if (!note) return null;
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", note.user_id).single();
  return { ...note, uploader_name: profile?.full_name || "Unknown" };
}

export async function fetchExamPapersWithProfiles(
  filters?: { userId?: string; status?: string; limit?: number; orderBy?: string }
): Promise<ExamPaperWithProfile[]> {
  let query = supabase.from("exam_papers").select("*");
  if (filters?.userId) query = query.eq("user_id", filters.userId);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.orderBy) {
    query = query.order(filters.orderBy, { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }
  if (filters?.limit) query = query.limit(filters.limit);

  const { data: papers, error } = await query;
  if (error) throw error;
  if (!papers || papers.length === 0) return [];

  const profileMap = await getProfileMap(papers.map((p) => p.user_id));
  return papers.map((p) => ({ ...p, uploader_name: profileMap.get(p.user_id) || "Unknown" }));
}

export async function fetchExamPaperById(id: string): Promise<ExamPaperWithProfile | null> {
  const { data: paper, error } = await supabase.from("exam_papers").select("*").eq("id", id).single();
  if (error) throw error;
  if (!paper) return null;
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", paper.user_id).single();
  return { ...paper, uploader_name: profile?.full_name || "Unknown" };
}

async function getProfileMap(userIds: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(userIds)];
  const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", unique);
  return new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
}
