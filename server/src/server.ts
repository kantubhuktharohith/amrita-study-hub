import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health.js';
import statsRouter from './routes/stats.js';
import notesRouter from './routes/notes.js';
import examPapersRouter from './routes/examPapers.js';
import communityRouter from './routes/community.js';
import careerRouter from './routes/career.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8080';

// CORS configuration
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:5173'],
    credentials: true,
  })
);

// Middlewares
app.use(express.json());

// Request logger middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/stats', statsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/exam-papers', examPapersRouter);
app.use('/api/community', communityRouter);
app.use('/api/career', careerRouter);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Amrita Study Hub Backend API',
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
      notes: '/api/notes',
      examPapers: '/api/exam-papers',
      community: '/api/community/info',
      career: '/api/career/categories',
    },
    docs: 'https://github.com/amrita-study-hub',
  });
});

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Amrita Study Hub Backend Server running`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Allowed Client: ${CLIENT_URL}`);
  console.log(`=========================================`);
});

export default app;
