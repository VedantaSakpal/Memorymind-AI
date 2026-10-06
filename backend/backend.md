# MemoryMind AI — Backend Development Specification

**Document:** `backend.md`  
**Project:** MemoryMind AI  
**Role:** Backend + AI/ML Engineering Specification  
**Status:** Backend implementation blueprint  
**Primary architecture:** FastAPI modular monolith + PostgreSQL/Supabase + pgvector + Redis + Celery + Object Storage  

---

## 1. Project Objective

MemoryMind AI is a document-based intelligent learning platform. A user uploads study material such as PDFs, DOC/DOCX files, images, and text files. The backend extracts and processes the content, creates searchable representations, stores document metadata and embeddings, and exposes AI services for:

- Context-aware document chat using RAG
- Automatic flashcard generation
- Quiz/MCQ generation
- Knowledge graph extraction
- Learning timeline/history
- Analytics and study progress
- Calendar, reminders, and spaced repetition
- Trash/recovery and document versioning

The backend must be designed so that normal CRUD operations remain fast while expensive AI/document-processing operations execute asynchronously.

---

# 2. Recommended Architecture

## 2.1 Architecture Decision

Use a **modular monolith** for the first production version rather than immediately splitting into microservices.

### Why modular monolith?

- Easier local development
- Lower deployment complexity
- Shared database transactions are simple
- AI modules can still be isolated internally
- Easy to split high-load modules into services later
- Suitable for a college/minor-project scale while remaining production-oriented

### High-level architecture

```text
                         ┌──────────────────────────┐
                         │       React Frontend     │
                         │ Dashboard / Chat / etc.  │
                         └────────────┬─────────────┘
                                      │ HTTPS / REST
                                      ▼
                    ┌──────────────────────────────────┐
                    │          FastAPI Backend          │
                    │                                  │
                    │ Auth │ Documents │ Chat │ AI     │
                    │ Quiz │ Cards │ Graph │ Analytics │
                    │ Calendar │ Timeline │ Settings   │
                    └───────┬───────────┬──────────────┘
                            │           │
              ┌─────────────┘           └─────────────┐
              ▼                                       ▼
   ┌──────────────────────┐                 ┌──────────────────────┐
   │ PostgreSQL / Supabase│                 │ Redis                │
   │ Users, docs, chunks, │                 │ Cache + Celery broker │
   │ chats, quizzes, etc. │                 └──────────┬───────────┘
   └──────────┬───────────┘                            │
              │                                         ▼
              │                              ┌──────────────────────┐
              │                              │ Celery Workers       │
              │                              │ Parsing / Embeddings │
              │                              │ AI generation        │
              │                              └──────────┬───────────┘
              │                                         │
              ▼                                         ▼
   ┌──────────────────────┐                 ┌──────────────────────┐
   │ pgvector             │                 │ LLM / Embedding API │
   │ Document embeddings  │                 │ Gemini / OpenAI     │
   └──────────────────────┘                 └──────────────────────┘
              
   ┌─────────────────────────────────────────────────────────────┐
   │ Supabase Storage / S3-compatible Object Storage              │
   │ Original files, derived images, OCR artifacts, exports       │
   └─────────────────────────────────────────────────────────────┘
```

---

# 3. Technology Stack

| Layer | Recommended Technology | Purpose |
|---|---|---|
| API | Python + FastAPI | REST API, async I/O, validation |
| ORM | SQLAlchemy 2.x | Database access |
| Validation | Pydantic v2 | Request/response models |
| Database | PostgreSQL / Supabase | Relational application data |
| Vector Search | pgvector | Embeddings + similarity search |
| Object Storage | Supabase Storage | Uploaded documents |
| Cache | Redis | Caching, rate limiting, broker |
| Background Jobs | Celery | Parsing, OCR, embedding, generation |
| Task Monitoring | Flower (optional) | Celery task monitoring |
| Authentication | JWT + OAuth2 | Access control |
| Password Hashing | Argon2id | Secure passwords |
| PDF Parsing | PyMuPDF / pypdf | PDF extraction |
| DOCX | python-docx | Word document extraction |
| DOC | LibreOffice conversion service or controlled conversion | Legacy `.doc` handling |
| Images | Pillow + OCR | Image processing |
| OCR | Tesseract or cloud OCR | Scanned documents |
| Chunking | Custom semantic chunker | RAG indexing |
| Embeddings | Sentence Transformers or provider embeddings | Vector generation |
| LLM | Gemini or OpenAI | Chat and generation |
| Graph | PostgreSQL tables + NetworkX | Knowledge relationships |
| Scheduling | Celery Beat | Reminders / recurring tasks |
| Testing | Pytest + HTTPX | API and integration tests |
| Migrations | Alembic | Schema migrations |
| Deployment | Docker + Docker Compose | Reproducible environments |
| Reverse Proxy | Nginx | TLS, routing, upload limits |

### Suggested initial AI provider strategy

Implement an internal provider abstraction:

```text
LLMProvider
├── GeminiProvider
└── OpenAIProvider

EmbeddingProvider
├── LocalSentenceTransformerProvider
└── APIEmbeddingProvider
```

This avoids rewriting the application when changing models.

---

# 4. Core Engineering Principles

1. **Never perform expensive AI processing directly inside a normal request.** Queue it.
2. **Every database record that belongs to a user must be scoped by `user_id`.**
3. **Original files are stored in object storage, not PostgreSQL.**
4. **PostgreSQL stores metadata, extracted text references, chunks, vectors, and application state.**
5. **AI providers are accessed through service interfaces, not directly from route handlers.**
6. **Use background jobs for parsing, OCR, embeddings, flashcards, quizzes, graph extraction, and large re-indexing tasks.**
7. **Make processing idempotent** so retrying a failed task does not create duplicates.
8. **Maintain document processing status** so frontend can show progress.
9. **Store model name, prompt version, and processing timestamps** for reproducibility/debugging.
10. **Do not expose provider API keys to the frontend.**

