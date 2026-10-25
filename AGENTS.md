# GEMINI.md

This document serves as instructional context and a technical reference for AI assistants working in this repository.

---

## 1. Project Overview

**AI Career Agent** is a full-stack career preparation application. It combines automated ATS resume analysis with interactive AI-driven voice and text mock interviews.

### Core Architecture & Monorepo Structure

The repository is organized into two primary applications under `apps/`:

- **`apps/frontend`**: A Next.js 16 (React 19) web application providing the user interface for document uploads, ATS feedback display, dashboard analytics, and the interactive mock interview room.
- **`apps/backend`**: A FastAPI (Python 3.11) service handling document parsing, vector indexing with Pinecone, ATS evaluation pipelines, WebSocket-driven AI interview simulations using LangGraph, and audio synthesis via OpenAI TTS.

### Primary Technologies

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI primitives, Lucide React, Clerk (`@clerk/nextjs`).
- **Backend**: FastAPI, Uvicorn, LangChain, LangGraph, OpenAI (`gpt-4o-mini`, `gpt-4o-mini-tts`, `text-embedding-3-small`), Pinecone, Supabase (`supabase-py`), PyPDF.
- **Data & Storage**:
  - **Supabase**: PostgreSQL for metadata (resumes, ATS analyses, interview sessions, feedback) and Supabase Storage for resume files.
  - **Pinecone**: Vector database for semantic search on chunked resume text (namespaced per user or guest).

---

## 2. Key Subsystems & Workflows

### ATS Analysis Pipeline (`/api/v1/resume/ats-check`)
1. User uploads a PDF resume and job description.
2. Resume text is extracted using PyPDF, chunked via `RecursiveCharacterTextSplitter`, embedded using `text-embedding-3-small`, and stored in Pinecone under the user/guest namespace.
3. LangChain executes `ATS_PROMPT` against `gpt-4o-mini` to extract structured JSON evaluation metrics (match score, strengths, gaps, and improvements).
4. Results and file references are persisted to Supabase.

### Mock Interview Flow (`/api/v1/interview/`)
1. **Session Creation** (`POST /api/v1/interview/session`): Links an ATS analysis to a new interview session.
2. **Live Interview Session** (`WebSocket /api/v1/interview/session/{session_id}`):
   - Initializes interview context (resume text, job description).
   - Loops through dynamic interview questions (capped by `MAX_QUESTIONS`).
   - Uses **LangGraph** (`interview_flow.py`) to maintain conversation history and dynamically craft questions tailored to candidate answers and resume context.
   - Converts AI questions into audio using OpenAI TTS (`AudioService.synthesize`) and streams bytes + text to the client.
   - On completion, triggers `FeedbackService` and parses structured post-interview feedback, persisting it to Supabase.

---

## 3. Environment Variables

### Backend (`apps/backend/.env`)
```bash
OPENAI_API_KEY="your-openai-api-key"
PINECONE_API_KEY="your-pinecone-api-key"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### Frontend (`apps/frontend/.env.local`)
```bash
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

---

## 4. Building and Running

### Prerequisites
- Node.js (v20+ recommended)
- Python 3.11 (`runtime.txt` specifies Python 3.11.9)

### Backend Setup (`apps/backend`)

1. **Activate Virtual Environment**:
   ```bash
   cd apps/backend
   python3.11 -m venv venv
   source venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize Pinecone Index** (one-time setup):
   ```bash
   python -m app.scripts.create_pinecone_index
   ```

4. **Run Development Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *Health check endpoint:* `GET http://localhost:8000/health`

### Frontend Setup (`apps/frontend`)

1. **Install Dependencies**:
   ```bash
   cd apps/frontend
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Runs by default on `http://localhost:3000`.

3. **Build & Lint**:
   ```bash
   npm run build
   npm run lint
   ```

### Testing
- Automated test suites (e.g. pytest / Jest) are not yet integrated.
- *TODO*: Add unit and integration tests under `apps/backend/tests` and `apps/frontend/__tests__`.

---

## 5. Development Conventions & Guidelines

### Backend Conventions
- **Routing**: Keep routes modular inside `app/api/v1/routes/` and expose them through `app/api/v1/router.py`.
- **Services Pattern**: Business logic, database interactions, vector queries, and LLM chains belong in `app/services/` (e.g., `ats_service.py`, `session_service.py`, `audio_service.py`), not inside route handlers.
- **Agent Workflows**: LangGraph definitions belong in `app/graphs/`. Keep state types (`TypedDict` / Pydantic) explicitly defined.
- **Async First**: Use async methods for I/O operations (FastAPI endpoints, Supabase queries, OpenAI async client calls).
- **Security**: Never expose service role keys or private OpenAI/Pinecone keys to the frontend.

### Frontend Conventions
- **Next.js App Router**: Route structures reside under `apps/frontend/app/`. Use client components (`"use client"`) only when local state, browser APIs, or WebSocket connections are required.
- **Styling**: Use Tailwind CSS utility classes and Radix UI components (located in `components/ui/`).
- **Auth Guarding**: Route protection is handled through Clerk middleware in `proxy.ts` (protecting `/dashboard(.*)`).
- **API Communication**: Reference the backend URL via `NEXT_PUBLIC_API_URL` with a fallback to `http://127.0.0.1:8000`.

---

## 6. Core Development Rules & Operational Guardrails

- **Understand First**: Understand the existing architecture before making changes.
- **Scope Discipline**: Do not modify unrelated files or redesign the UI unless explicitly requested.
- **Preserve Core Workflows**: Preserve existing ATS analysis and voice mock interview functionality.
- **Approved Tech Stack**:
  - **Frontend**: Next.js, React, TypeScript.
  - **Backend**: FastAPI, Python.
  - **Authentication**: Clerk.
  - **Database & Storage**: Supabase.
  - **Vector Database**: Pinecone.
- **Consistency**: Follow existing naming conventions and folder structure.
- **API Contract Alignment**: Always verify frontend API calls against actual backend routes.
- **Credential Protection**: Never expose secrets or commit environment files (`.env`, `.env.local`).
- **Audit Mode**: For audits, inspect and report only; do not change files.
- **Implementation Strategy**: For implementation, explain the planned changes before making broad changes.
- **Validation**: Run relevant tests, builds, and lint checks after approved changes.
