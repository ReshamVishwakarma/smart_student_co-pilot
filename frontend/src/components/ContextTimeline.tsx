import React from 'react';
import { TimelineEvent } from '../types';
import { History, Zap, ShieldAlert, Cpu, Laptop } from 'lucide-react';

interface ContextTimelineProps {
  events: TimelineEvent[];
}

export const ContextTimeline: React.FC<ContextTimelineProps> = ({ events }) => {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-3.5 h-3.5 text-brand-600" />;
      case 'deferral':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      case 'context':
        return <Cpu className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Laptop className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getEventBadgeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'trigger':
        return 'bg-brand-50 text-brand-700 border-brand-200';
      case 'deferral':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'context':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
            <History className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">
            Context & Interruption Timeline
          </h2>
        </div>
        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
          Chronological Audit Stream
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((event) => (
          <div key={event.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-6 mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-white border border-slate-300 shadow-xs group-hover:scale-110 transition-transform">
              {getEventIcon(event.type)}
            </div>

            {/* Event detail card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 space-y-1 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getEventBadgeColor(
                    event.type
                  )}`}
                >
                  {event.badge}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {event.timestamp}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{event.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