---

# 5. Backend Project Structure

```text
backend/
│
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── database.py
│   │   ├── logging.py
│   │   ├── exceptions.py
│   │   └── middleware.py
│   │
│   ├── api/
│   │   ├── router.py
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── documents.py
│   │       ├── chat.py
│   │       ├── flashcards.py
│   │       ├── quizzes.py
│   │       ├── knowledge_graph.py
│   │       ├── timeline.py
│   │       ├── analytics.py
│   │       ├── calendar.py
│   │       ├── settings.py
│   │       └── trash.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── document.py
│   │   ├── chunk.py
│   │   ├── chat.py
│   │   ├── flashcard.py
│   │   ├── quiz.py
│   │   ├── graph.py
│   │   ├── analytics.py
│   │   ├── calendar.py
│   │   └── audit.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── document.py
│   │   ├── chat.py
│   │   ├── flashcard.py
│   │   ├── quiz.py
│   │   ├── graph.py
│   │   ├── analytics.py
│   │   └── calendar.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── document_service.py
│   │   ├── storage_service.py
│   │   ├── parser_service.py
│   │   ├── ocr_service.py
│   │   ├── chunking_service.py
│   │   ├── embedding_service.py
│   │   ├── vector_service.py
│   │   ├── rag_service.py
│   │   ├── llm_service.py
│   │   ├── flashcard_service.py
│   │   ├── quiz_service.py
│   │   ├── graph_service.py
│   │   ├── analytics_service.py
│   │   ├── timeline_service.py
│   │   ├── calendar_service.py
│   │   └── notification_service.py
│   │
│   ├── repositories/
│   │   ├── user_repository.py
│   │   ├── document_repository.py
│   │   ├── chunk_repository.py
│   │   ├── chat_repository.py
│   │   ├── flashcard_repository.py
│   │   ├── quiz_repository.py
│   │   └── analytics_repository.py
│   │
│   ├── workers/
│   │   ├── celery_app.py
│   │   ├── document_tasks.py
│   │   ├── embedding_tasks.py
│   │   ├── ai_tasks.py
│   │   ├── analytics_tasks.py
│   │   └── reminder_tasks.py
│   │
│   └── utils/
│       ├── file_validation.py
│       ├── text_cleaner.py
│       ├── pagination.py
│       ├── token_counter.py
│       └── datetime_utils.py
│
├── alembic/
├── tests/
├── scripts/
├── uploads/                 # local development only
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── alembic.ini
├── .env.example
└── README.md
```

---

# 6. Main Backend Modules

## 6.1 Authentication Module

Responsibilities:

- Signup
- Login
- Refresh token
- Logout/token revocation strategy
- Password reset
- OAuth2 provider integration later
- User profile
- User settings

### JWT strategy

Use:

- Short-lived access token
- Longer-lived refresh token
- Password hash using Argon2id
- Token claims: `sub`, `type`, `iat`, `exp`

Do not store plain passwords.

---

# 7. Database Design

Use PostgreSQL as the primary database and enable `pgvector`.

## 7.1 Entity Relationship Overview

```text
User
 │
 ├──< UserSettings
 ├──< Document
 │      ├──< DocumentVersion
 │      ├──< DocumentChunk
 │      │       └── embedding VECTOR
 │      ├──< Flashcard
 │      ├──< Quiz
 │      └──< KnowledgeNode / KnowledgeEdge
 │
 ├──< ChatSession
 │      └──< ChatMessage
 │
 ├──< StudySession
 ├──< TimelineEvent
 ├──< CalendarEvent
 ├──< Reminder
 └──< AuditLog
```

---

# 8. Database Tables

## 8.1 `users`

```text
id                UUID PK
email             VARCHAR UNIQUE NOT NULL
password_hash     VARCHAR NULL
full_name         VARCHAR
avatar_url        TEXT NULL
is_active         BOOLEAN DEFAULT TRUE
is_verified       BOOLEAN DEFAULT FALSE
created_at        TIMESTAMP
updated_at        TIMESTAMP
last_login_at     TIMESTAMP NULL
```

## 8.2 `user_settings`

```text
id                    UUID PK
user_id               UUID FK users.id UNIQUE
language              VARCHAR DEFAULT 'en'
theme                 VARCHAR DEFAULT 'system'
ai_response_style     VARCHAR DEFAULT 'balanced'
notifications_enabled BOOLEAN DEFAULT TRUE
study_goal_minutes    INTEGER DEFAULT 30
created_at            TIMESTAMP
updated_at            TIMESTAMP
```

## 8.3 `documents`

```text
id                  UUID PK
user_id             UUID FK users.id
parent_document_id  UUID NULL
name                VARCHAR NOT NULL
original_filename   VARCHAR NOT NULL
mime_type           VARCHAR NOT NULL
file_extension      VARCHAR NOT NULL
file_size           BIGINT NOT NULL
storage_path        TEXT NOT NULL
status              VARCHAR NOT NULL
processing_error    TEXT NULL
page_count          INTEGER NULL
word_count          INTEGER NULL
language            VARCHAR NULL
checksum            VARCHAR NULL
version_number      INTEGER DEFAULT 1
is_deleted          BOOLEAN DEFAULT FALSE
deleted_at          TIMESTAMP NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

Recommended status values:

```text
UPLOADED
QUEUED
PARSING
OCR_PROCESSING
CHUNKING
EMBEDDING
INDEXED
FAILED
DELETING
DELETED
```

## 8.4 `document_versions`

```text
id                 UUID PK
document_id        UUID FK documents.id
version_number     INTEGER
storage_path       TEXT
file_size          BIGINT
checksum           VARCHAR
created_at         TIMESTAMP
```

## 8.5 `document_chunks`

```text
id                 UUID PK
document_id        UUID FK documents.id
version_id         UUID FK document_versions.id
chunk_index        INTEGER
content            TEXT NOT NULL
token_count        INTEGER
page_number        INTEGER NULL
section_title      VARCHAR NULL
char_start         INTEGER NULL
char_end           INTEGER NULL
embedding_model    VARCHAR
embedding          VECTOR(dim) NOT NULL
metadata           JSONB
created_at         TIMESTAMP
```

Recommended indexes:

```sql
CREATE INDEX idx_chunks_document_id
ON document_chunks(document_id);

