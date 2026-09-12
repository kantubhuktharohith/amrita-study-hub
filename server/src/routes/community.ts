import { Router, Request, Response } from 'express';

const router = Router();

export const SUB_COMMUNITIES = [
  { id: "r/all", label: "r/all", desc: "All-in-One Community Feed", icon: "🌐" },
  { id: "r/cse", label: "r/cse", desc: "Computer Science & Engineering", icon: "💻" },
  { id: "r/aiml", label: "r/aiml", desc: "CSE (AI & Machine Learning)", icon: "🤖" },
  { id: "r/datascience", label: "r/datascience", desc: "CSE (Data Science & Analytics)", icon: "📊" },
  { id: "r/cybersec", label: "r/cybersec", desc: "CSE (Cyber Security & Defense)", icon: "🛡️" },
  { id: "r/bigdata", label: "r/bigdata", desc: "CSE (Big Data Analytics)", icon: "🗄️" },
  { id: "r/ece", label: "r/ece", desc: "Electronics & Communication", icon: "⚡" },
  { id: "r/eee", label: "r/eee", desc: "Electrical & Electronics", icon: "🔋" },
  { id: "r/mech", label: "r/mech", desc: "Mechanical Engineering", icon: "⚙️" },
  { id: "r/civil", label: "r/civil", desc: "Civil Engineering", icon: "🏗️" },
  { id: "r/placements", label: "r/placements", desc: "Placements, Resumes & Drives", icon: "💼" },
  { id: "r/general", label: "r/general", desc: "General Campus & Student Life", icon: "🎓" },
];

// GET /api/community/subcommunities
router.get('/subcommunities', (_req: Request, res: Response) => {
  res.json({ success: true, data: SUB_COMMUNITIES });
});

// GET /api/community/info
router.get('/info', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: 'Amrita Sai Peer Learning Community',
      subCommunitiesCount: SUB_COMMUNITIES.length,
      rules: [
        'Be respectful and constructive in discussions',
        'Provide clear questions with subject & year context',
        'Tag your code snippets and provide relevant context',
        'No academic dishonesty or exam leaks',
      ],
    },
  });
});

export default router;
