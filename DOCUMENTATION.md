# CampusOrbit (Amrita Sai Study Hub) — Full System Documentation

> **Version:** 1.0.0  
> **Brand Name:** CampusOrbit  
> **Target Institution:** Amrita Sai Institute of Science & Technology  
> **Architecture:** Decoupled Monorepo (Client + Express Server + Supabase BaaS)  

---

## Table of Contents

1. [Executive Summary & Vision](#1-executive-summary--vision)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Monorepo & Directory Structure](#4-monorepo--directory-structure)
5. [Database Schema & Supabase Architecture](#5-database-schema--supabase-architecture)
6. [Backend API Documentation](#6-backend-api-documentation)
7. [Frontend Architecture & Key Pages](#7-frontend-architecture--key-pages)
8. [Authentication, Authorization & Security](#8-authentication-authorization--security)
9. [Feature Deep-Dive](#9-feature-deep-dive)
10. [Environment Variables & Configuration](#10-environment-variables--configuration)
11. [Installation, Local Development & Deployment](#11-installation-local-development--deployment)
12. [Maintenance, Operations & Extensibility](#12-maintenance-operations--extensibility)

---

## 1. Executive Summary & Vision

**CampusOrbit** (Amrita Sai Study Hub) is an all-in-one collaborative academic and career enablement platform designed specifically for engineering students, faculty, and alumni.

### Core Problems Solved:
- **Scattered Study Materials:** Fragmented WhatsApp/Telegram drives lead to missing exam papers, expired links, and redundant requests every semester.
- **Seniors-to-Juniors Knowledge Gap:** Valuable hand-written notes and exam preparation insights are lost as batches graduate.
- **Lack of Structured Guidance:** Students often lack clear 4-year technical roadmaps, internship preparation tracks, and curated tech trends.
- **Siloed Peer Discussions:** Absence of a centralized, college-specific peer learning and query-resolution community.

---

## 2. System Architecture

The application follows a modern **Decoupled Client-Server & BaaS (Backend-as-a-Service)** architecture:

```
                  +----------------------------------------------+
                  |         Client Layer (Vite + React PWA)      |
                  |  - Port 8080 (Dev) / Production CDN         |
                  |  - TanStack Query v5 + Radix UI + Framer     |
                  +-------+-----------------------------+--------+
                          |                             |
                 REST API | Proxy (/api)       Direct   | Supabase Client
                 Requests |                    Auth/DB  | (RLS Secured)
                          v                             v
+-------------------------+----+       +----------------+----------------+
|    Express.js Node API       |       |       Supabase Cloud (Postgres) |
|  - Port 5000 (TypeScript)    |       |  - PostgreSQL 14.4 with RLS     |
|  - Aggregation & Stats       |       |  - GoTrue Auth (JWT)            |
|  - Profile & Health Endpoints|       |  - S3-compatible Object Storage |
|  - Admin & Token Verification|       |  - Realtime WebSockets Pub/Sub  |
+------------------------------+       +---------------------------------+
```

---

## 3. Technology Stack

### Frontend (`/client`)
- **Framework & Runtime:** React 18 (TypeScript) with Vite
- **Styling:** Tailwind CSS 3.4, PostCSS, `tailwind-merge`, `clsx`
- **Component Primitives:** Radix UI (`@radix-ui/react-*` dialogs, dropdowns, tabs, tooltips, select)
- **Animations:** Framer Motion
- **Data Fetching & Cache:** TanStack Query (React Query) v5 with 5-minute memory caching
- **Icons:** Lucide React
- **Document Viewing:** `pdfjs-dist` (In-app canvas-rendered PDF viewer)
- **Notifications:** Sonner & Radix UI Toast
- **PWA Support:** `vite-plugin-pwa` with service worker caching & web manifest

### Backend Server (`/server`)
- **Runtime:** Node.js (ES Modules)
- **Language:** TypeScript (`tsx` for dev watch, `tsc` for production build)
- **Framework:** Express.js 4.21
- **Cross-Origin Handling:** `cors` middleware
- **File Parsing & Utilities:** `multer`, `dotenv`
- **Database Client:** `@supabase/supabase-js`

### Database & Cloud Services
- **Database:** PostgreSQL (Supabase Managed)
- **Storage:** Supabase Storage (`notes` and `exam_papers` public buckets)
- **Authentication:** Supabase Auth (Email/Password & Google OAuth)
- **Realtime Service:** Supabase Realtime engine (PostgreSQL logical replication)

---

## 4. Key Pages & Routes

- `/` (`HomePage.tsx`): Hero showcase, stats counter, quick search, and top notes.
- `/browse` (`BrowsePage.tsx`): Filterable notes catalog with sorting (newest, downloads, rating).
- `/exam-papers` (`BrowseExamPapersPage.tsx`): Filterable question paper archive.
- `/note/:id` (`NoteDetailPage.tsx`): In-browser canvas PDF reader, ratings, comments, and direct download.
- `/exam-paper/:id` (`ExamPaperDetailPage.tsx`): Exam paper view, reader & download.
- `/community` (`CommunityPage.tsx`): Reddit-style sub-communities (`r/cse`, `r/aiml`, `r/placements`, etc.) with real-time sync.
- `/community/:id` (`QuestionDetailPage.tsx`): Thread discussion, code snippets, and accepted solutions.
- `/career-guidance` (`CareerGuidancePage.tsx`): 4-Year milestone roadmaps, interview prep, and career quiz.
- `/tech-news` (`TechNewsPage.tsx`): Curated tech stories and live Hacker News API integration.
- `/upload` & `/upload-exam-paper`: Multi-step document upload with file validation.
- `/my-uploads` (`MyUploadsPage.tsx`): Manage uploaded files with download stats and deletion.
- `/profile` & `/profile/:userId`: Editable personal portfolio and public view.
- `/admin` (`AdminPanelPage.tsx`): Administrative approval, moderation, and user management.

---

## 5. Quick Run Instructions

```bash
# 1. Install all dependencies across client and server
npm run install:all

# 2. Run client (Port 8080) and server (Port 5000) concurrently
npm run dev
```
