import React from 'react';
import { ProactiveSuggestion } from '../types';
import { X, HelpCircle, Zap, ShieldCheck, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ExplainabilityModalProps {
  suggestion: ProactiveSuggestion | null;
  onClose: () => void;
  onFeedback: (suggestionId: string, isHelpful: boolean) => void;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  suggestion,
  onClose,
  onFeedback,
}) => {
  if (!suggestion) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-brand-500/20 rounded-lg border border-brand-400/30">
              <HelpCircle className="w-5 h-5 text-brand-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Why am I seeing this?</h3>
              <p className="text-xs text-slate-300">
                Transparent AI Explainability & Context Provenance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-slate-700 text-xs">
          {/* Suggestion Subject */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Evaluating Suggestion
            </span>
            <h4 className="text-sm font-bold text-slate-900">{suggestion.title}</h4>
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200">
                Confidence: {Math.round(suggestion.confidence * 100)}%
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Rule & Heuristic Engine (Phase 1)
              </span>
            </div>
          </div>

          {/* Explainability Breakdown (3 Pillars) */}
          <div className="space-y-3.5">
            {/* Pillar 1: Context Trigger */}
            <div className="flex items-start space-x-3">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h5 className="font-bold text-slate-900 text-xs">1. Context Trigger</h5>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {suggestion.explanation.trigger}
                </p>
              </div>
            </div>

            {/* Pillar 2: Interruption Cost Evaluation */}
            <div className="flex items-start space-x-3">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h5 className="font-bold text-slate-900 text-xs">2. Interruption Cost Gate</h5>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {suggestion.explanation.interruptionCost}
                </p>
              </div>
            </div>

            {/* Pillar 3: Pedagogical & Cognitive Rationale */}
            <div className="flex items-start space-x-3">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h5 className="font-bold text-slate-900 text-xs">3. Expected Value / Rationale</h5>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {suggestion.explanation.rationale}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Section for Learning Loop */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Was this suggestion timely?</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onFeedback(suggestion.id, true);
                  onClose();
                }}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors text-xs font-semibold"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful</span>
              </button>
              <button
                onClick={() => {
                  onFeedback(suggestion.id, false);
                  onClose();
                }}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors text-xs font-semibold"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Too Disruptive</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
