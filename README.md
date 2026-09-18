# Amrita Sai Study Hub (GetMaterial)

A modern, decoupled web application and peer collaboration platform designed for engineering students at **Amrita Sai Institute of Science & Technology**.

> 📖 **Full System Documentation:** For architecture diagrams, database schemas, REST APIs, and feature specifications, see [DOCUMENTATION.md](file:///c:/Users/Asus/OneDrive/miniproject/amrita-study-hub/DOCUMENTATION.md).

---

## 🚀 Quick Start

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Start Development Servers (Concurrent)
Runs both the Vite React Client (Port 8080) and Express Backend API (Port 5000) simultaneously:
```bash
npm run dev
```

- **Web Application:** [http://localhost:8080](http://localhost:8080)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🛠️ Tech Stack

- **Client:** React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Framer Motion, TanStack Query, PDF.js, PWA
- **Server:** Node.js, Express, TypeScript, CORS, Multer
- **Database & Auth:** Supabase (PostgreSQL 14, RLS, Storage Buckets, Realtime WebSockets)

---

## 📁 Repository Structure

```
amrita-study-hub/
├── client/              # React frontend (Vite PWA, Tailwind, Radix UI)
├── server/              # Express backend (TypeScript, Supabase client, REST routes)
├── DOCUMENTATION.md     # Full architectural and technical documentation
└── package.json         # Workspace root scripts
```
