# Amrita Study Hub

## Overview

**Amrita Study Hub** is a collaborative academic knowledge-sharing platform specifically designed for the students and faculty of **Amrita Sai Institute of Science & Technology**. The platform serves as a centralized repository where seniors and faculty can upload study materials, and juniors can easily discover, browse, and download them.

---

## Features

- **Decoupled Client-Server Architecture**: Independent frontend (`client/`) and backend API (`server/`).
- **Academic Notes Sharing**: Upload and download lecture notes, handwritten summaries, and lab manuals.
- **Past Exam Question Papers**: Categorized by Mid-1, Mid-2, Semester End, and Supplementary across years.
- **Peer Learning Community**: Student Q&A and doubt resolution platform organized by branches (`r/cse`, `r/aiml`, `r/ece`, `r/placements`, etc.).
- **Career & Placement Guidance**: 4-year engineering roadmaps, high-demand skills, project ideas, certifications, and GATE prep for every branch.
- **Quality Assurance**: Admin review workflow for approving and monitoring uploads.
- **Responsive & Modern UI**: Mobile-first design, dark/light theme support, and smooth animations.

---

## Tech Stack

### Frontend (`client/`)
- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) with **TypeScript**
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Routing**: [React Router](https://reactrouter.com/)
- **API Proxy**: Automatic proxying of `/api` requests to backend on port 5000

### Backend (`server/`)
- **Runtime & Framework**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) with **TypeScript**
- **Architecture**: Modular RESTful APIs (`/api/notes`, `/api/exam-papers`, `/api/community`, `/api/career`, `/api/stats`, `/api/health`)
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL & Cloud Object Storage)

---

## Project Structure

```text
amrita-study-hub/
├── client/                     # Frontend Application (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/        # Reusable UI & shadcn components
│   │   ├── pages/             # Route pages (Browse, Upload, Community, Career, etc.)
│   │   ├── data/              # Academic constants (departments, semesters, exam types)
│   │   ├── lib/api.ts         # Client API connector for Express backend
│   │   └── integrations/      # Supabase & client utilities
│   ├── index.html
│   ├── vite.config.ts         # Dev server with /api proxy to localhost:5000
│   └── package.json
│
├── server/                     # Backend API Server (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── routes/            # REST API endpoints (notes, exam papers, stats, health)
│   │   ├── services/          # Supabase client & database service
│   │   └── server.ts          # Express app entry & middleware setup
│   ├── tsconfig.json
│   └── package.json
│
├── package.json               # Root monorepo orchestration (npm run dev runs both)
└── README.md
```

---

## Running the Application

### 1. Run Both Frontend and Backend Concurrently (Recommended)
From the root `amrita-study-hub` directory:
```bash
npm run dev
```
- **Client UI**: [http://localhost:8080](http://localhost:8080)
- **Server API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 2. Run Independently
To run only the frontend:
```bash
npm run dev:client
```

To run only the backend server:
```bash
npm run dev:server
```

### 3. Production Build
```bash
npm run build
```
Compiles both the Vite production client bundle and the Express TypeScript server.
