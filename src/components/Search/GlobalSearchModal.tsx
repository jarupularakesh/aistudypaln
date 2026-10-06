import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, BookOpen, FileText, Calendar, Sparkles, Mic, TrendingUp, CheckSquare, ArrowRight, X, Command } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { courses, materials, notes, deadlines, setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchQuery = query.toLowerCase().trim();

  // Search Results Grouping
  const filteredCourses = courses.filter(c => c.name.toLowerCase().includes(searchQuery) || c.code.toLowerCase().includes(searchQuery));
  const filteredMaterials = materials.filter(m => m.title.toLowerCase().includes(searchQuery) || m.tags.some(t => t.toLowerCase().includes(searchQuery)));
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery) || n.topicName.toLowerCase().includes(searchQuery));
  const filteredDeadlines = deadlines.filter(d => d.title.toLowerCase().includes(searchQuery));

  const quickActions = [
    { label: 'Start Feynman Voice Practice', tab: 'feynman' as const, icon: Mic },
    { label: 'Open Deep Focus Pomodoro Studio', tab: 'focus' as const, icon: Sparkles },
    { label: 'View Learning Analytics & Charts', tab: 'analytics' as const, icon: TrendingUp },
    { label: 'Open Interactive Calendar', tab: 'calendar' as const, icon: Calendar },
    { label: 'Manage Task Execution Pipeline', tab: 'tasks' as const, icon: CheckSquare }
  ].filter(a => a.label.toLowerCase().includes(searchQuery));

  const handleSelect = (action: () => void) => {
    action();
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-start justify-center pt-16 md:pt-24 p-4 transition-all">
      <div className="saas-card w-full max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden rounded-2xl flex flex-col max-h-[80vh]">
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3 bg-slate-50 dark:bg-slate-950">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search courses, notes, tasks, materials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs">
              Clear
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider px-2">
                QUICK ACTIONS
              </div>
              {quickActions.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(() => setActiveTab(act.tab))}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-indigo-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 group transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{act.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Courses */}
          {filteredCourses.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider px-2">
                COURSES ({filteredCourses.length})
              </div>
              {filteredCourses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(() => setActiveTab('materials'))}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="saas-badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-mono">
                      {c.code}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">{c.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">View Materials</span>
                </button>
              ))}
            </div>
          )}

          {/* Master AI Notes */}
          {filteredNotes.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider px-2">
                AI MASTER NOTES ({filteredNotes.length})
              </div>
              {filteredNotes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleSelect(() => setActiveTab('notes'))}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{n.title}</div>
                      <div className="text-[10px] text-slate-400">Topic: {n.topicName}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{n.createdDate}</span>
                </button>
              ))}
            </div>
          )}

          {/* Study Materials */}
          {filteredMaterials.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider px-2">
                STUDY MATERIALS ({filteredMaterials.length})
              </div>
              {filteredMaterials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelect(() => setActiveTab('materials'))}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium text-slate-900 dark:text-white">{m.title}</span>
                  </div>
                  <span className="saas-badge bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px]">
                    {m.type.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Exams & Deadlines */}
          {filteredDeadlines.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider px-2">
                ACADEMIC DEADLINES ({filteredDeadlines.length})
              </div>
              {filteredDeadlines.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelect(() => setActiveTab('planner'))}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    <span className="font-medium text-slate-900 dark:text-white">{d.title}</span>
                  </div>
                  <span className="text-[10px] text-amber-600 font-mono font-semibold">Due: {d.dueDate}</span>
                </button>
              ))}
            </div>
          )}

          {quickActions.length === 0 && filteredCourses.length === 0 && filteredNotes.length === 0 && filteredMaterials.length === 0 && filteredDeadlines.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No results found for "{query}". Try searching for "Dijkstra", "DNA", "CS 301", or "Analytics".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5" /> Use <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">Ctrl</kbd> + <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">K</kbd> anywhere
          </span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
