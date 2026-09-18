# CampusOrbit (Amrita Sai Study Hub) — 8-Slide Project Presentation

> **Project Title:** CampusOrbit — A Modern Peer-to-Peer Academic Collaboration & Career Roadmap Platform  
> **Institution:** Amrita Sai Institute of Science & Technology  
> **Target Audience:** Mini-Project Review Committee / Faculty Evaluation Panel  

---

## Slide 1: Title & Introduction

### Slide Header:
**CampusOrbit (Amrita Sai Study Hub)**  
*A Decoupled Full-Stack Academic Collaboration & Career Guidance Platform*

### Slide Content:
- **Project Type:** Mini-Project / Full-Stack Web Application
- **Presented By:** [Student Name(s) / Roll Number(s)]
- **Department:** Computer Science & Engineering / Information Technology
- **Institution:** Amrita Sai Institute of Science & Technology
- **Project Guide:** [Faculty Guide Name, Designation]
- **Academic Year:** 2025–2026

> 💡 **Speaker Notes:**  
> *"Good morning respected evaluators. Today we present our project, 'CampusOrbit' — an integrated web platform built specifically to bridge the academic resource gap and provide branch-wise career roadmaps for students at our institution."*

---

## Slide 2: Problem Statement & Motivation

### Slide Header:
**Problem Statement & Motivation**

### Slide Content:
- **Scattered Academic Resources:** Lecture notes, lab manuals, and previous question papers are fragmented across unorganized WhatsApp groups, expired Google Drive links, and Telegram channels.
- **Knowledge Loss Across Batches:** High-quality handwritten notes and exam insights created by graduating seniors rarely reach incoming juniors.
- **Lack of Structured Career Guidance:** Engineering students often lack clear semester-by-semester roadmaps, technical skill priorities, and placement prep resources.
- **Siloed Peer Learning:** No centralized, verified campus forum exists for students to ask academic questions, debug code snippets, and exchange peer solutions.

> 💡 **Speaker Notes:**  
> *"Every semester, students struggle to find quality study material and previous question papers before exams. Senior knowledge is lost once batches graduate, and students lack structured 4-year roadmaps. Our project directly addresses these challenges with CampusOrbit."*

---

## Slide 3: Proposed Solution & Objectives

### Slide Header:
**Proposed Solution & Core Objectives**

### Slide Content:
- **Centralized Document Repository:** Cloud-hosted, searchable archive for lecture notes, lab manuals, and university exam papers.
- **Interactive In-Browser Viewing:** Canvas-rendered PDF reader allowing instant document preview without forcing file downloads.
- **Branch-Specific 4-Year Roadmaps:** Comprehensive milestone guides, project ideas, and interview checklists for all engineering branches (CSE, AI&ML, Data Science, ECE, EEE, Mech, Civil).
- **Campus Community Q&A:** Sub-community discussion boards (`r/cse`, `r/placements`, etc.) with code formatting and accepted answer verification.
- **Mobile-First PWA:** Progressive Web App supporting mobile navigation, floating upload action, and offline caching.

> 💡 **Speaker Notes:**  
> *"Our solution, CampusOrbit, provides a unified web experience: students can search materials with multi-faceted filters, preview PDFs directly in the browser, participate in branch-specific discussions, and follow curated 4-year placement preparation roadmaps."*

---

## Slide 4: System Architecture & Technology Stack

### Slide Header:
**System Architecture & Technology Stack**

### Slide Content:
- **Frontend Layer (Vite + React 18):**
  - Modern TypeScript client styled with Tailwind CSS and accessible Radix UI primitives.
  - High-performance data caching using TanStack Query v5 (5-minute stale-time cache).
  - Built-in Progressive Web App (PWA) with responsive bottom navigation.
- **Backend Service (Node.js + Express):**
  - Modular REST API handling system health, aggregate platform statistics, and profile management.
  - CORS-configured and secured with JWT authentication middleware.
- **Database & Cloud Layer (Supabase BaaS):**
  - PostgreSQL 14.4 database with Row Level Security (RLS).
  - S3-compatible Supabase Storage buckets for documents.
  - Supabase Realtime WebSocket engine for live discussion synchronization.

> 💡 **Speaker Notes:**  
> *"We designed a decoupled architecture. The frontend communicates directly with Supabase for RLS-secured CRUD operations and real-time events, while an Express API handles system metrics and server-side aggregation."*

