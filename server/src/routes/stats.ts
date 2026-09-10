import { Router, Request, Response } from 'express';
import { supabase } from '../services/supabase.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const [notesRes, papersRes] = await Promise.all([
      supabase.from('notes').select('downloads', { count: 'exact' }),
      supabase.from('exam_papers').select('downloads', { count: 'exact' }),
    ]);

    const totalNotes = notesRes.count ?? (notesRes.data?.length || 0);
    const totalExamPapers = papersRes.count ?? (papersRes.data?.length || 0);

    const notesDownloads = notesRes.data?.reduce((sum, item: any) => sum + (item.downloads || 0), 0) || 0;
    const papersDownloads = papersRes.data?.reduce((sum, item: any) => sum + (item.downloads || 0), 0) || 0;
    const totalDownloads = notesDownloads + papersDownloads;

    res.json({
      success: true,
      data: {
        totalNotes,
        totalExamPapers,
        totalDownloads,
        serverStatus: 'online',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve stats',
    });
  }
});

export default router;
