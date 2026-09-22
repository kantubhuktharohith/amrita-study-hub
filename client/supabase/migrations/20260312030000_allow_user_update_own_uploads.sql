-- Allow students to update their own notes, or admins to update any note
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update own notes or admins" ON public.notes;

CREATE POLICY "Users can update own notes or admins"
ON public.notes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Allow students to update their own exam papers, or admins to update any exam paper
DROP POLICY IF EXISTS "Users can update their own exam papers" ON public.exam_papers;
DROP POLICY IF EXISTS "Users can update own papers or admins" ON public.exam_papers;

CREATE POLICY "Users can update own papers or admins"
ON public.exam_papers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
