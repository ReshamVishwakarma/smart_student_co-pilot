import { ProactiveSuggestion, ContextState } from '../types';

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Check backend operational health from GET /health.
 */
export async function checkBackendHealth(): Promise<{ ok: boolean; data?: HealthResponse; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    const data: HealthResponse = await res.json();
    return { ok: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Connection failed';
    return { ok: false, error: message };
  }
}

/**
 * Fetch real-time student context state from GET /api/v1/context/current.
 */
export async function fetchCurrentContext(): Promise<{ ok: boolean; data?: Partial<ContextState>; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/context/current`);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const raw = await res.json();
    return {
      ok: true,
      data: {
        currentMode: raw.focus_state?.current_mode,
        sessionDurationMinutes: raw.focus_state?.session_duration_minutes,
        interruptionScore: raw.focus_state?.interruption_score,
        isInterruptionAllowed: raw.focus_state?.is_interruption_allowed,
        activeCourse: raw.academic_context?.current_course,
        upcomingDeadline: raw.academic_context?.upcoming_deadline?.title,
        activeWindow: raw.telemetry_context?.active_window,
      },
    };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Fetch proactive AI suggestions from GET /api/v1/suggestions/proactive.
 * Returns genuine rule engine suggestions alongside foundation placeholders.
 */
export async function fetchProactiveSuggestions(): Promise<{ ok: boolean; data?: ProactiveSuggestion[]; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/suggestions/proactive`);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const rawList = await res.json();
    const mapped: ProactiveSuggestion[] = rawList.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category || 'academic_deadline',
      priority: item.priority || 'medium',
      confidence: item.confidence ?? 0.9,
      isSimulated: Boolean(item.is_simulated),
      explanation: {
        trigger: item.explanation?.trigger || 'Context trigger',
        interruptionCost: item.explanation?.interruption_cost || 'Low cost',
        rationale: item.explanation?.rationale || 'Productivity recommendation',
      },
      status: item.status || 'pending',
      createdAt: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    }));
    return { ok: true, data: mapped };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}
