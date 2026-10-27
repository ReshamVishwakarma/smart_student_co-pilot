import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  History,
  CheckSquare,
  Shield,
  GraduationCap,
  BellRing,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'suggestions' | 'timeline' | 'tasks' | 'privacy';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingSuggestionsCount: number;
  pendingTasksCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingSuggestionsCount,
  pendingTasksCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Student Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'suggestions' as NavTab,
      label: 'Proactive Feed',
      icon: Sparkles,
      badge: pendingSuggestionsCount > 0 ? `${pendingSuggestionsCount} new` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'tasks' as NavTab,
      label: 'Tasks & Deadlines',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount} due` : null,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: 'timeline' as NavTab,
      label: 'Context Timeline',
      icon: History,
      badge: null,
    },
    {
      id: 'privacy' as NavTab,
      label: 'Privacy & Governance',
      icon: Shield,
      badge: 'Active',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="p-4 space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-brand-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                      item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Co-Pilot Interruption Policy Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800">
            <BellRing className="w-4 h-4 text-brand-600" />
            <span>Interruption Policy</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Suggestions are evaluated against your real-time cognitive focus cost. Alerts are deferred when focus score &gt; 70.
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
            <span>Threshold: 70/100</span>
            <span className="text-emerald-600 font-medium">Status: Active</span>
          </div>
        </div>
      </div>

      {/* Student Profile Card */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700">
            <GraduationCap className="w-5 h-5 text-brand-700" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              Resham Vishwakarma
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              B.Tech CSE — Final Year
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
