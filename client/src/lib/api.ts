/**
 * Client API utility to communicate with the Node.js / Express backend server.
 * Proxied in development through Vite to http://localhost:5000/api
 */

const API_BASE = '/api';

export interface HealthStatus {
  status: string;
  uptime: number;
  timestamp: string;
  service: string;
  version: string;
}

export interface SystemStats {
  totalNotes: number;
  totalExamPapers: number;
  totalDownloads: number;
  serverStatus: string;
}

export const api = {
  /**
   * Check backend health status
   */
  async checkHealth(): Promise<HealthStatus> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return res.json();
  },

  /**
   * Get application stats from backend
   */
  async getStats(): Promise<SystemStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.statusText}`);
    return res.json();
  },

  /**
   * Generic GET request to backend
   */
  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || res.statusText);
    }
    return res.json();
  },

  /**
   * Generic POST request to backend
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || res.statusText);
    }
    return res.json();
  },
};
