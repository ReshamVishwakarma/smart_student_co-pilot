import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { ContextStatusPanel } from './components/ContextStatusPanel';
import { SuggestionsFeed } from './components/SuggestionsFeed';
import { TasksList } from './components/TasksList';
import { ContextTimeline } from './components/ContextTimeline';
import { ExplainabilityModal } from './components/ExplainabilityModal';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import {
  initialTasks,
  initialSuggestions,
  initialContextState,
  initialTimelineEvents,
  defaultPrivacySettings,
} from './data/mockData';
import { StudentTask, ProactiveSuggestion, ContextState, TimelineEvent, PrivacySettings } from './types';
import { CheckCircle2, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

import { fetchCurrentContext, fetchProactiveSuggestions } from './api/client';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<StudentTask[]>(initialTasks);
  const [suggestions, setSuggestions] = useState<ProactiveSuggestion[]>(initialSuggestions);
  const [context, setContext] = useState<ContextState>(initialContextState);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialTimelineEvents);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modals & Popups
  const [explainableSuggestion, setExplainableSuggestion] = useState<ProactiveSuggestion | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Attempt fetching live data from FastAPI backend on mount
  useEffect(() => {
    const initBackendData = async () => {
      // 1. Fetch live context state
      const ctxResult = await fetchCurrentContext();
      if (ctxResult.ok && ctxResult.data) {
        setContext((prev) => ({
          ...prev,
          ...ctxResult.data,
        }));
      }

      // 2. Fetch live proactive suggestions from Python Rule Engine
      const sugResult = await fetchProactiveSuggestions();
      const liveSuggestions = sugResult.data;
      if (sugResult.ok && liveSuggestions && liveSuggestions.length > 0) {
        setSuggestions(liveSuggestions);
        setTimeline((prev) => [
          {
            id: `init-live-rules-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: 'FastAPI Proactive Rule Engine Synchronized',
            description: `Loaded ${liveSuggestions.length} proactive suggestions evaluated against live student task deadlines.`,
            type: 'trigger',
            badge: 'Rule Engine Sync',
          },
          ...prev,
        ]);
      }
    };

    initBackendData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Task actions
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Suggestion actions
  const handleAcceptSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'accepted' as const } : s))
    );
    const target = suggestions.find((s) => s.id === id);
    if (target) {
      setTimeline((prev) => [
        {
          id: `action-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Action Accepted: ${target.title}`,
          description: `User accepted suggestion with confidence ${Math.round(target.confidence * 100)}%. Feeding reward to policy optimizer.`,
          type: 'user_action',
          badge: 'Feedback Logged',
        },
        ...prev,
      ]);
    }
    showToast('Suggestion accepted! Positive feedback logged for policy learning.');
  };

  const handleSnoozeSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'snoozed' as const } : s))
    );
    showToast('Suggestion snoozed for 15 minutes.');
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'dismissed' as const } : s))
    );
    const target = suggestions.find((s) => s.id === id);
    if (target) {
      setTimeline((prev) => [
        {
          id: `dismiss-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: `Suggestion Dismissed: ${target.title}`,
          description: 'Dismissed by user. Penalty factor applied to similar triggers during focus states.',
          type: 'deferral',
          badge: 'Negative Feedback',
        },
        ...prev,
      ]);
    }
    showToast('Suggestion dismissed. Negative feedback recorded for calibration.');
  };

  const handleExplainabilityFeedback = (_suggestionId: string, isHelpful: boolean) => {
    showToast(
      isHelpful
        ? 'Thank you! Explainability feedback recorded (+1.0 reward).'
        : 'Thank you! Negative utility recorded. We will adjust interruption thresholds.'
    );
  };

  // User-Controlled Purge Data
  const handlePurgeData = () => {
    setTimeline([]);
    setSuggestions([]);
    showToast('All local session context and timeline records have been permanently cleared.');
  };

  const pendingSuggestionsCount = suggestions.filter((s) => s.status === 'pending').length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header */}
      <Header
        onOpenSettings={() => setIsPrivacyModalOpen(true)}
        activeCourse={context.activeCourse}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingSuggestionsCount={pendingSuggestionsCount}
          pendingTasksCount={pendingTasksCount}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center space-x-2 bg-brand-500/20 text-brand-300 border border-brand-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Final-Year B.Tech CSE Capstone Project</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Context-Aware AI Co-Pilot
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Anticipating student productivity needs through multimodal signals, cognitive interruption-cost gating, and transparent explainability.
              </p>
            </div>
          </div>

          {/* Context Status Panel */}
          <ContextStatusPanel context={context} threshold={70} />

          {/* Conditional Layout Based on Tab Selection */}
          {(activeTab === 'dashboard' || activeTab === 'suggestions') && (
            <SuggestionsFeed
              suggestions={suggestions}
              onOpenExplainability={(s) => setExplainableSuggestion(s)}
              onAccept={handleAcceptSuggestion}
              onSnooze={handleSnoozeSuggestion}
              onDismiss={handleDismissSuggestion}
            />
          )}

          {(activeTab === 'dashboard' || activeTab === 'tasks') && (
            <TasksList tasks={tasks} onToggleTask={handleToggleTask} />
          )}

          {(activeTab === 'dashboard' || activeTab === 'timeline') && (
            <ContextTimeline events={timeline} />
          )}

          {activeTab === 'privacy' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-slate-900">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold">Privacy Architecture & Ethical Guardrails</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                This project strictly enforces data minimization and explicit consent. The co-pilot cannot access microphones, cameras, screen content, or external communication accounts without affirmative user approval.
              </p>
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                Configure Privacy & Consent Toggles
              </button>
            </div>
          )}

          {/* Engineering Prototype Notes Card */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-950 flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-indigo-900">
                Phase 1 Prototype Verification Notes
              </h4>
              <p className="text-[11px] text-indigo-800/90 leading-relaxed">
                This foundation demonstrates the UI/UX architecture, sample academic state, and explainability mechanisms. Upcoming Phase 2 will bind the proactive engine to persistent SQLite context models and automated trigger evaluation.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <ExplainabilityModal
        suggestion={explainableSuggestion}
        onClose={() => setExplainableSuggestion(null)}
        onFeedback={handleExplainabilityFeedback}
      />

      <PrivacySettingsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        settings={privacySettings}
        onUpdateSettings={setPrivacySettings}
        onPurgeData={handlePurgeData}
      />
    </div>
  );
};
export default App;
