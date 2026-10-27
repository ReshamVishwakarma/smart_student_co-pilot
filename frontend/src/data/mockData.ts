import { StudentTask, ProactiveSuggestion, ContextState, TimelineEvent, PrivacySettings } from '../types';

export const initialTasks: StudentTask[] = [
  {
    id: 'task-1',
    title: 'Complete Raft Consensus Node Heartbeat RPC',
    course: 'CS401: Distributed Systems',
    dueDate: 'Today, 23:59',
    priority: 'urgent',
    estimatedMinutes: 90,
    completed: false,
    tags: ['Lab 3', 'Go', 'High Weightage'],
  },
  {
    id: 'task-2',
    title: 'Revise Graph Convolutional Networks (GCN) Lecture Notes',
    course: 'CS425: Deep Learning for Vision & Graph',
    dueDate: 'Tomorrow, 14:00',
    priority: 'high',
    estimatedMinutes: 45,
    completed: false,
    tags: ['Quiz Prep', 'Module 4'],
  },
  {
    id: 'task-3',
    title: 'Draft Methodology Section for B.Tech Capstone Report',
    course: 'CS499: Senior Capstone Project',
    dueDate: 'In 3 days',
    priority: 'medium',
    estimatedMinutes: 120,
    completed: false,
    tags: ['Project', 'Documentation'],
  },
  {
    id: 'task-4',
    title: 'Review Peer PR: Memory Leak Fix in Ingestion Pipeline',
    course: 'Open Source Practicum',
    dueDate: 'Tomorrow, 18:00',
    priority: 'low',
    estimatedMinutes: 30,
    completed: true,
    tags: ['Code Review', 'Git'],
  },
];

export const initialSuggestions: ProactiveSuggestion[] = [
  {
    id: 'sug-001',
    title: 'Review Raft Partition Edge Cases Before Submitting',
    description: 'Your CS401 assignment has 9.5 hours left. Analysis of typical grading rubrics indicates network partition tests cause 65% of test failures in Lab 3.',
    category: 'academic_deadline',
    priority: 'urgent',
    confidence: 0.94,
    isSimulated: true,
    explanation: {
      trigger: 'Deadline within 10 hours for CS401 Lab 3 with local uncommitted test modifications.',
      interruptionCost: 'Low (Score: 28/100) — student is between editing blocks and idle for 45s.',
      rationale: 'Proactively offering edge-case test suites reduces last-minute panic and improves lab scores.',
    },
    status: 'pending',
    createdAt: '13:40',
  },
  {
    id: 'sug-002',
    title: 'Scheduled Deep Work Focus Block',
    description: 'You have a 2-hour opening before your 16:00 Machine Learning recitation. Would you like to mute non-essential alerts?',
    category: 'schedule_optimization',
    priority: 'medium',
    confidence: 0.88,
    isSimulated: true,
    explanation: {
      trigger: 'Calendar gap detected between 14:00 and 16:00 without conflicting commitments.',
      interruptionCost: 'Low (Score: 22/100) — natural transition after task completion.',
      rationale: 'Protecting consecutive focus blocks promotes deep work for complex algorithms.',
    },
    status: 'pending',
    createdAt: '13:25',
  },
  {
    id: 'sug-003',
    title: 'Hydration & Posture Micro-Break',
    description: 'Continuous typing detected for 42 minutes with zero screen-off time. Stand up and stretch for 3 minutes.',
    category: 'wellness_focus',
    priority: 'low',
    confidence: 0.81,
    isSimulated: true,
    explanation: {
      trigger: 'Biometric telemetry simulation indicates sustained sedentary state exceeding 40 minutes.',
      interruptionCost: 'Low (Score: 25/100) — non-intrusive micro-toast.',
      rationale: 'Ergonomic micro-breaks mitigate cognitive fatigue in extended programming sessions.',
    },
    status: 'pending',
    createdAt: '13:10',
  },
];

export const initialContextState: ContextState = {
  currentMode: 'deep_work',
  sessionDurationMinutes: 42,
  interruptionScore: 28, // 0 - 100
  isInterruptionAllowed: true,
  activeCourse: 'CS401: Distributed Systems',
  upcomingDeadline: 'Raft Consensus Lab (Due Today 23:59)',
  hoursRemaining: 9.5,
  activeWindow: 'VS Code — raft_node.go',
  ambientNoise: 'Quiet (Simulated 38 dB)',
  isSimulated: true,
};

export const initialTimelineEvents: TimelineEvent[] = [
  {
    id: 'tl-1',
    timestamp: '13:42',
    title: 'Context Engine: Suggestion Dispatched',
    description: 'Interruption score 28 < 70 threshold. Dispatched "Review Raft Partition Edge Cases".',
    type: 'trigger',
    badge: 'Engine Dispatch',
  },
  {
    id: 'tl-2',
    timestamp: '13:30',
    title: 'Interruption Gate: Low Cost Evaluated',
    description: 'IDE idle duration reached 45s; focus penalty decayed to 28/100.',
    type: 'context',
    badge: 'Focus State',
  },
  {
    id: 'tl-3',
    timestamp: '13:00',
    title: 'Session Started: CS401 Lab Work',
    description: 'VS Code active window detected with Go project open.',
    type: 'user_action',
    badge: 'Active Window',
  },
  {
    id: 'tl-4',
    timestamp: '12:45',
    title: 'Low Urgency Reminder Deferred',
    description: 'Club meeting reminder held back because student was in deep work (Interruption Score 84).',
    type: 'deferral',
    badge: 'Deferred Alert',
  },
];

export const defaultPrivacySettings: PrivacySettings = {
  allowNotesRAG: true,
  allowVoiceCapture: false, // Explicit opt-in required
  allowActivityTelemetry: true,
  dataMinimization: true,
  localOnlyMode: true,
};
