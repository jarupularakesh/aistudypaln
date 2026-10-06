import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Bell, Sun, Moon, Search, Bot, Calendar, Settings, TrendingUp, LogOut, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlobalSearchModal } from './Search/GlobalSearchModal';

export const Navbar: React.FC = () => {
  const {
    themeMode,
    toggleThemeMode,
    setIsAIChatOpen,
    setActiveTab,
    currentUser,
    setIsAuthModalOpen,
    logout,
    selectedGlobalDate,
    setSelectedGlobalDate
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const [viewDate, setViewDate] = useState<Date>(() => {
    if (selectedGlobalDate) {
      const [y, m] = selectedGlobalDate.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(2026, 7, 1);
  });

  const formatFormattedDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const monthYearHeader = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const paddingDays = Array.from({ length: firstDayOfWeek });
  const daysInMonth = Array.from({ length: totalDaysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return { dayNum, dateStr };
  });

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const notifications = [
    { id: 1, title: 'AI Schedule Re-balanced', time: '10m ago', text: 'Prioritized Graph Algorithms due to CS 301 Midterm in 5 days.' },
    { id: 2, title: 'Feynman Score Evaluated', time: '1h ago', text: 'Achieved 88% comprehension on Dijkstra shortest path.' }
  ];

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
        {/* Left: Brand & Search */}
        <div className="flex items-center space-x-6">
          <div onClick={() => setActiveTab('dashboard')} className="flex items-center space-x-3 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                MindPulse <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">Autonomous Academic Planner</p>
            </div>
          </div>

          {/* Search Bar Button */}
          <div className="relative hidden lg:block w-72">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs rounded-xl pl-9 pr-4 py-2 text-left flex items-center justify-between transition-all cursor-pointer hover:border-indigo-500/50"
            >
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <span>Search workspace...</span>
              <kbd className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>

      {/* Right: Controls & Profile */}
      <div className="flex items-center space-x-3.5">
        {/* Interactive Date Display Pill & Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => {
              setShowDatePicker(!showDatePicker);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm group"
            title="Click to change date or view mini calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">{formatFormattedDate(selectedGlobalDate)}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          </button>

          {showDatePicker && (
            <div className="absolute left-0 top-12 w-72 saas-card p-4 space-y-3 shadow-2xl z-50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono">{monthYearHeader}</h4>
                  <button
                    onClick={() => {
                      const now = new Date();
                      setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
                      setSelectedGlobalDate(todayStr);
                    }}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono"
                  >
                    Today
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-bold text-slate-400 pb-1">
                <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-xs font-mono">
                {paddingDays.map((_, i) => (
                  <div key={`p_${i}`} className="h-7" />
                ))}
                {daysInMonth.map(({ dayNum, dateStr }) => {
                  const isSelected = selectedGlobalDate === dateStr;
                  const isToday = dateStr === todayStr || dateStr === '2026-08-05';
                  return (
                    <button
                      key={dateStr}
                      onClick={() => {
                        setSelectedGlobalDate(dateStr);
                        setShowDatePicker(false);
                      }}
                      className={`h-7 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : isToday
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/30'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowDatePicker(false);
                    setActiveTab('calendar');
                  }}
                  className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline py-1"
                >
                  Open Full Timetable Calendar →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload PDF & AI Quick Actions */}
        <button
          onClick={() => setActiveTab('materials')}
          className="saas-button-secondary flex items-center space-x-1.5 text-xs"
          title="Upload & Summarize PDF Documents"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden md:inline">Upload PDF</span>
        </button>

        <button
          onClick={() => setIsAIChatOpen(true)}
          className="saas-button-primary flex items-center space-x-2 text-xs"
        >
          <Bot className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">AI Quick Actions</span>
        </button>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleThemeMode}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          title="Toggle Theme (Light / Dark)"
        >
          {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              setUnreadCount(0);
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 saas-card p-4 space-y-3 shadow-xl z-50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">Live Sync</span>
              </div>
              <div className="space-y-2 text-xs">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Button & Dropdown */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800">
          {currentUser && currentUser.isLoggedIn ? (
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {currentUser.avatarInitials || 'US'}
              </div>
              <div className="hidden xl:block">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {currentUser.plan || 'Pro Student'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
            >
              <span>Sign In / Register</span>
            </button>
          )}

          {showProfileMenu && currentUser && currentUser.isLoggedIn && (
            <div className="absolute right-0 top-12 w-64 saas-card p-3 space-y-2 shadow-2xl z-50 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.email}
                </div>
                <span className="saas-badge bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] mt-1 inline-block">
                  {currentUser.plan || 'Pro Student Plan'}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-all"
                >
                  <Settings className="w-4 h-4 text-indigo-500" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-all"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Learning Analytics</span>
                </button>

                <button
                  onClick={toggleThemeMode}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-all"
                >
                  {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                  <span>{themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-medium transition-all text-xs"
                >
                  <LogOut className="w-4 h-4 text-indigo-500" />
                  <span>Switch Account / Sign In as Other</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium transition-all text-xs mt-1"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
    <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};





