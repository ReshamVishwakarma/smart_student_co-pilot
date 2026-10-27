import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { checkBackendHealth } from '../api/client';

interface HeaderProps {
  onOpenSettings: () => void;
  activeCourse: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, activeCourse }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [backendVersion, setBackendVersion] = useState<string>('');

  const checkHealth = async () => {
    setBackendStatus('checking');
    const result = await checkBackendHealth();
    if (result.ok && result.data) {
      setBackendStatus('connected');
      setBackendVersion(result.data.version || '0.1.0');
    } else {
      setBackendStatus('disconnected');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Smart Student Co-Pilot
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">
                Phase 2 Prototype
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Context-Aware Proactive Multimodal Intelligence
            </p>
          </div>
        </div>

        {/* Middle: Course Context Pill */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-500">Current Context:</span>
          <span className="font-semibold text-slate-800">{activeCourse}</span>
        </div>

        {/* Right: Status Badges & Controls */}
        <div className="flex items-center space-x-3">
          {/* Backend Connection Badge */}
          <button
            onClick={checkHealth}
            title="Click to recheck FastAPI health status"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border"
            style={{
              backgroundColor: backendStatus === 'connected' ? '#f0fdf4' : backendStatus === 'checking' ? '#fefce8' : '#fef2f2',
              borderColor: backendStatus === 'connected' ? '#bbf7d0' : backendStatus === 'checking' ? '#fef08a' : '#fecaca',
              color: backendStatus === 'connected' ? '#166534' : backendStatus === 'checking' ? '#854d0e' : '#991b1b',
            }}
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>
              {backendStatus === 'connected'
                ? `FastAPI: Connected (v${backendVersion})`
                : backendStatus === 'checking'
                ? 'FastAPI: Checking...'
                : 'FastAPI: Standalone Mock'}
            </span>
            <RefreshCw className="w-3 h-3 text-slate-400 hover:text-slate-600" />
          </button>

          {/* Local Privacy Mode Pill */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Local-Only Privacy</span>
          </div>

          {/* Privacy & Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Privacy & Controls</span>
          </button>
        </div>
      </div>
    </header>
  );
};