CREATE INDEX idx_chunks_version_id
ON document_chunks(version_id);

-- Add the appropriate pgvector ANN index after choosing the final vector dimension.
```

## 8.6 `chat_sessions`

```text
id               UUID PK
user_id          UUID FK users.id
document_id      UUID NULL FK documents.id
title            VARCHAR
created_at       TIMESTAMP
updated_at       TIMESTAMP
```

## 8.7 `chat_messages`

```text
id                 UUID PK
session_id         UUID FK chat_sessions.id
role               VARCHAR
content            TEXT
model_name         VARCHAR NULL
prompt_version     VARCHAR NULL
retrieval_metadata JSONB NULL
created_at         TIMESTAMP
```

`role` values:

```text
USER
ASSISTANT
SYSTEM
```

## 8.8 `retrieval_logs`

Used to debug RAG quality.

```text
id                  UUID PK
message_id          UUID FK chat_messages.id
chunk_id            UUID FK document_chunks.id
similarity_score    FLOAT
rank_position       INTEGER
created_at          TIMESTAMP
```

## 8.9 `flashcards`

```text
id                UUID PK
user_id           UUID FK users.id
document_id       UUID NULL FK documents.id
question          TEXT
answer            TEXT
hint              TEXT NULL
difficulty        VARCHAR
source_chunk_ids  JSONB
next_review_at    TIMESTAMP NULL
last_reviewed_at  TIMESTAMP NULL
review_count      INTEGER DEFAULT 0
interval_days     INTEGER DEFAULT 0
ease_factor       FLOAT DEFAULT 2.5
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

## 8.10 `quizzes`

```text
id              UUID PK
user_id         UUID FK users.id
document_id      UUID NULL FK documents.id
title           VARCHAR
description     TEXT NULL
difficulty      VARCHAR
question_count  INTEGER
created_at      TIMESTAMP
```

## 8.11 `quiz_questions`

```text
id              UUID PK
quiz_id         UUID FK quizzes.id
question_text   TEXT
question_type   VARCHAR
options         JSONB
correct_answer  JSONB
explanation     TEXT
source_chunk_id UUID NULL
position        INTEGER
```

## 8.12 `quiz_attempts`

```text
id               UUID PK
quiz_id          UUID FK quizzes.id
user_id          UUID FK users.id
score            FLOAT
answers          JSONB
started_at       TIMESTAMP
completed_at     TIMESTAMP
```

## 8.13 `knowledge_nodes`

```text
id           UUID PK
user_id      UUID FK users.id
document_id  UUID NULL FK documents.id
label        VARCHAR
node_type    VARCHAR
description  TEXT NULL
metadata     JSONB
created_at   TIMESTAMP
```

## 8.14 `knowledge_edges`

```text
id           UUID PK
user_id      UUID FK users.id
document_id  UUID NULL FK documents.id
source_id    UUID FK knowledge_nodes.id
target_id    UUID FK knowledge_nodes.id
relation     VARCHAR
weight       FLOAT DEFAULT 1
metadata     JSONB
created_at   TIMESTAMP
```

## 8.15 `study_sessions`

```text
id              UUID PK
user_id         UUID FK users.id
document_id     UUID NULL FK documents.id
started_at      TIMESTAMP
ended_at        TIMESTAMP NULL
duration_seconds INTEGER DEFAULT 0
activity_type   VARCHAR
metadata        JSONB
```

## 8.16 `timeline_events`

```text
id          UUID PK
user_id     UUID FK users.id
event_type  VARCHAR
entity_type VARCHAR
entity_id   UUID NULL
metadata    JSONB
created_at  TIMESTAMP
```

## 8.17 `calendar_events`

```text
id              UUID PK
user_id         UUID FK users.id
title           VARCHAR
description     TEXT
start_at        TIMESTAMP
end_at          TIMESTAMP
recurrence_rule VARCHAR NULL
status          VARCHAR
metadata        JSONB
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## 8.18 `reminders`

```text
id              UUID PK
user_id         UUID FK users.id
calendar_event_id UUID NULL FK calendar_events.id
type            VARCHAR
scheduled_for   TIMESTAMP
status          VARCHAR
message         TEXT
created_at      TIMESTAMP
sent_at         TIMESTAMP NULL
```

## 8.19 `audit_logs`

```text
id          UUID PK
user_id     UUID NULL
action      VARCHAR
entity_type VARCHAR
entity_id   UUID NULL
ip_hash     VARCHAR NULL
metadata    JSONB
created_at  TIMESTAMP
```

---

# 9. API Design

Base URL:

```text
/api/v1
```

## 9.1 Authentication APIs

```text
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/me
POST   /auth/forgot-password
POST   /auth/reset-password
```

### Register request

```json
{
  "full_name": "Vedant",
  "email": "user@example.com",
  "password": "strong-password"
}
```

### Login response

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer",
  "expires_in": 900
}
```

---

# 10. Document APIs

