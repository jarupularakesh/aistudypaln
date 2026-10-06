import React from 'react';
import { useApp } from '../context/AppContext';
import type { ActiveTab } from '../types';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Bot,
  TrendingUp,
  FileText,
  Sparkles,
  Settings,
  FolderKanban,
  BrainCircuit,
  Zap,
  BookOpen
} from 'lucide-react';

interface NavItem {
  id: ActiveTab['id'];
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  description: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, materials, deadlines, topics } = useApp();

  const weakTopicsCount = topics.filter(t => t.masteryScore < 60).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Velocity'
    },
    {
      id: 'planner',
      label: 'Study Planner',
      icon: FolderKanban,
      badge: deadlines.filter(d => !d.isCompleted).length,
      description: 'AI Time-blocking'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      description: 'Schedule & Deadlines'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: '4 Active',
      description: 'Execution Pipeline'
    },
    {
      id: 'feynman',
      label: 'AI Assistant',
      icon: Bot,
      badge: 'Feynman',
      description: 'Voice & Recall Drills'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Performance & Charts'
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      description: 'AI Synthesized Notes'
    },
    {
      id: 'focus',
      label: 'Focus Mode',
      icon: Sparkles,
      description: 'Pomodoro Soundscapes'
    },
    {
      id: 'materials',
      label: 'Materials Library',
      icon: BookOpen,
      badge: materials.length,
      description: 'PDFs & Summaries'
    },
    {
      id: 'adaptive',
      label: 'Learning Matrix',
      icon: BrainCircuit,
      badge: weakTopicsCount ? `${weakTopicsCount} Weak` : undefined,
      description: 'Mastery Knowledge Graph'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Preferences & AI Models'
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between hidden md:flex shrink-0 transition-colors">
      <div className="p-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
          MAIN MENU
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-white border border-indigo-200 dark:border-indigo-800/60 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${isActive ? 'text-indigo-600 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : typeof item.badge === 'string' && item.badge.includes('Weak')
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="saas-card p-3.5 space-y-2 border-indigo-500/20 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              AI Workload Engine
            </span>
            <span className="saas-badge bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Auto-balances study blocks & pomodoro timers based on cognitive load.
          </p>
        </div>
      </div>
    </aside>
  );
};



