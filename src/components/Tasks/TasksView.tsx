import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, Plus, Search, Filter, Sparkles, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TaskItem {
  id: string;
  subject: string;
  courseCode: string;
  title: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  deadline: string;
  progress: number;
  durationHours: number;
  aiRecommendation: string;
  isCompleted: boolean;
}

export const TasksView: React.FC = () => {
  const { courses } = useApp();

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      subject: 'Data Structures & Algorithms',
      courseCode: 'CS 301',
      title: 'Implement Dijkstra Priority Queue & Graph Recurrences',
      priority: 'urgent',
      deadline: '2026-08-07',
      progress: 75,
      durationHours: 1.5,
      aiRecommendation: 'Review Min-Heap heapify operations before writing code.',
      isCompleted: false
    },
    {
      id: 'task-[#2]',
      subject: 'Linear Algebra & Vector Spaces',
      courseCode: 'MATH 220',
      title: 'Eigenvalues & Eigenvectors Problem Set 4',
      priority: 'high',
      deadline: '2026-08-08',
      progress: 40,
      durationHours: 2.0,
      aiRecommendation: 'Solve Characteristic Polynomial det(A - λI) = 0 first.',
      isCompleted: false
    },
    {
      id: 'task-3',
      subject: 'Molecular & Cell Biology',
      courseCode: 'BIO 202',
      title: 'Feynman Voice Drill on DNA Polymerase Proofreading',
      priority: 'medium',
      deadline: '2026-08-09',
      progress: 90,
      durationHours: 0.75,
      aiRecommendation: 'Achieve >85% clarity score on 3\' to 5\' exonuclease activity.',
      isCompleted: true
    },
    {
      id: 'task-4',
      subject: 'Macroeconomic Principles',
      courseCode: 'ECON 101',
      title: 'Read Chapter 8: Keynesian Fiscal Multipliers',
      priority: 'low',
      deadline: '2026-08-10',
      progress: 20,
      durationHours: 1.0,
      aiRecommendation: 'Memorize formula Multiplier k = 1 / (1 - MPC).',
      isCompleted: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCourse, setNewTaskCourse] = useState(courses[0]?.code || 'CS 301');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem['priority']>('high');
  const [newTaskDuration, setNewTaskDuration] = useState(1.5);
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-08-12');

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.isCompleted;
        if (nextCompleted) {
          try { confetti({ particleCount: 40, spread: 60 }); } catch (e) {}
        }
        return { ...t, isCompleted: nextCompleted, progress: nextCompleted ? 100 : 50 };
      }
      return t;
    }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const created: TaskItem = {
      id: 'task_' + Date.now(),
      subject: courses.find(c => c.code === newTaskCourse)?.name || 'General Course',
      courseCode: newTaskCourse,
      title: newTaskTitle,
      priority: newTaskPriority,
      deadline: newTaskDeadline,
      progress: 0,
      durationHours: newTaskDuration,
      aiRecommendation: `AI scheduled a ${newTaskDuration}h study block prior to ${newTaskDeadline}.`,
      isCompleted: false
    };

    setTasks(prev => [created, ...prev]);
    setIsModalOpen(false);
    setNewTaskTitle('');
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Task Manager & Execution Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent task tracking with progress meters, priority badges, and AI optimization tips.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="saas-button-primary flex items-center space-x-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="saas-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Search tasks by title, subject, or course code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="saas-card p-12 text-center space-y-2">
            <CheckSquare className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">No tasks match your search filter.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`saas-card p-5 space-y-4 transition-all ${
                task.isCompleted ? 'opacity-60 bg-slate-50 dark:bg-slate-900/50' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <button
                    onClick={() => toggleTaskCompleted(task.id)}
                    className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-all ${
                      task.isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                    }`}
                  >
                    {task.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                      <span className="saas-badge bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {task.courseCode}
                      </span>

                      <span className={`saas-badge uppercase font-bold text-[10px] ${
                        task.priority === 'urgent'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : task.priority === 'high'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {task.priority}
                      </span>

                      <span className="text-xs text-slate-400 font-medium">
                        {task.subject}
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold text-slate-900 dark:text-white ${task.isCompleted ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 shrink-0 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {task.durationHours}h est
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Due: {task.deadline}
                  </span>
                </div>
              </div>

              {/* Progress Bar & AI Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="md:col-span-5 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Task Completion Progress</span>
                    <span className="font-bold text-slate-900 dark:text-white">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                <div className="md:col-span-7 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate"><strong>AI Tip:</strong> {task.aiRecommendation}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="saas-card w-full max-w-md p-6 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Create New Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Problem Set #3"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Course</label>
                  <select
                    value={newTaskCourse}
                    onChange={(e) => setNewTaskCourse(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  >
                    {courses.map(c => <option key={c.id} value={c.code}>{c.code}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                <button type="submit" className="saas-button-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
