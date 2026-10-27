import React from 'react';
import { ProactiveSuggestion } from '../types';
import { Sparkles, HelpCircle, Check, Clock, X, AlertTriangle, Shield } from 'lucide-react';

interface SuggestionsFeedProps {
  suggestions: ProactiveSuggestion[];
  onOpenExplainability: (suggestion: ProactiveSuggestion) => void;
  onAccept: (id: string) => void;
  onSnooze: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const SuggestionsFeed: React.FC<SuggestionsFeedProps> = ({
  suggestions,
  onOpenExplainability,
  onAccept,
  onSnooze,
  onDismiss,
}) => {
  const getPriorityBadge = (priority: ProactiveSuggestion['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const pendingSuggestions = suggestions.filter((s) => s.status === 'pending');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Title & Proactive Engine Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">
            Proactive AI Suggestions
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            ({pendingSuggestions.length} active)
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
            Interruption-Gated
          </span>
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
            Simulated Engine
          </span>
        </div>
      </div>

      {/* Suggestion Cards */}
      {pendingSuggestions.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
          <Shield className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-xs font-semibold text-slate-700">All caught up</h4>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            No pending proactive recommendations. The context engine is monitoring focus state and will surface nudges when cognitive load allows.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {pendingSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="group relative rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-brand-300 hover:shadow-md transition-all p-4 space-y-3"
            >
              {/* Card Header: Category & Priority */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityBadge(
                      suggestion.priority
                    )}`}
                  >
                    {suggestion.priority} priority
                  </span>
                  {!suggestion.isSimulated ? (
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      Python Rule Engine
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                      Simulated
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-medium">
                    Confidence {Math.round(suggestion.confidence * 100)}%
                  </span>
                </div>

                {/* Explainability Trigger Button */}
                <button
                  onClick={() => onOpenExplainability(suggestion)}
                  className="flex items-center space-x-1 text-[11px] font-medium text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-md border border-brand-200 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
                  <span>Why am I seeing this?</span>
                </button>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                  {suggestion.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {suggestion.description}
                </p>
              </div>

              {/* Explainability Preview Pill */}
              <div className="bg-white/80 border border-slate-200/60 rounded-lg p-2.5 text-[11px] text-slate-600 flex items-start space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="line-clamp-2">
                  <strong className="text-slate-700 font-semibold">Trigger:</strong>{' '}
                  {suggestion.explanation.trigger}
                </span>
              </div>

              {/* Action Buttons: Accept / Snooze / Dismiss */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-[10px] text-slate-400">
                  Surface Time: {suggestion.createdAt}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onDismiss(suggestion.id)}
                    className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                  <button
                    onClick={() => onSnooze(suggestion.id)}
                    className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md transition-colors shadow-xs"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Snooze (15m)</span>
                  </button>
                  <button
                    onClick={() => onAccept(suggestion.id)}
                    className="flex items-center space-x-1 px-3 py-1 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-md transition-colors shadow-sm shadow-brand-500/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Action</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
