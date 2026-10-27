# Smart Student Productivity Co-Pilot

> **Project Title:** Context-Aware AI Co-Pilots: Proactive Human Assistance Using Multimodal Intelligence  
> **Final-Year B.Tech CSE Capstone Project** | Demonstration Ready (October 2026)

---

## 1. Project Overview

The **Smart Student Productivity Co-Pilot** is an intelligent assistant designed to transform human-AI interaction from purely reactive (waiting for user prompts) into **proactive, context-aware assistance**. 

The system continuously tracks permitted student context (active coursework, upcoming submission cutoffs, and cognitive focus load), evaluates real-time interruption costs, and proactively surfaces explainable recommendations ("Why am I seeing this?") without disrupting deep work.

---

## 2. System Architecture

The project adheres to a decoupled client-server architecture:

```
                      +------------------------------------------+
                      |             STUDENT DASHBOARD            |
                      |  React 18 + TypeScript + Vite + Tailwind |
                      |     (Accessible at http://localhost:5173) |
                      +--------------------+---------------------+
                                           |
                                           | HTTP REST Client
                                           v
  +--------------------------------------------------------------------------------+
  |                             FASTAPI BACKEND SERVICE                            |
  |                        (Running on http://127.0.0.1:8001)                      |
  |                                                                                |
  |  +------------------------+  +--------------------------+  +----------------+  |
  |  | Health & Diagnostics   |  | Proactive Rule Engine    |  | Context State  |  |
  |  | GET /health            |  | - Task Deadline Evaluator|  | - Focus State  |  |
  |  | GET /api/v1/health     |  | - Interruption Gate      |  | - Window Telemetry|
  |  +------------------------+  +--------------------------+  +----------------+  |
  |                                                                                |
  |  +--------------------------------------------------------------------------+  |
  |  | Automated Pytest Verification Suite (12 unit & integration tests)        |  |
  |  +--------------------------------------------------------------------------+  |
  +--------------------------------------------------------------------------------+
```

---

## 3. Implemented vs. Simulated Features (Transparency Audit)

To maintain academic honesty during engineering defense, all capabilities are explicitly categorized:

| Subsystem | Feature | Status | Details |
| :--- | :--- | :--- | :--- |
| **Backend** | Health & Readiness API | **Genuinely Implemented** | `GET /health` & `GET /api/v1/health` with ISO timestamps & environment config. |
| **Proactive AI** | Deadline Rule Engine | **Genuinely Implemented** | Deterministic Python rule evaluating task urgency against 12h/48h thresholds (`POST /evaluate`, `GET /proactive`). |
| **Testing** | Automated Backend Tests | **Genuinely Implemented** | 12 automated unit and integration tests covering urgent deadlines, distant deadlines, completed tasks, and API contracts. |
| **Frontend** | Student Dashboard UI | **Genuinely Implemented** | Modern, responsive dashboard in React 18, TypeScript, and Tailwind CSS. |
| **Frontend** | API Client & Live Sync | **Genuinely Implemented** | Dynamic frontend API client with live backend health indicator and automatic offline mock fallback. |
| **Explainability** | "Why am I seeing this?" | **Genuinely Implemented** | Interactive 3-pillar modal breaking down trigger signal, focus gate score, and academic rationale. |
| **Privacy** | Consent & Data Governance | **Genuinely Implemented** | Granular toggles for local-only processing, telemetry, and affirmative opt-in with immediate data purge. |
| **Context** | Focus Biometrics & Audio | *Simulated Foundation* | Telemetry (ambient dB, active app) is mocked to demonstrate UI/UX without invasive system surveillance. |
| **Future Memory** | Notes RAG & Whisper Voice | *Roadmap (Phase 3 & 4)* | ChromaDB/FAISS vector retrieval and Whisper voice ingestion reserved for next phase. |

---

## 4. Development Environment & Prerequisites

- **OS:** Windows 11 with Ubuntu 24.04 LTS on WSL (Windows Subsystem for Linux).
- **Python:** 3.12.3 with virtual environment (`venv`).
- **Node.js / npm:** Node v18.19.1+ and npm 9.2.0+.
- **Default Backend Port:** `8001` (selected to avoid collisions with existing local services on port 8000).
- **Default Frontend Port:** `5173`.

---

## 5. Step-by-Step Run Instructions (WSL Ubuntu)

Open two separate Ubuntu WSL terminal tabs.

### Terminal 1: Backend (FastAPI)

```bash
# Navigate to backend directory
cd /home/resham125/smart_student_co-pilot/backend

# Activate the virtual environment
source .venv/bin/activate

# (Optional: install dependencies if not already installed)
pip install -r requirements.txt

# Run backend tests to verify health
pytest

# Start the FastAPI development server on port 8001
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

*Backend endpoints will be live at:*
- Health Check: `http://127.0.0.1:8001/health`
- Interactive Swagger UI: `http://127.0.0.1:8001/docs`
- Proactive Suggestions: `http://127.0.0.1:8001/api/v1/suggestions/proactive`

---

### Terminal 2: Frontend (React + Vite)

```bash
# Navigate to frontend directory
cd /home/resham125/smart_student_co-pilot/frontend

# (Optional: install dependencies if not already installed)
npm install

# Verify TypeScript compilation and production build
npm run build

# Start the Vite development server
npm run dev
```

