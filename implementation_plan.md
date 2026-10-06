# MemoryMind AI Backend Implementation Plan

This document outlines the phased implementation plan for building the MemoryMind AI backend. It closely follows the architecture and sequence specified in the `backend.md` blueprint. The frontend is already statically built, and we will now integrate it incrementally through these backend phases.

## Goal Description

To build a modular monolith backend in FastAPI with PostgreSQL (Supabase), Redis, and Celery. The backend will handle user authentication, document uploads, async processing (parsing, chunking, embeddings), RAG-based chat, and AI learning tools (flashcards, quizzes, etc.). 

## User Review Required

- Please review these phases and confirm if you want to start with **Phase 1 (Foundation)**.
- If you're using Supabase, please ensure you have the Supabase URL, Anon Key, and Database connection strings ready for the environment setup.

## Open Questions

- Should we use a local PostgreSQL database for initial development, or will we connect directly to a Supabase project from the start?
- For local vector embedding, `Sentence Transformers` is recommended for cost savings before integrating an external provider (like OpenAI or Gemini). Does this sound good?

---

## Proposed Changes

### Phase 1: Foundation (Current Target)
Setting up the core FastAPI application and authentication layer.

- Initialize the FastAPI project inside the `backend/app/` folder to match the specified structure.
- Set up environment variables and `.env` loading.
- Connect to PostgreSQL using SQLAlchemy and configure Alembic for migrations.
- Implement the `users` and `user_settings` models.
- Build JWT authentication (Signup, Login, Refresh, Me).

### Phase 2: Documents Management
Handling secure file ingestion and basic CRUD.

- Integrate Supabase Storage (or S3-compatible local alternative) for uploaded files.
- Implement document models (`documents`, `document_versions`).
- Build APIs for document upload, listing, retrieval, soft-delete (Trash), and status checking.

### Phase 3: Background Processing Pipeline
Making documents searchable asynchronously without blocking the main API.

- Set up Redis and Celery workers.
- Implement file parsers (PDF via PyMuPDF, DOCX via python-docx, TXT).
- Implement the chunking strategy (paragraphs/sections, 500-800 tokens).
- Configure the embedding provider (Sentence Transformers).
- Set up `pgvector` inside PostgreSQL and store embeddings.

### Phase 4: RAG Chat Integration
Enabling context-aware Q&A with the documents.

- Implement chat models (`chat_sessions`, `chat_messages`, `retrieval_logs`).
- Build the Vector Retrieval service filtering by user ID.
- Create Prompt Builders for RAG.
- Implement the LLM Service Abstraction (Gemini/OpenAI).
- Build the chat API endpoints and streaming responses.

### Phase 5: Learning AI Services
The core educational tools.

- Implement Flashcard generation via LLM and a basic spaced repetition scheduler.
- Implement Quiz generation, attempts logging, and validation schemas.
- Implement the basic Knowledge Graph extraction (nodes and edges).

### Phase 6: Productivity & Analytics
Tracking progress and scheduling.

- Implement the Timeline and Study Session tracking.
- Build Analytics aggregation endpoints (study hours, quizzes completed).
- Implement Calendar API and Celery Beat reminder jobs.

### Phase 7: Hardening
Preparing for production.

- Implement Rate Limiting and Caching via Redis.
- Structured Logging and Health checks.
- Add comprehensive integration and unit testing.

## Verification Plan

### Automated Tests
- For Phase 1, we will run `pytest` to test JWT token generation, database connection, and user signups.
### Manual Verification
- We will verify API endpoints using Swagger UI (available at `http://localhost:8000/docs`).
- We will manually test the user flow from the React frontend to ensure it can successfully authenticate with the backend and store the JWT.
