import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: string;
      };
    }
  }
}

/**
 * Middleware that requires a valid Supabase JWT.
 * Returns 401 if token is missing or invalid.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Authentication failed' });
  }
};

/**
 * Middleware that optionally attaches user if a valid token is present.
 * Does NOT return 401 — request continues either way.
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
        };
      }
    } catch {
      // Ignore auth errors for optional auth
    }
  }
  next();
};

/**
 * Middleware that checks if the authenticated user has an admin role.
 * Must be used after requireAuth.
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', req.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error || !data) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    req.user.role = 'admin';
    next();
  } catch {
    return res.status(403).json({ success: false, error: 'Admin check failed' });
  }
};