*Open your browser and navigate to:*  
👉 **`http://localhost:5173`**

---

## 6. Verification and Test Results

### 6.1. Backend Pytest Suite
Run `pytest` inside `backend/`:
```
tests/test_health.py::test_root_health_check PASSED                      [  8%]
tests/test_health.py::test_v1_health_check PASSED                        [ 16%]
tests/test_health.py::test_not_found_endpoint PASSED                     [ 25%]
tests/test_health.py::test_current_context_endpoint PASSED               [ 33%]
tests/test_health.py::test_proactive_suggestions_endpoint PASSED         [ 41%]
tests/test_proactive_engine.py::test_upcoming_deadline_within_urgent_window PASSED [ 50%]
tests/test_proactive_engine.py::test_upcoming_deadline_within_preparation_window PASSED [ 58%]
tests/test_proactive_engine.py::test_distant_deadline_no_suggestion PASSED [ 66%]
tests/test_proactive_engine.py::test_completed_task_no_suggestion PASSED [ 75%]
tests/test_proactive_engine.py::test_overdue_task_suggestion PASSED      [ 83%]
tests/test_proactive_engine.py::test_evaluate_endpoint_api PASSED        [ 91%]
tests/test_proactive_engine.py::test_seed_tasks_endpoint_api PASSED      [100%]

======================== 12 passed, 1 warning in 1.54s =========================
```

### 6.2. Frontend Build Verification
Run `npm run build` inside `frontend/`:
```
vite v5.4.21 building for production...
✓ 1480 modules transformed.
dist/index.html                   0.80 kB │ gzip:  0.49 kB
dist/assets/index-BNhLNbQ0.css   25.28 kB │ gzip:  5.08 kB
dist/assets/index-CAGMueDR.js   198.76 kB │ gzip: 58.98 kB
✓ built in 12.23s
```

---

## 7. Project File Structure

```
smart_student_co-pilot/
├── .env.example                # Safe environment configuration template
├── .gitignore                  # Git exclusions for venv, node_modules, secrets
├── README.md                   # This project guide & run instructions
├── docs/
│   └── architecture.md         # Detailed subsystem architecture & roadmap
├── backend/
│   ├── .venv/                  # Python 3.12 virtual environment
│   ├── pytest.ini              # Pytest configuration
│   ├── requirements.txt        # FastAPI, Uvicorn, Pydantic, Pytest, HTTPX
│   ├── app/
│   │   ├── main.py             # FastAPI entry point, CORS & exception handlers
│   │   ├── core/
│   │   │   └── config.py       # Pydantic BaseSettings environment loader
│   │   ├── schemas/
│   │   │   └── proactive.py    # Pydantic schemas (TaskItem, ProactiveSuggestionItem)
│   │   ├── services/
│   │   │   └── proactive_engine.py  # Deterministic Deadline Rule Engine
│   │   └── api/
│   │       └── v1/
│   │           ├── api.py      # Master API router
│   │           └── endpoints/
│   │               ├── health.py        # /health and /api/v1/health
│   │               ├── context.py       # Current student state
│   │               └── suggestions.py   # /proactive and /evaluate endpoints
│   └── tests/
│       ├── test_health.py              # Health check integration tests
│       └── test_proactive_engine.py    # 7 unit tests for deadline rules
└── frontend/
    ├── package.json            # React 18, Vite 5, Tailwind CSS, Lucide icons
    ├── vite.config.ts          # Vite proxy to backend port 8001
    ├── tsconfig.json           # TypeScript configuration
    └── src/
        ├── api/
        │   └── client.ts       # Typed API client with graceful fallback
        ├── components/
        │   ├── Header.tsx               # Live backend status & privacy indicator
        │   ├── Sidebar.tsx              # Navigation & student profile
        │   ├── ContextStatusPanel.tsx   # Focus mode & interruption gauge
        │   ├── SuggestionsFeed.tsx      # Rule vs Simulated suggestion stream
        │   ├── ExplainabilityModal.tsx  # "Why am I seeing this?" 3 pillars
        │   ├── TasksList.tsx            # Interactive student tasks
        │   ├── ContextTimeline.tsx      # Chronological audit stream
        │   └── PrivacySettingsModal.tsx # Consent controls & data purging
        ├── data/
        │   └── mockData.ts     # Initial demo state
        ├── types/
        │   └── index.ts        # TypeScript data model contracts
        ├── App.tsx             # Root dashboard container & state orchestrator
        └── main.tsx            # React DOM mounting
```

---

## 8. College Presentation Talking Points (Defense Preparation)

1. **Why Proactive instead of Chatbot?**  
   Most student tools require the user to initiate a prompt. In high-stress academic contexts, students often suffer from cognitive overload and forget to plan ahead. This system uses proactive intelligence to surface helpful nudges *before* the student gets stuck or misses a cutoff.

2. **Interruption Cost Model:**  
   Suggestions are not spammy popups. They are gated through an interruption-cost score (0 to 100). When a student is in deep work (cost > 70), recommendations are automatically deferred to an upcoming micro-break.

3. **Explainability ("Why am I seeing this?"):**  
   Every recommendation is backed by 3 transparent pillars: (1) the contextual trigger, (2) the interruption gate check, and (3) the pedagogical rationale.

4. **Privacy-First Architecture:**  
   Strict data minimization and zero background hardware access (microphone/camera) without explicit user consent.