```text
POST    /documents/upload
GET     /documents
GET     /documents/{document_id}
PATCH   /documents/{document_id}
DELETE  /documents/{document_id}
POST    /documents/{document_id}/restore
DELETE  /documents/{document_id}/permanent
GET     /documents/{document_id}/status
GET     /documents/{document_id}/download
GET     /documents/{document_id}/versions
POST    /documents/{document_id}/reprocess
```

### Upload flow

The frontend sends `multipart/form-data` with the file.

Backend must:

1. Authenticate user.
2. Validate extension and MIME type.
3. Enforce maximum file size.
4. Generate safe storage key.
5. Compute checksum.
6. Upload to object storage.
7. Create document record.
8. Set status to `QUEUED`.
9. Push processing task to Celery.
10. Return immediately with document ID and status.

Example response:

```json
{
  "id": "uuid",
  "name": "Machine Learning Notes.pdf",
  "status": "QUEUED",
  "message": "Document uploaded and queued for processing."
}
```

---

# 11. Document Processing Pipeline

This is the core ingestion pipeline.

```text
Upload
  ↓
Validation
  ↓
Object Storage
  ↓
Create Document Record
  ↓
Celery Queue
  ↓
File Type Detection
  ↓
Text Extraction
  ↓
OCR when required
  ↓
Text Cleaning
  ↓
Metadata Extraction
  ↓
Chunking
  ↓
Embedding Generation
  ↓
Store Chunks + Vectors
  ↓
Optional AI Summarization
  ↓
Optional Flashcards / Quiz / Graph
  ↓
INDEXED
```

---

# 12. File Processing Strategy

## Supported types

```text
.pdf
.doc
.docx
.txt
.jpg
.jpeg
.png
```

### PDF

Primary extractor: PyMuPDF.

Extract:

- Text
- Page number
- Page count
- Basic metadata

If extracted text is too small or missing, route pages/images through OCR.

### DOCX

Use `python-docx`.

Extract:

- Paragraphs
- Headings
- Tables where useful

### DOC

Convert to a normalized `.docx` or PDF using a controlled server-side conversion process before normal extraction. Avoid executing untrusted office files directly in the main API process.

### TXT

Read as UTF-8 with a safe fallback strategy.

### JPG / PNG

Pipeline:

```text
Image
 ↓
Pre-processing
 ↓
OCR
 ↓
Text cleaning
 ↓
Chunking
 ↓
Embedding
```

OCR should run in a worker, not in the API request thread.

---

# 13. Chunking Strategy

Do not split text using a fixed character length only.

Recommended first implementation:

```text
1. Split by document sections/headings
2. Split long sections into paragraphs
3. Create chunks around 500–800 tokens
4. Use 80–120 token overlap
5. Preserve page number and section title
```

Each chunk should contain metadata like:

```json
{
  "document_id": "...",
  "page": 12,
  "section": "Gradient Descent",
  "chunk_index": 43
}
```

This metadata is important for citations in AI answers.

---

# 14. Embedding Strategy

Create an abstraction:

```python
class EmbeddingProvider:
    async def embed_text(self, text: str) -> list[float]:
        ...

    async def embed_documents(self, texts: list[str]) -> list[list[float]]:
        ...
```

Do not hard-code a vector dimension throughout the system. Configure the selected embedding model and dimension centrally.

Store:

- Embedding model name
- Dimension
- Generation timestamp
- Chunk ID

Recommended development approach:

### Local development

Use a sentence-transformer embedding model to reduce API cost.

### Production/API mode

Use a hosted embedding provider when consistent quality or scale requires it.

---

# 15. Vector Search

Use **pgvector** first instead of adding Pinecone/Weaviate immediately.

Reasons:

- One database for application data + vectors
- Simpler deployment
- Easy filtering by `user_id` and `document_id`
- Excellent fit for the current project size

Vector retrieval must always apply ownership filters.

Conceptual query:

```text
query embedding
       ↓
pgvector similarity search
       ↓
filter user_id = current user
       ↓
optional document_id filter
       ↓
Top K chunks
```

Recommended initial retrieval:

```text
Top K = 5–8 chunks
```

The final value should be tuned using evaluation data.

---

# 16. RAG Architecture

## End-to-end chat flow

```text
User question
     ↓
Authenticate user
     ↓
Normalize question
     ↓
Create query embedding
     ↓
Vector retrieval
     ↓
Optional keyword/metadata filtering
     ↓
Top-K chunks
     ↓
Context compression / reranking (optional)
     ↓
Prompt builder
     ↓
LLM
     ↓
Answer + citations
     ↓
Save message + retrieval logs
```

## RAG service responsibilities

```python
class RAGService:
    async def answer(
        self,
        user_id: str,
        question: str,
        session_id: str,
        document_id: str | None = None,
    ):
        ...
```

The RAG service should:

1. Retrieve only documents the user can access.
2. Retrieve high-relevance chunks.
3. Build a bounded context.
4. Instruct the model to use only supported context for factual claims.
5. Request citation references where appropriate.
6. Store retrieval information for debugging.

---

# 17. Prompt Architecture

Do not build giant prompts inside API routes.

Create:

```text
app/services/prompts/
├── rag_prompt.py
├── flashcard_prompt.py
├── quiz_prompt.py
└── graph_prompt.py
```

Each prompt should have a version.

Example metadata:

```text
prompt_version = rag-v1.2
model = selected-model
```

This makes it possible to compare quality after prompt changes.

---

# 18. AI Chat API

```text
POST /chat/sessions
GET  /chat/sessions
GET  /chat/sessions/{session_id}
POST /chat/sessions/{session_id}/messages
DELETE /chat/sessions/{session_id}
```

Request:

```json
{
  "message": "Explain gradient descent in simple words.",
  "document_id": "uuid"
}
```

Response:

