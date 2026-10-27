# Architecture & Design: Smart Student Productivity Co-Pilot

## 1. Executive Summary

- **Project Title:** Context-Aware AI Co-Pilots: Proactive Human Assistance Using Multimodal Intelligence
- **Prototype:** Smart Student Productivity Co-Pilot
- **Purpose:** An intelligent, context-aware student assistant that proactively anticipates useful actions (e.g., study breaks, deadline reminders, schedule optimization, note synthesis) while respecting student focus states through an interruption-cost scoring model.

---

## 2. System Architecture

The system is decomposed into decoupled, modular subsystems to ensure maintainability, explainability, privacy, and progressive enhancement.

```
                    +------------------------------------------+
                    |             STUDENT DASHBOARD            |
                    | (React 18 + TypeScript + Vite + Tailwind)|
                    +--------------------+---------------------+
                                         |
                                         | HTTP / REST (Future: WebSockets/SSE)
                                         v
+--------------------------------------------------------------------------------+
|                             FASTAPI BACKEND SERVICE                            |
|                                                                                |
|  +------------------------+  +--------------------------+  +----------------+  |
|  | Context Ingestion API  |  | Proactive Engine API     |  | Feedback API   |  |
|  +-----------+------------+  +------------+-------------+  +-------+--------+  |
|              |                            |                        |           |
|              v                            v                        v           |
|  +------------------------+  +--------------------------+  +----------------+  |
|  | Context State Engine   |  | Interruption Scorer      |  | Learning Loop  |  |
|  | - Focus State Detector |  | - Focus Cost Calculator  |  | - Accept/Reject|  |
|  | - Academic Timeline    |  | - Deferral Policy Queue  |  | - Weights Adj. |  |
|  +-----------+------------+  +------------+-------------+  +----------------+  |
|              |                            |                                    |
|              +--------------------+-------+                                    |
|                                   v                                            |
|                      +--------------------------+                              |
|                      | Suggestion & Reason Gen  |                              |
|                      | - Rule-based Heuristics  |                              |
|                      | - Modular LLM / Mock     |                              |
|                      | - Explainability Engine  |                              |
|                      +------------+-------------+                              |
|                                   |                                            |
|                                   v                                            |
|                      +--------------------------+                              |
|                      | Storage & Knowledge Base |                              |
|                      | - SQLite (State & Logs)  |                              |
|                      | - Vector DB (Future RAG) |                              |
|                      +--------------------------+                              |
+--------------------------------------------------------------------------------+
```

---

## 3. Core Subsystems

### 3.1. Context State Engine
- **Responsibility:** Ingests permitted contextual signals (academic schedule, current task, time-to-deadline, idle time, ambient noise level simulation) and maintains a structured user state schema.
- **Data Minimization:** Raw inputs are converted into normalized state features immediately. No unsolicited background recording or unauthorized system surveillance is performed.

### 3.2. Proactive Suggestion & Interruption Scorer
- **Proactive vs. Reactive:** Rather than waiting for explicit student prompts, the engine evaluates background triggers (e.g. deadline within 4 hours and no study session logged).
- **Interruption Scoring:** Computes an interruption cost (0 to 100). If the student is in a detected high-focus state (e.g., score > threshold), low-urgency notifications are automatically deferred to an upcoming break window.
- **Explainability:** Every proactive suggestion is paired with a clear, user-visible justification:
  1. *Context Trigger:* What event/data caused this recommendation?
  2. *Focus Check:* Why was this considered safe to show now?
  3. *Expected Benefit:* How does this action support the student's current goal?

### 3.3. Modular AI Provider Interface
- Supports swappable providers (`MockLLMProvider`, `OpenAIProvider`, `GeminiProvider`).
- Default: `mock` provider ensures full offline functionality without paid API keys or external dependencies during initial development.

### 3.4. Privacy, Consent & Data Governance
- Strict opt-in consent controls for every multimodal input source (voice, notes RAG, telemetry).
- User-controlled data purging with zero data lock-in.
- Clear UI signifiers distinguishing live data from simulated preview data.

---

## 4. Phase Roadmap

- **Phase 1 (Current):** Inspection, foundational architecture, runnable FastAPI backend with health endpoints & tests, responsive React dashboard with mock data and explainability previews, root configuration, and comprehensive documentation.
- **Phase 2:** SQLite state persistence, structured context state schema, rule-based proactive triggers, and interactive feedback handlers.
- **Phase 3:** Interruption scoring model, modular LLM integration (fallback mock + Gemini/OpenAI options), and explainability detail views.
- **Phase 4:** Multimodal ingestion foundations (OCR for notes, audio voice transcription with Whisper), and RAG vector store integration (ChromaDB / FAISS).
- **Phase 5:** Evaluation harness (latency, precision, interruption acceptance rate, user satisfaction metrics) and final documentation.
