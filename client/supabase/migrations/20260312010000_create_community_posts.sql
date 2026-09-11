-- ==========================================================
-- CREATE DEDICATED COMMUNITY POSTS & ANSWERS TABLES
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tbonnyvcqyjsfehyridi/sql
-- ==========================================================

-- 1. Create Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  author_username text NOT NULL,
  author_department text NOT NULL,
  author_year integer NOT NULL DEFAULT 2,
  author_flair text,
  sub_community text NOT NULL DEFAULT 'r/all',
  title text NOT NULL,
  content text NOT NULL,
  code_snippet text,
  department text NOT NULL,
  subject text NOT NULL,
  semester integer NOT NULL DEFAULT 1,
  tags text[] DEFAULT '{}',
  upvotes integer NOT NULL DEFAULT 1,
  downvotes integer NOT NULL DEFAULT 0,
  views integer NOT NULL DEFAULT 1,
  is_resolved boolean NOT NULL DEFAULT false,
  accepted_answer_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create Community Answers Table
CREATE TABLE IF NOT EXISTS public.community_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  author_username text NOT NULL,
  author_department text NOT NULL,
  author_year integer NOT NULL DEFAULT 3,
  author_flair text,
  content text NOT NULL,
  code_snippet text,
  upvotes integer NOT NULL DEFAULT 1,
  is_accepted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_answers ENABLE ROW LEVEL SECURITY;

-- 4. Policies for community_posts
CREATE POLICY "Anyone can view community posts" 
ON public.community_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert community posts" 
ON public.community_posts FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community posts" 
ON public.community_posts FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community posts" 
ON public.community_posts FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- 5. Policies for community_answers
CREATE POLICY "Anyone can view community answers" 
ON public.community_answers FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert community answers" 
ON public.community_answers FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community answers" 
ON public.community_answers FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community answers" 
ON public.community_answers FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- 6. Enable Realtime updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_answers;