```json
{
  "message_id": "uuid",
  "answer": "...",
  "citations": [
    {
      "document_id": "uuid",
      "page": 12,
      "chunk_id": "uuid",
      "score": 0.91
    }
  ]
}
```

### Hallucination controls

The model prompt must instruct the model to:

- Prefer retrieved context.
- Say when the document does not contain enough information.
- Avoid pretending a source supports an unsupported claim.
- Keep citations connected to actual retrieved chunks.

---

# 19. Flashcard Generation

## API

```text
POST /flashcards/generate
GET  /flashcards
GET  /flashcards/{id}
POST /flashcards/{id}/review
PATCH /flashcards/{id}
DELETE /flashcards/{id}
```

Generation request:

```json
{
  "document_id": "uuid",
  "count": 20,
  "difficulty": "medium"
}
```

Generation should be asynchronous for large documents.

Worker pipeline:

```text
Document/chunks
 ↓
Select representative chunks
 ↓
LLM structured generation
 ↓
Validate JSON schema
 ↓
Deduplicate cards
 ↓
Store cards
```

Flashcards must retain source chunk IDs where possible.

---

# 20. Spaced Repetition

Implement a simple scheduling engine first.

Input signals:

```text
Again
Hard
Good
Easy
```

Store:

- Review count
- Current interval
- Ease factor
- Next review date

Do not depend on the LLM for scheduling calculations. Scheduling must be deterministic and testable.

---

# 21. Quiz Generation

## API

```text
POST /quizzes/generate
GET  /quizzes
GET  /quizzes/{quiz_id}
POST /quizzes/{quiz_id}/submit
GET  /quizzes/{quiz_id}/attempts
DELETE /quizzes/{quiz_id}
```

Supported question types:

```text
MCQ
TRUE_FALSE
SHORT_ANSWER
```

LLM output must be validated against a strict Pydantic schema before insertion.

For MCQ:

```json
{
  "question": "What is overfitting?",
  "options": [
    "...",
    "...",
    "...",
    "..."
  ],
  "correct_answer": 1,
  "explanation": "..."
}
```

The answer must never be accepted directly from an unvalidated model response.

---

# 22. Knowledge Graph

The graph module converts extracted concepts into nodes and relationships.

### Pipeline

```text
Document
 ↓
Important concept extraction
 ↓
Entity normalization
 ↓
Relationship extraction
 ↓
Deduplication
 ↓
Node/edge validation
 ↓
PostgreSQL graph tables
 ↓
Frontend graph visualization
```

Example:

```text
Machine Learning
      │
      ├── uses → Regression
      ├── uses → Classification
      └── includes → Supervised Learning
```

## API

```text
POST /knowledge-graph/generate
GET  /knowledge-graph
GET  /knowledge-graph/{document_id}
```

Use JSON format at the API boundary:

```json
{
  "nodes": [],
  "edges": []
}
```

For a later high-scale version, the graph layer can be moved to a dedicated graph database.

---

# 23. Timeline

Track important events rather than reconstructing everything from arbitrary logs.

Events can include:

```text
DOCUMENT_UPLOADED
DOCUMENT_INDEXED
CHAT_STARTED
QUESTION_ASKED
FLASHCARD_GENERATED
FLASHCARD_REVIEWED
QUIZ_GENERATED
QUIZ_COMPLETED
STUDY_STARTED
STUDY_COMPLETED
CALENDAR_EVENT_CREATED
```

API:

```text
GET /timeline
```

Support pagination and date filters.

---

# 24. Analytics

Analytics should primarily be derived from event/session data rather than manually incrementing counters everywhere.

## Dashboard metrics

```text
Total documents
Indexed documents
Total flashcards
Completed quizzes
Average quiz score
Study hours
Current streak
Questions asked
Cards reviewed
```

## API

```text
GET /analytics/overview
GET /analytics/study-time
GET /analytics/activity
GET /analytics/weekly
GET /analytics/monthly
```

For performance, aggregate expensive reports asynchronously or cache common ranges.

---

# 25. Calendar and Reminders

API:

```text
GET    /calendar/events
POST   /calendar/events
GET    /calendar/events/{id}
PATCH  /calendar/events/{id}
DELETE /calendar/events/{id}
POST   /calendar/reminders
GET    /calendar/reminders
```

Reminder worker:

```text
Celery Beat
   ↓
Find pending reminders
   ↓
Trigger notification service
   ↓
Mark reminder sent
```

Notification delivery can initially be email or in-app. Push notifications can be added later.

---

# 26. Trash and Recovery

Prefer **soft delete** for documents.

Delete flow:

```text
DELETE /documents/{id}
        ↓
 is_deleted = true
 deleted_at = now()
        ↓
 hidden from normal document list
        ↓
 visible in Trash
```

Restore:

```text
POST /documents/{id}/restore
```

Permanent deletion should remove:

- Object-storage file
- Document versions
- Chunks
- Embeddings
- Related derived records according to retention rules

Permanent deletion should be a background task when the object is large.

---

# 27. Authorization Model

Every protected request follows:

```text
JWT
 ↓
Current user
 ↓
Resource lookup
 ↓
Verify resource.user_id == current_user.id
 ↓
Perform operation
```

Never trust a `user_id` supplied by the frontend.

For a future sharing feature, add a dedicated `document_permissions` table rather than bypassing the ownership layer.

---

# 28. Security Requirements

## Mandatory

- HTTPS in production
- CORS restricted to known frontend origins
- JWT expiration
- Refresh-token rotation/revocation strategy
- Argon2id password hashing
- File MIME/type validation
- File size limits
- Safe file names/storage keys
- No API keys in frontend
- No secrets committed to Git
- Rate limiting for authentication and AI endpoints
- Input validation using Pydantic
- Parameterized/ORM database queries
- User-scoped vector retrieval
- Audit logs for sensitive actions

