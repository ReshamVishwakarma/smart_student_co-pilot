import React, { useState } from 'react';
import { PrivacySettings } from '../types';
import { Shield, X, Lock, Mic, FileText, Activity, Trash2, Check, AlertTriangle } from 'lucide-react';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrivacySettings;
  onUpdateSettings: (newSettings: PrivacySettings) => void;
  onPurgeData: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onPurgeData,
}) => {
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [showConfirmPurge, setShowConfirmPurge] = useState(false);

  if (!isOpen) return null;

  const toggle = (key: keyof PrivacySettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handlePurge = () => {
    onPurgeData();
    setShowConfirmPurge(false);
    setPurgeSuccess(true);
    setTimeout(() => setPurgeSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Privacy, Consent & Data Governance
              </h3>
              <p className="text-xs text-slate-300">
                Data Minimization, Granular Consent, and User Data Control
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

        {/* Body */}
        <div className="p-6 space-y-5 text-slate-700 text-xs">
          {/* Privacy Principles Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1 text-emerald-900">
            <div className="flex items-center space-x-1.5 font-bold">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>Zero Unauthorized Surveillance Guarantee</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              In accordance with project safety guidelines, no background microphone, camera, or email scrapers run without affirmative user opt-in.
            </p>
          </div>

          {/* Granular Consent Toggles */}
          <div className="space-y-3">
            {/* Toggle 1: Local Only Mode */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-600" />
                  <span>Local-Only Processing</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Keep embeddings and inference confined to local SQLite/mock models without cloud telemetry.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.localOnlyMode}
                onChange={() => toggle('localOnlyMode')}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
              />
            </div>

            {/* Toggle 2: Notes RAG Memory */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Notes RAG Indexing</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Permit indexing course notes for contextual recall and proactive assignment tips.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowNotesRAG}
                onChange={() => toggle('allowNotesRAG')}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
              />
            </div>

            {/* Toggle 3: Voice / Audio Consent (Disabled by default) */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                  <Mic className="w-3.5 h-3.5 text-rose-600" />
                  <span>Voice / Audio Ingestion (Explicit Opt-In)</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Disabled by default. Requires explicit hardware permission before any future Whisper transcription.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowVoiceCapture}
                onChange={() => toggle('allowVoiceCapture')}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
              />
            </div>

            {/* Toggle 4: Activity Telemetry */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="space-y-0.5 pr-4">
                <span className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  <span>Activity & Focus State Telemetry</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Allow calculating cognitive focus load to defer non-essential notifications.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowActivityTelemetry}
                onChange={() => toggle('allowActivityTelemetry')}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
              />
            </div>
          </div>

          {/* User-Controlled Deletion / Purge */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-900 text-xs">User-Controlled Deletion</h5>
            <p className="text-[11px] text-slate-500">
              Permanently scrub all stored context snapshots, timeline events, and suggestion interaction logs.
            </p>

            {purgeSuccess && (
              <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-xs font-semibold">
                <Check className="w-4 h-4" />
                <span>Context data successfully purged from local session.</span>
              </div>
            )}

            {!showConfirmPurge ? (
              <button
                type="button"
                onClick={() => setShowConfirmPurge(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge All Context Data</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                <div className="flex items-center space-x-2 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Are you sure? This cannot be undone.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePurge}
                    className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold hover:bg-rose-700"
                  >
                    Yes, Purge Now
                  </button>
                  <button
                    onClick={() => setShowConfirmPurge(false)}
                    className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
