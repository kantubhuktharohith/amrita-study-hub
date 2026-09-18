import { Router, Request, Response } from 'express';
import { supabase } from '../services/supabase.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/profiles/:userId - Get a user profile (public)
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/profiles/:userId - Update user profile (owner only)
router.put('/:userId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (req.user?.id !== userId) {
      return res.status(403).json({ success: false, error: 'You can only update your own profile' });
    }

    const {
      full_name, department, year, avatar_url,
      bio, github_url, linkedin_url, twitter_url, website_url, skills,
    } = req.body;

    const updatePayload: any = {
      full_name: full_name || '',
      department: department || null,
      year: year || null,
      avatar_url: avatar_url || null,
      updated_at: new Date().toISOString(),
    };

    // Add extended fields if provided
    if (bio !== undefined) updatePayload.bio = bio || null;
    if (github_url !== undefined) updatePayload.github_url = github_url || null;
    if (linkedin_url !== undefined) updatePayload.linkedin_url = linkedin_url || null;
    if (twitter_url !== undefined) updatePayload.twitter_url = twitter_url || null;
    if (website_url !== undefined) updatePayload.website_url = website_url || null;
    if (skills !== undefined) updatePayload.skills = skills || [];

    // Check if profile exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('profiles')
        .insert({ user_id: userId, ...updatePayload })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/profiles/:userId/activity - Get user's community activity
router.get('/:userId/activity', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Get questions by this user
    const { data: questions } = await (supabase as any)
      .from('community_posts')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Get answers by this user
    const { data: answers } = await (supabase as any)
      .from('community_answers')
      .select('id, question_id, content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    res.json({
      success: true,
      data: {
        questions: questions || [],
        answers: answers || [],
        totalContributions: (questions?.length || 0) + (answers?.length || 0),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