## File-upload security

Treat all uploaded files as untrusted.

Never:

- Execute uploaded files
- Import Python modules from uploads
- Store uploads in the public executable directory
- Trust the filename extension alone

Use:

```text
extension check
+ MIME check
+ file signature/magic-byte validation where practical
+ size limit
+ isolated processing worker/container
```

---

# 29. Error Handling

Use a consistent API error format.

```json
{
  "success": false,
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "Document not found.",
    "request_id": "uuid"
  }
}
```

Recommended error classes:

```text
AUTHENTICATION_REQUIRED
INVALID_CREDENTIALS
FORBIDDEN
VALIDATION_ERROR
DOCUMENT_NOT_FOUND
UNSUPPORTED_FILE_TYPE
FILE_TOO_LARGE
PROCESSING_FAILED
AI_PROVIDER_ERROR
VECTOR_SEARCH_ERROR
RATE_LIMITED
INTERNAL_SERVER_ERROR
```

Never expose stack traces or provider secrets to the client.

---

# 30. Background Job Architecture

## Celery queues

Create logical queues:

```text
documents
embeddings
ai_generation
analytics
notifications
```

Example tasks:

```text
process_document(document_id)
extract_text(document_id)
run_ocr(document_id)
create_chunks(document_id)
create_embeddings(document_id)
generate_flashcards(document_id, options)
generate_quiz(document_id, options)
generate_knowledge_graph(document_id)
send_reminder(reminder_id)
```

### Retry policy

Use retry with exponential backoff for transient errors such as:

- Provider timeouts
- Temporary storage failures
- Rate limits

Do not endlessly retry permanent validation failures.

---

# 31. Idempotency

Document processing must be idempotent.

Example:

```text
document_id + version_id
```

can define the unique processing scope.

Before creating chunks, the worker checks whether the version has already been indexed. Before inserting generated cards or quiz questions, use a generation/job identifier and avoid duplicate inserts.

---

# 32. Caching Strategy

Use Redis for:

- Rate limiting
- Short-lived dashboard cache
- Expensive analytics cache
- Temporary task state if needed
- Session-level transient data

Do not use Redis as the source of truth for permanent application records.

Suggested keys:

```text
analytics:{user_id}:overview
analytics:{user_id}:weekly:{date}
rate:{user_id}:{endpoint}
```

---

# 33. Configuration and Environment Variables

Create `.env.example`:

```env
APP_ENV=development
APP_NAME=MemoryMind AI
DEBUG=true

DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/memorymind

REDIS_URL=redis://localhost:6379/0

JWT_SECRET=change_me
JWT_ACCESS_EXPIRE_MINUTES=15
JWT_REFRESH_EXPIRE_DAYS=30

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=documents

LLM_PROVIDER=gemini
GEMINI_API_KEY=your-key
OPENAI_API_KEY=your-key

EMBEDDING_PROVIDER=local
EMBEDDING_MODEL=your-model-name
EMBEDDING_DIMENSION=your-dimension

MAX_UPLOAD_SIZE_MB=50
ALLOWED_ORIGINS=http://localhost:5173
```

### Important

`.env` must be in `.gitignore`.

---

# 34. Suggested API Response Convention

Success response:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

For list APIs:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "page_size": 20,
    "total": 100
  }
}
```

Use pagination on potentially large resources.

---

# 35. API Pagination and Filtering

Support:

```text
?page=1&page_size=20
?search=machine
?status=indexed
?from=2026-09-01
?to=2026-09-08
```

Avoid loading all documents, messages, flashcards, or events in a single request.

---

# 36. Observability

The backend should produce structured logs.

Log:

- Request ID
- User ID where appropriate
- Endpoint
- HTTP status
- Latency
- Job ID
- Document ID
- AI model
- Token usage where available
- Provider latency
- Error type

Do not log:

- Passwords
- JWT secrets
- API keys
- Complete private documents unnecessarily

Health endpoints:

```text
GET /health
GET /health/ready
GET /health/live
```

Readiness should verify required dependencies such as PostgreSQL and Redis.

---

# 37. AI Cost and Performance Controls

AI can become the most expensive component, so build controls from the beginning.

### Implement:

- Maximum document size
- Maximum chunk count per generation
- Token budgeting
- Model selection by task
- Prompt versioning
- Batch embedding where supported
- Cached repeated operations where practical
- Background processing
- Generation quotas/rate limits

Suggested model tiers:

```text
Chat                → balanced model
Flashcards          → lower-cost generation model
Quiz                → lower-cost structured model
Knowledge graph     → structured extraction model
Complex reasoning   → higher-capability model only when required
Embeddings          → dedicated embedding model
```

---

# 38. RAG Evaluation

Do not assume a RAG system is good just because it returns answers.

Create a small evaluation dataset containing:

```text
Question
Expected supporting page/chunk
Expected answer
Document ID
```

Measure:

- Retrieval recall
- Retrieval precision
- Citation correctness
- Answer correctness
- Hallucination rate
- Average latency
- Token usage/cost

Create an evaluation script such as:

```text
scripts/evaluate_rag.py
```

Run it whenever chunking, retrieval, embeddings, prompts, or models change significantly.

---

# 39. RAG Improvements Roadmap

### Version 1

```text
Dense vector retrieval
Top-K chunks
Simple prompt
Citations
```

### Version 2

```text
Hybrid retrieval
BM25 + vector
Metadata filtering
Reranking
Conversation-aware query rewriting
```

### Version 3

```text
Parent-child retrieval
Context compression
Question decomposition
Evaluation-driven retrieval tuning
```

Do not implement all advanced retrieval techniques before the basic system is measurable.

---

# 40. Conversation Memory

There are two different types of memory:

### Short-term conversational memory

Stored as recent chat messages and summarized when conversations become large.

### Long-term learning memory

Stored as structured user learning information such as:

```text
Topics studied
Documents studied
Weak quiz topics
Frequently asked topics
Study streak
Review schedule
```

Do not blindly embed every chat message into the document vector store. User conversation memory and document knowledge should remain separate concepts.

---

# 41. Document Summarization

Document processing can optionally generate:

```text
short_summary
key_topics
difficulty_estimate
important_sections
```

These can populate the dashboard/document preview.

For large documents, summarize section-by-section and then create a final hierarchical summary rather than placing the entire document into one LLM request.

---

# 42. Search API

A dedicated search endpoint improves the document experience.

```text
GET /search/documents?q=machine learning
GET /search/content?q=gradient descent&document_id=uuid
```

Document search should use metadata + PostgreSQL text search where appropriate. AI semantic search belongs in the vector/RAG layer.

---

# 43. Frontend Integration Contract

The frontend should never need to know internal database structure.

Example frontend state:

```text
Document
 ├── id
 ├── name
 ├── type
 ├── size
 ├── status
 ├── created_at
 └── processing_progress
