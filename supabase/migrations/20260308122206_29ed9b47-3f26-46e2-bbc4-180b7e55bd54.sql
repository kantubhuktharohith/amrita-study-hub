
-- Create exam_papers table
CREATE TABLE public.exam_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  department TEXT NOT NULL,
  semester INTEGER NOT NULL,
  year INTEGER NOT NULL DEFAULT 1,
  exam_year INTEGER NOT NULL DEFAULT 2026,
  exam_type TEXT NOT NULL DEFAULT 'mid',
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  downloads INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exam_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved exam papers"
  ON public.exam_papers FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own exam papers"
  ON public.exam_papers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exam papers"
  ON public.exam_papers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exam papers"
  ON public.exam_papers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_exam_papers_updated_at
  BEFORE UPDATE ON public.exam_papers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create exam-papers storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('exam-papers', 'exam-papers', true);

CREATE POLICY "Anyone can view exam paper files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'exam-papers');

CREATE POLICY "Authenticated users can upload exam paper files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'exam-papers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own exam paper files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'exam-papers' AND auth.uid()::text = (storage.foldername(name))[1]);
