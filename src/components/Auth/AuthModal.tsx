import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRESET_USERS } from '../../services/mockData';
import { Mail, User as UserIcon, Lock, Sparkles, X, Check, ArrowRight, UserCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, currentUser, login } = useApp();

  const [activeTab, setActiveTab] = useState<'email' | 'demo'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!emailInput.includes('@') || !emailInput.includes('.')) {
      setErrorMsg('Please enter a valid email ID (e.g. student@university.edu).');
      return;
    }

    login(emailInput.trim(), nameInput.trim() || undefined);
    setErrorMsg('');
    setEmailInput('');
    setNameInput('');
    setPasswordInput('');
    setIsAuthModalOpen(false);
  };

  const handleSelectPreset = (email: string, name: string) => {
    login(email, name);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all transform duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>MindPulse AI Access</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {currentUser?.isLoggedIn ? 'Switch Account or Sign In' : 'Sign In to MindPulse AI'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access personalized study material, Feynman sessions, and AI schedule optimization.
          </p>

          {/* Mode Tabs */}
          <div className="flex space-x-2 mt-4 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <button
              onClick={() => { setActiveTab('email'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'email'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In with Email
            </button>
            <button
              onClick={() => { setActiveTab('demo'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'demo'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Quick Demo Accounts
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {activeTab === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {errorMsg && (
                <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="student@university.edu"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Full Name <span className="text-[10px] text-slate-400 font-normal">(Optional)</span></span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Chen"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Password / PIN <span className="text-[10px] text-slate-400 font-normal">(Optional for demo)</span></span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all"
              >
                <span>Continue / Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select an existing student profile to switch accounts instantly:
              </p>
              
              <div className="space-y-2">
                {PRESET_USERS.map((preset) => {
                  const isCurrent = currentUser?.email.toLowerCase() === preset.email.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.email, preset.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-indigo-500/10 border-indigo-500/40 text-slate-900 dark:text-white ring-1 ring-indigo-500/50'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-indigo-500/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                          {preset.avatarInitials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{preset.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 font-mono">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {preset.email}
                          </div>
                        </div>
                      </div>

                      {isCurrent ? (
                        <Check className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-slate-400 opacity-0 hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