```

The backend may internally have many related tables, but the API should provide frontend-friendly DTOs.

---

# 44. Real-Time Processing Status

Recommended initial implementation:

```text
Frontend polls:
GET /documents/{id}/status
```

For a later version:

```text
WebSocket / Server-Sent Events
```

Events:

```text
upload_started
parsing
ocr
chunking
embedding
indexing
completed
failed
```

---

# 45. Testing Strategy

## Unit tests

Test:

- Password hashing
- JWT validation
- Chunking
- Text cleaning
- File validation
- Flashcard scheduling
- Prompt construction
- JSON validation

## Integration tests

Test:

- Signup/login
- Document upload
- Database transactions
- RAG retrieval
- Chat creation
- Quiz submission

## AI tests

Use mocked providers for normal CI.

Keep real-provider tests separate because they may cost money and be nondeterministic.

### Test commands

```bash
pytest
pytest tests/unit
pytest tests/integration
```

---

# 46. Database Migration Strategy

Use Alembic.

Typical workflow:

```bash
alembic revision --autogenerate -m "create users and documents"
alembic upgrade head
```

Never rely on ad-hoc production database edits.

For Supabase PostgreSQL, migrations should still be treated as version-controlled application infrastructure.

---

# 47. Local Development Architecture

Use Docker Compose for infrastructure.

```text
docker-compose.yml
├── api
├── worker
├── postgres (optional when using local Postgres)
└── redis
```

If using Supabase for PostgreSQL/storage, local Docker can be limited to:

```text
API
Celery Worker
Redis
```

---

# 48. Example `docker-compose.yml` Services

```text
services:
  api:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000

  worker:
    build: .
    command: celery -A app.workers.celery_app worker --loglevel=INFO

  beat:
    build: .
    command: celery -A app.workers.celery_app beat --loglevel=INFO

  redis:
    image: redis:latest
```

PostgreSQL can be added locally when not using Supabase.

---

# 49. Deployment Architecture

Recommended first deployment:

```text
                    Internet
                       │
                       ▼
                     Nginx
                       │
                  ┌────┴────┐
                  ▼         ▼
               FastAPI   WebSocket/SSE
                  │
         ┌────────┴────────┐
         ▼                 ▼
     PostgreSQL          Redis
         │                 │
         │              Celery
         │            ┌────┴────┐
         │            ▼         ▼
         │         AI Worker  Beat
         │
         ▼
     pgvector

   Object Storage ← Uploaded Documents

   External AI Provider ← LLM / Embeddings when configured
```

Scale the worker pool independently from the API when document processing becomes heavy.

---

# 50. Recommended Backend Development Phases

## Phase 1 — Foundation

Implement first:

```text
FastAPI
PostgreSQL/Supabase
SQLAlchemy
Alembic
JWT authentication
User settings
Health endpoints
Docker
```

Deliverable:

```text
Signup/Login + database working
```

## Phase 2 — Documents

Implement:

```text
Upload
Object storage
Metadata
Document CRUD
Trash
Versioning
Processing status
```

Deliverable:

```text
User can upload and manage documents
```

## Phase 3 — Processing

Implement:

```text
PDF parsing
DOCX parsing
TXT parsing
Image OCR
Chunking
Celery
Redis
Embeddings
pgvector
```

Deliverable:

```text
Uploaded documents become searchable
```

## Phase 4 — RAG Chat

Implement:

```text
Vector retrieval
Prompt builder
LLM provider abstraction
Chat sessions
Chat messages
Citations
Retrieval logs
```

Deliverable:

```text
User asks questions and receives document-grounded answers
```

## Phase 5 — Learning AI

Implement:

```text
Flashcards
Spaced repetition
Quizzes
Quiz attempts
Knowledge graph
```

Deliverable:

```text
Document → complete AI learning package
```

## Phase 6 — Productivity

Implement:

```text
Timeline
Study sessions
Analytics
Calendar
Reminders
Notifications
```

## Phase 7 — Hardening

Implement:

```text
Rate limiting
Caching
Structured logging
Monitoring
RAG evaluation
Load testing
Security testing
Backup strategy
```

---

# 51. Recommended First API Milestone

The first complete end-to-end milestone should be:

```text
Register
  ↓
Login
  ↓
Upload PDF
  ↓
Store file
  ↓
Process PDF in worker
  ↓
Create chunks
  ↓
Generate embeddings
  ↓
Store vectors
  ↓
Ask question
  ↓
Retrieve chunks
  ↓
LLM answer
  ↓
