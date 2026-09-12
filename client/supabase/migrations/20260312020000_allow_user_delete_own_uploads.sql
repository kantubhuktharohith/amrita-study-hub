-- Allow students to delete their own notes, or admins to delete any note
DROP POLICY IF EXISTS "Only admins can delete notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete own notes or admins" ON public.notes;

CREATE POLICY "Users can delete own notes or admins"
ON public.notes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Allow students to delete their own exam papers, or admins to delete any exam paper
DROP POLICY IF EXISTS "Only admins can delete exam papers" ON public.exam_papers;
DROP POLICY IF EXISTS "Users can delete their own exam papers" ON public.exam_papers;
DROP POLICY IF EXISTS "Users can delete own papers or admins" ON public.exam_papers;

CREATE POLICY "Users can delete own papers or admins"
ON public.exam_papers
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
