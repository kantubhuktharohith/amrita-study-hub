
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can view roles (using a security definer function)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS: authenticated users can read their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Update notes delete policy: only admins
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
CREATE POLICY "Only admins can delete notes"
ON public.notes
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update exam_papers delete policy: only admins
DROP POLICY IF EXISTS "Users can delete their own exam papers" ON public.exam_papers;
CREATE POLICY "Only admins can delete exam papers"
ON public.exam_papers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