---

## Slide 5: Key Functional Modules

### Slide Header:
**Key Functional Modules**

### Slide Content:
1. **Study Notes & Exam Archive:**
   - Multi-filter search by Department, Semester, Year, and Exam Type (Mid-1, Mid-2, Semester-End).
   - In-app canvas PDF reader with full-screen zoom and download counters.
2. **Peer Engagement & Feedback:**
   - Polymorphic 1–5 star rating system and interactive comment threads on all resources.
3. **Campus Community Forum:**
   - 12 dedicated sub-communities (`r/cse`, `r/aiml`, `r/datascience`, `r/placements`, etc.).
   - Upvoting/downvoting, syntax-highlighted code snippets, and verified accepted solutions.
4. **Career Roadmaps & Interactive Quiz:**
   - 4-Year milestone guides, recommended project ideas, and an interactive branch career quiz.
5. **Daily Tech News:**
   - Curated engineering updates coupled with live Hacker News API integration and bookmarking.

> 💡 **Speaker Notes:**  
> *"CampusOrbit rests on 5 key pillars: Notes, Exam Papers, In-App PDF Reader, Peer Discussions, and 4-Year Roadmaps. Every document can be rated and reviewed by students to ensure academic quality."*

---

## Slide 6: Database Design & Security Implementation

### Slide Header:
**Database Schema & Security Architecture**

### Slide Content:
- **Key Relational Entities:**
  - `profiles`: Student details, department, graduation year, skills, and portfolio handles (GitHub, LinkedIn).
  - `notes` & `exam_papers`: Document metadata, storage paths, and download counters.
  - `ratings` & `comments`: Polymorphic tables linking feedback across notes and papers.
  - `community_posts` & `community_answers`: Question threads, code snippets, and resolution status.
  - `user_roles`: RBAC table managing `admin`, `moderator`, and `user` privileges.
- **Multi-Tier Security Measures:**
  - **Row Level Security (RLS):** Database-enforced policies ensuring users can only edit/delete their own uploads.
  - **Storage Sandboxing:** Storage folders isolated by user UUID (`auth.uid()`).
  - **Token Validation:** Cryptographic Supabase JWT verification on protected routes.

> 💡 **Speaker Notes:**  
> *"Security is enforced at the database level using PostgreSQL Row Level Security. Even if someone bypasses the client, the database strictly blocks unauthorized mutations."*

---

## Slide 7: Implementation Results & User Experience

### Slide Header:
**Results & Demonstration**

### Slide Content:
- **Instant Search & Discovery:** Sub-second document search across 12 academic departments with multi-criteria filtering.
- **Zero External App Dependency:** In-app PDF rendering eliminates the need for external PDF viewers on mobile devices.
- **Real-Time Community Updates:** Peer answers and upvotes sync dynamically across active sessions without page reloads.
- **Responsive PWA Usability:** Seamless mobile experience featuring an app-like bottom navigation bar and single-tap Floating Action Button (FAB) for uploads.
- **Admin Moderation Controls:** Administrative panel to review, approve, reject, or purge inappropriate materials and manage user permissions.

> 💡 **Speaker Notes:**  
> *"Here we showcase the working application. The search is instantaneous, the PDF viewer works directly inside the browser on both desktop and mobile, and the community updates in real time."*

---

## Slide 8: Future Enhancements & Conclusion

### Slide Header:
**Future Enhancements & Conclusion**

### Slide Content:
- **Future Scope:**
  - **AI Study Assistant:** In-browser document summarization, automatic flashcard generation, and AI-powered question answering based on uploaded notes.
  - **Faculty Verification Badge:** Verified checkmarks for materials uploaded or endorsed by professors.
  - **Campus Placement Portal:** Automated alerts for upcoming on-campus drives, eligibility matching, and senior interview debriefs.
  - **Mobile Push Notifications:** Browser push notifications for new notes in subscribed courses.
- **Conclusion:**
  - CampusOrbit successfully replaces scattered chat groups with a structured, high-performance academic ecosystem.
  - Fosters cross-batch collaboration, preserves institutional knowledge, and accelerates career readiness for all students.

> 💡 **Speaker Notes:**  
> *"In conclusion, CampusOrbit bridges the gap between seniors and juniors, preserves institutional knowledge, and provides a continuous learning roadmap. Thank you! We are now open for questions."*
