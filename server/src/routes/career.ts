import { Router, Request, Response } from 'express';

const router = Router();

const CAREER_CATEGORIES = [
  'Software & IT',
  'AI & Data',
  'Hardware & Core',
  'Cyber & Cloud',
  'Civil & Structural',
  'Government & Higher Studies',
];

// GET /api/career/categories
router.get('/categories', (_req: Request, res: Response) => {
  res.json({ success: true, data: CAREER_CATEGORIES });
});

// GET /api/career/roadmap-summary
router.get('/roadmap-summary', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { year: 1, title: 'Foundation & Discovery', focus: 'Programming basics, problem solving, mathematics, communication' },
      { year: 2, title: 'Core Engineering & Skill Building', focus: 'DSA, DBMS, OS, computer networks, first full projects' },
      { year: 3, title: 'Specialization & Internships', focus: 'Advanced domain stack, internships, competitive coding, mock interviews' },
      { year: 4, title: 'Placements & Final Year Capstone', focus: 'Campus drives, capstone project, system design, higher studies prep' },
    ],
  });
});

export default router;
