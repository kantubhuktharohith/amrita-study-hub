import { Router, Request, Response } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

// GET /api/notes - Get notes with optional filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const { department, semester, subject, search, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('notes')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (department && typeof department === 'string') {
      query = query.eq('department', department);
    }
    if (semester && !isNaN(Number(semester))) {
      query = query.eq('semester', Number(semester));
    }
    if (subject && typeof subject === 'string') {
      query = query.ilike('subject', `%${subject}%`);
    }
    if (search && typeof search === 'string') {
      query = query.or(`title.ilike.%${search}%,subject.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query.range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;

    res.json({
      success: true,
      count,
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/notes/:id - Get a single note by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: note, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    // Also fetch uploader profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('user_id', note.user_id)
      .single();

    res.json({
      success: true,
      data: {
        ...note,
        uploader_name: profile?.full_name || 'Anonymous Student',
        uploader_avatar: profile?.avatar_url || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/notes/:id/download - Increment download count
router.post('/:id/download', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: note, error: fetchErr } = await supabase
      .from('notes')
      .select('downloads')
      .eq('id', id)
      .single();

    if (fetchErr || !note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    const newCount = (note.downloads || 0) + 1;
    const { error: updateErr } = await supabase
      .from('notes')
      .update({ downloads: newCount })
      .eq('id', id);

    if (updateErr) throw updateErr;

    res.json({ success: true, downloads: newCount });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
