# AI Career Agent — Project Overview

**AI Career Agent** is a full-stack, AI-driven career preparation platform designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS) and practice realistic, tailored job interviews with an AI interviewer.

---

## 1. Key Features

### ATS Resume Analysis & Match Scoring
- **Document Ingestion**: Supports direct PDF resume uploads along with a target job description.
- **Semantic Matching**: Chunks and embeds the resume content into a vector database (Pinecone) to compare directly against job requirements.
- **Comprehensive Evaluation**: Uses an LLM (OpenAI GPT-4o-mini) to provide:
  - Overall ATS match percentage score.
  - Identification of key strengths and matching qualifications.
  - Missing keywords, technical skills, and experience gaps.
  - Concrete, actionable recommendations to improve resume alignment.

### Interactive AI Mock Interviews (Voice + Chat)
- **Context-Aware Questioning**: Dynamically crafts interview questions customized to the candidate's actual resume and the target role.
- **Agentic State Machine**: Powered by LangGraph to manage conversational state, track answered questions, and ask relevant follow-ups.
- **Real-Time Voice & Text**: Bidirectional WebSocket communication streaming synthesized speech via OpenAI TTS and processing candidate audio responses.
- **Automated Feedback & Debrief**: Synthesizes the interview transcript into structured feedback on communication, technical accuracy, and areas for improvement.

### User Dashboard & History
- Centralized tracking for past ATS resume checks and mock interview performance.
- Supabase-backed storage for persistence and tracking progress over time.

---

## 2. System Architecture & Tech Stack

### Frontend (`apps/frontend`)
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS v4, Radix UI primitives, Lucide React icons
- **Authentication**: Clerk (`@clerk/nextjs`)
- **Key Routes & Components**:
  - `/upload`: Resume (PDF) and job description submission workflow.
  - `/result`: ATS score breakdown and recommendation view.
  - `/dashboard`: User overview of past sessions and analyses.
  - `/dashboard/interview` & `AIInterviewRoom`: Real-time voice/chat mock interview interface.

### Backend (`apps/backend`)
- **Framework**: FastAPI (Python), Uvicorn ASGI server
- **AI & LLM Orchestration**:
  - **LangChain** & **LangGraph**: Conversational flow control, state tracking, and prompt chains.
  - **OpenAI GPT-4o-mini**: Prompt evaluation, question generation, and candidate feedback analysis.
  - **OpenAI Audio / TTS**: Audio synthesis (`gpt-4o-mini-tts`) streamed directly to the frontend.
- **Vector Search & Embeddings**: Pinecone (isolated per-user / guest namespaces for resume retrieval).
- **Database & Storage**: Supabase (PostgreSQL for session/ATS records; Supabase Storage for uploaded resumes).
- **Document Processing**: PyPDF and LangChain text splitters for document parsing.
