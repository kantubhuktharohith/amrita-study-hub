import { Router, Request, Response } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

// GET /api/exam-papers - Get exam papers with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const { department, semester, examType, year, search, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('exam_papers')
      .select('*', { count: 'exact' })
      .order('year', { ascending: false });

    if (department && typeof department === 'string') {
      query = query.eq('department', department);
    }
    if (semester && !isNaN(Number(semester))) {
      query = query.eq('semester', Number(semester));
    }
    if (examType && typeof examType === 'string') {
      query = query.eq('exam_type', examType);
    }
    if (year && !isNaN(Number(year))) {
      query = query.eq('year', Number(year));
    }
    if (search && typeof search === 'string') {
      query = query.or(`title.ilike.%${search}%,subject.ilike.%${search}%`);
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

// GET /api/exam-papers/:id - Get a single exam paper by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: paper, error } = await supabase
      .from('exam_papers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !paper) {
      return res.status(404).json({ success: false, error: 'Exam paper not found' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('user_id', paper.user_id)
      .single();

    res.json({
      success: true,
      data: {
        ...paper,
        uploader_name: profile?.full_name || 'Anonymous Student',
        uploader_avatar: profile?.avatar_url || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/exam-papers/:id/download - Increment download count
router.post('/:id/download', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: paper, error: fetchErr } = await supabase
      .from('exam_papers')
      .select('downloads')
      .eq('id', id)
      .single();

    if (fetchErr || !paper) {
      return res.status(404).json({ success: false, error: 'Exam paper not found' });
    }

    const newCount = (paper.downloads || 0) + 1;
    const { error: updateErr } = await supabase
      .from('exam_papers')
      .update({ downloads: newCount })
      .eq('id', id);

    if (updateErr) throw updateErr;

    res.json({ success: true, downloads: newCount });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
