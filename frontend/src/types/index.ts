export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface StudentTask {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: Priority;
  estimatedMinutes: number;
  completed: boolean;
  tags: string[];
}

export interface SuggestionExplanation {
  trigger: string;
  interruptionCost: string;
  rationale: string;
}

export interface ProactiveSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'academic_deadline' | 'wellness_focus' | 'exam_prep' | 'schedule_optimization';
  priority: Priority;
  confidence: number;
  isSimulated: boolean;
  explanation: SuggestionExplanation;
  status: 'pending' | 'accepted' | 'dismissed' | 'snoozed';
  createdAt: string;
}

export interface ContextState {
  currentMode: 'deep_work' | 'light_study' | 'lecture' | 'break';
  sessionDurationMinutes: number;
  interruptionScore: number; // 0 (free to interrupt) to 100 (do not interrupt)
  isInterruptionAllowed: boolean;
  activeCourse: string;
  upcomingDeadline: string;
  hoursRemaining: number;
  activeWindow: string;
  ambientNoise: string;
  isSimulated: boolean;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'context' | 'trigger' | 'deferral' | 'user_action';
  badge: string;
}

export interface PrivacySettings {
  allowNotesRAG: boolean;
  allowVoiceCapture: boolean;
  allowActivityTelemetry: boolean;
  dataMinimization: boolean;
  localOnlyMode: boolean;
}
