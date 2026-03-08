
-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  department TEXT NOT NULL,
  semester INTEGER NOT NULL,
  year INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  downloads INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved notes
CREATE POLICY "Anyone can view approved notes"
  ON public.notes FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

-- Authenticated users can insert their own notes
CREATE POLICY "Users can insert their own notes"
  ON public.notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notes
CREATE POLICY "Users can update their own notes"
  ON public.notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete their own notes"
  ON public.notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for note files
INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', true);

-- Storage policies
CREATE POLICY "Anyone can view note files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'notes');

CREATE POLICY "Authenticated users can upload note files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own note files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'notes' AND auth.uid()::text = (storage.foldername(name))[1]);
