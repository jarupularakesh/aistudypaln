import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings as SettingsIcon, User, Moon, Sun, Cpu, Shield, Key, Save, Check, LogOut, Mail } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    userPreferences,
    updateUserPreferences,
    themeMode,
    toggleThemeMode,
    currentUser,
    updateUserProfile,
    setIsAuthModalOpen
  } = useApp();

  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [apiKey, setApiKey] = useState(userPreferences.customApiKey || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
      setUserEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserPreferences({ customApiKey: apiKey });
    if (userName.trim() && userEmail.trim()) {
      updateUserProfile({ name: userName.trim(), email: userEmail.trim() });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>System Settings & Account Preferences</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your AI model preferences, study targets, workspace theme, and account credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="saas-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              <span>Student Profile</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="py-1.5 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold text-xs transition-colors flex items-center space-x-1.5 border border-indigo-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Account / Sign In as Other</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {currentUser?.avatarInitials || 'US'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{currentUser?.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser?.email} • {currentUser?.plan || 'Pro Student Plan'}</p>
                <span className="saas-badge bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mt-1">
                  Active Subscription
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User className="w-3 h-3 text-indigo-500" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Mail className="w-3 h-3 text-indigo-500" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>


        {/* Theme & Display Options */}
        <div className="saas-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            {themeMode === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Theme & Workspace Appearance</span>
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">Theme Preference</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Switch between Enterprise Light Mode and Dark Slate Mode</p>
            </div>

            <button
              type="button"
              onClick={toggleThemeMode}
              className="saas-button-secondary text-xs flex items-center space-x-2"
            >
              {themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </button>
          </div>
        </div>

        {/* AI Engine & Intelligence Settings */}
        <div className="saas-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>AI Model Engine & Intelligence</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Preferred AI Tutor Model</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - High Speed)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                <option value="gpt-4o">GPT-4o Integration</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Custom API Key (Optional)</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none pr-8 font-mono"
                />
                <Key className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Burnout & Study Hours Settings */}
        <div className="saas-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Adaptive Study Targets & Burnout Guard</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Daily Study Target</label>
              <select
                value={userPreferences.dailyStudyGoalHours}
                onChange={(e) => updateUserPreferences({ dailyStudyGoalHours: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={3.0}>3.0 Hours / Day</option>
                <option value={4.5}>4.5 Hours / Day (Optimal)</option>
                <option value={6.0}>6.0 Hours / Day (Intense)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Peak Focus Window</label>
              <select
                value={userPreferences.preferredStudyTime}
                onChange={(e) => updateUserPreferences({ preferredStudyTime: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="morning">Morning (09:00 - 12:00)</option>
                <option value="afternoon">Afternoon (13:00 - 17:00)</option>
                <option value="evening">Evening (18:00 - 22:00)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button type="submit" className="saas-button-primary flex items-center space-x-2 text-xs">
            {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Preferences Saved!' : 'Save System Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
