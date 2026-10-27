import React from 'react';
import { ContextState } from '../types';
import { Clock, Cpu, Volume2, Monitor, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ContextStatusPanelProps {
  context: ContextState;
  threshold?: number;
}

export const ContextStatusPanel: React.FC<ContextStatusPanelProps> = ({
  context,
  threshold = 70,
}) => {
  const isInterruptionAllowed = context.interruptionScore <= threshold;

  // Interruption score color logic
  const getScoreColor = (score: number) => {
    if (score < 40) return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 border-emerald-200' };
    if (score < 70) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-50 border-amber-200' };
    return { bg: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-50 border-rose-200' };
  };

  const scoreTheme = getScoreColor(context.interruptionScore);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header with Simulated Tag */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-brand-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Real-Time Context Engine Status
          </h2>
        </div>
        <span className="text-[10px] font-semibold tracking-wide bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
          Simulated Telemetry
        </span>
      </div>

      {/* Grid: Current State & Interruption Gate */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Focus State */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Cognitive Mode</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-base font-bold text-slate-900 capitalize">
            {context.currentMode.replace('_', ' ')}
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Active for {context.sessionDurationMinutes} mins</span>
          </div>
        </div>

        {/* Metric 2: Interruption Cost Score */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Interruption Cost</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${scoreTheme.badge} ${scoreTheme.text}`}>
              {context.interruptionScore < 40 ? 'Low Cost' : context.interruptionScore < 70 ? 'Moderate' : 'High Focus'}
            </span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-extrabold text-slate-900">
              {context.interruptionScore}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${scoreTheme.bg}`}
              style={{ width: `${context.interruptionScore}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Interruption Gate Status */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1">
          <div className="text-xs text-slate-500">Interruption Gate</div>
          <div className="flex items-center space-x-1.5 pt-0.5">
            {isInterruptionAllowed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="text-xs font-semibold text-slate-900">
              {isInterruptionAllowed ? 'Suggestions Permitted' : 'Suggestions Deferred'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Score {context.interruptionScore} &le; Threshold {threshold}
          </p>
        </div>

        {/* Metric 4: Ambient / Hardware Context */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1">
          <div className="text-xs text-slate-500">Context Telemetry</div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-800 font-medium truncate">
            <Monitor className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate" title={context.activeWindow}>
              {context.activeWindow}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
            <Volume2 className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{context.ambientNoise}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
