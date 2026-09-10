# Amrita Study Hub

## Overview

**Amrita Study Hub** is a collaborative, open-source knowledge-sharing platform specifically designed for the students of **Amrita Sai Institute of Science & Technology**. The platform serves as a centralized repository where seniors and faculty can upload study materials, and juniors can easily access them. 

The goal is to foster a shared academic culture, ensuring that high-quality, relevant study materials (notes, exam papers, etc.) are easily discoverable and accessible to everyone.

## Features

- **Collaborative Uploads**: Students and faculty can seamlessly upload notes, past exam papers, and other academic documents (PDFs, images).
- **Advanced Search & Filtering**: Find materials quickly by filtering through subject, semester, department, or specific keywords.
- **Quality Assurance**: An admin review system ensures that only high-quality, relevant, and appropriate content is approved and published on the platform.
- **Dedicated Sections**: Separate browsing experiences for general study notes and past exam papers.
- **User Profiles & Upload Management**: Users can track their own uploads, view their approval status, and manage their shared content.
- **Responsive & Modern UI**: Built with a mobile-first approach, featuring dark/light mode support, smooth animations, and an intuitive user experience.

## Tech Stack

The application is built using a modern, scalable web development stack:

### Frontend (`client/`)
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) with **TypeScript**
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest)
- **API Proxy**: Automatically proxies `/api` requests to the Express backend server on port 5000.

### Backend (`server/`)
- **Runtime & Server**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) with **TypeScript**
- **API Endpoints**: Modular REST controllers for `/api/notes`, `/api/exam-papers`, `/api/community`, `/api/stats`, and `/api/health`.
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL & Cloud Object Storage).

## Project Structure

```text
amrita-study-hub/
├── client/                     # Frontend Application (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/        # Reusable UI & shadcn components
│   │   ├── pages/             # Route pages (Browse, Upload, Community, Career, etc.)
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
│   ├── lib/           # Utility functions and Supabase query helpers (noteQueries.ts)
│   ├── pages/         # Route components (HomePage, BrowsePage, UploadPage, etc.)
│   ├── App.tsx        # Main application component & routing setup
│   └── main.tsx       # Entry point
├── supabase/          # Supabase configuration and migrations (if applicable)
├── public/            # Public static assets
└── package.json       # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or [Bun](https://bun.sh/) package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GIT_URL>
   cd amrita-study-hub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```
   The application will be available at `http://localhost:8080` (or whichever port Vite assigns).

## Available Scripts

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the application for production.
- `npm run lint` - Runs ESLint to check for code quality and style issues.
- `npm run preview` - Locally previews the production build.
- `npm run test` - Runs the Vitest test suite.

## Contributing

Contributions are welcome! Whether it's reporting a bug, suggesting a new feature, or submitting a pull request, your input helps make Amrita Study Hub better for everyone.