Return page/chunk citations
```

Do **not** start by implementing the dashboard, analytics, quiz, calendar, graph, and chat simultaneously. Finish one complete vertical AI flow first.

---

# 52. Recommended Service Dependency Graph

```text
AuthService

DocumentService
 ├── StorageService
 ├── ParserService
 ├── OCRService
 ├── ChunkingService
 └── Queue/Worker

RAGService
 ├── EmbeddingService
 ├── VectorService
 └── LLMService

FlashcardService
 ├── RAG/Context service
 └── LLMService

QuizService
 ├── RAG/Context service
 └── LLMService

GraphService
 ├── Context service
 └── LLMService

AnalyticsService
 ├── TimelineService
 └── StudySession repository

CalendarService
 └── NotificationService
```

---

# 53. Important AI Engineering Rules

### Rule 1 — Retrieval before generation

The LLM should not be used as the document database.

### Rule 2 — Store provenance

Every generated learning object should retain source document/chunk references where possible.

### Rule 3 — Validate model output

LLM output is untrusted text. Validate structured responses with Pydantic.

### Rule 4 — Keep AI provider code isolated

Changing Gemini to OpenAI should require changing a provider implementation, not the complete business layer.

### Rule 5 — Measure RAG quality

A response that sounds correct is not enough. Evaluate retrieval and answer grounding.

### Rule 6 — Background jobs for heavy work

Never process a 200-page PDF synchronously through a normal HTTP request.

### Rule 7 — Protect tenant boundaries

Every vector and relational query must enforce user ownership.

---

# 54. Initial MVP Scope

For the first working release, implement only:

```text
✅ Signup/Login
✅ User profile/settings
✅ PDF/DOCX/TXT upload
✅ Supabase/object storage
✅ Background document processing
✅ Chunking
✅ Embeddings
✅ pgvector
✅ RAG chat
✅ Chat history
✅ Flashcard generation
✅ Basic quiz generation
✅ Trash/restore
✅ Basic dashboard analytics
```

Delay these until the core system works:

```text
⏳ OAuth
⏳ Advanced knowledge graph
⏳ Multi-user document sharing
⏳ Push notifications
⏳ Microservices
⏳ Dedicated vector database
⏳ Advanced RAG reranking
⏳ Complex recommendation engine
```

---

# 55. Definition of Done

The backend MVP is considered complete when all of the following are true:

- User can register and login securely.
- User can upload a supported document.
- File is stored outside the database.
- Document metadata is stored in PostgreSQL.
- Document processing executes through a background worker.
- Extracted content is chunked correctly.
- Chunks have embeddings stored in pgvector.
- User can ask a question about the document.
- Retrieval returns relevant chunks for the user only.
- LLM returns a grounded answer.
- Answer contains usable document citations.
- Chat history is persisted.
- Flashcards can be generated and reviewed.
- Quizzes can be generated and submitted.
- Deleted documents can be restored.
- Dashboard analytics reflect actual activity.
- API validation and authorization are enforced.
- Secrets are stored in environment variables.
- Automated tests cover critical backend logic.
- Logs and health checks are available.

---

# 56. Final Recommended Architecture Decision

For MemoryMind AI, use this stack as the default implementation:

```text
Frontend
  React / existing frontend

Backend
  Python + FastAPI

Database
  PostgreSQL via Supabase

Vector Store
  pgvector inside PostgreSQL

File Storage
  Supabase Storage

Background Processing
  Celery + Redis

Document Processing
  PyMuPDF + python-docx + Pillow + OCR

AI
  Provider abstraction with Gemini/OpenAI implementations

Embeddings
  Sentence Transformers initially or a hosted embedding API

Authentication
  JWT + Argon2id

ORM
  SQLAlchemy 2.x

Migrations
  Alembic

Deployment
  Docker + Nginx

Monitoring
  Structured logs + health endpoints + optional Sentry/metrics
```

This architecture gives MemoryMind AI a clean path from **college-scale MVP → production application → scalable AI platform** without prematurely introducing unnecessary microservices or multiple databases.

---

# 57. Immediate Implementation Order

Implement the backend in this exact sequence:

```text
01. Create FastAPI project
02. Configure environment variables
03. Connect PostgreSQL/Supabase
04. Create SQLAlchemy models
05. Run Alembic migrations
06. Implement JWT authentication
07. Implement user/profile/settings APIs
08. Configure Supabase Storage
09. Implement upload API
10. Implement document CRUD + Trash
11. Add Redis + Celery
12. Implement PDF/DOCX/TXT extraction
13. Add OCR for images/scanned PDFs
14. Implement chunking
15. Implement embedding provider
16. Enable pgvector
17. Store embeddings
18. Implement similarity retrieval
19. Implement LLM provider abstraction
20. Implement RAG chat
21. Store citations/retrieval logs
22. Implement flashcards
23. Implement quiz generation
24. Implement quiz evaluation
25. Implement knowledge graph
26. Implement timeline/study sessions
27. Implement analytics
28. Implement calendar/reminders
29. Add rate limiting/caching
30. Add testing, logging, monitoring, Docker deployment
```

---

# 58. Backend Completion Target

The finished backend should function as an **AI learning operating system**, not simply a CRUD API:

```text
                 MEMORYMIND AI
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     Documents       Learning        Productivity
        │              │              │
        ▼              ▼              ▼
   Parse + OCR      Flashcards      Calendar
        │            Quizzes        Reminders
        ▼              │            Analytics
   Chunk + Embed      ▼
        │          Knowledge Graph
        ▼              │
     pgvector          │
        │              │
        └───────┬──────┘
                ▼
              RAG
                │
                ▼
              LLM
                │
                ▼
        Grounded AI Tutor
```

The most important engineering principle is to make the **document → processing → retrieval → grounded answer** pipeline reliable first. All other AI learning features should build on that foundation rather than duplicating document-processing logic.
