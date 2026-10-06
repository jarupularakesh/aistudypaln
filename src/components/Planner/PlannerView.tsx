import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AcademicDeadline, CalendarEvent } from '../../types';
import {
  Calendar as CalendarIcon,
  Zap,
  Plus,
  Target,
  CheckCircle2,
  Sliders,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PlannerView: React.FC = () => {
  const {
    calendarEvents,
    deadlines,
    courses,
    addDeadline,
    toggleDeadlineCompleted,
    deleteDeadline,
    addCalendarEvent,
    toggleCalendarEventCompleted,
    rebalanceAISchedule,
    userPreferences,
    updateUserPreferences
  } = useApp();

  const [isRebalancing, setIsRebalancing] = useState(false);
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [dTitle, setDTitle] = useState('');
  const [dCourseId, setDCourseId] = useState(courses[0]?.id || 'c1');
  const [dDueDate, setDDueDate] = useState('2026-08-14');
  const [dType] = useState<AcademicDeadline['type']>('exam');
  const [dTargetGrade, setDTargetGrade] = useState('A');
  const [dEstHours, setDEstHours] = useState(10);

  const [eTitle, setETitle] = useState('');
  const [eCourseId] = useState(courses[0]?.id || 'c1');
  const [eDate, setEDate] = useState('2026-08-05');
  const [eStartTime, setEStartTime] = useState('14:00');
  const [eEndTime, setEEndTime] = useState('15:30');
  const [eType, setEType] = useState<CalendarEvent['type']>('ai_study');

  const baseDate = new Date(2026, 7, 5);
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const name = d.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { name, dateStr, fullDate };
  });


  const handleRebalance = async () => {
    setIsRebalancing(true);
    await rebalanceAISchedule();
    setIsRebalancing(false);

    try {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleCreateDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dTitle.trim()) return;

    const newDl: AcademicDeadline = {
      id: 'd_' + Date.now(),
      title: dTitle,
      courseId: dCourseId,
      dueDate: dDueDate,
      type: dType,
      targetGrade: dTargetGrade,
      weightPercentage: 20,
      estimatedPrepHours: dEstHours,
      isCompleted: false
    };

    addDeadline(newDl);
    setIsDeadlineModalOpen(false);
    setDTitle('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: 'ev_' + Date.now(),
      title: eTitle,
      courseId: eCourseId,
      date: eDate,
      startTime: eStartTime,
      endTime: eEndTime,
      type: eType,
      priority: 'high'
    };

    addCalendarEvent(newEv);
    setIsEventModalOpen(false);
    setETitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Personalized AI Study Planner</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Burnout-aware auto-scheduler that aligns daily availability, exam dates & weak topics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsDeadlineModalOpen(true)}
            className="saas-button-secondary flex items-center space-x-1.5 text-xs"
          >
            <Target className="w-3.5 h-3.5 text-amber-500" />
            <span>+ Add Exam / Goal</span>
          </button>

          <button
            onClick={handleRebalance}
            disabled={isRebalancing}
            className="saas-button-primary flex items-center space-x-2 text-xs"
          >
            <Zap className={`w-4 h-4 text-amber-300 ${isRebalancing ? 'animate-spin' : ''}`} />
            <span>{isRebalancing ? 'Optimizing Schedule...' : 'AI Auto-Schedule'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="saas-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Weekly Schedule Grid</span>
                <span className="saas-badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[10px]">
                  Aug 5 - Aug 11, 2026
                </span>
              </div>

              <button
                onClick={() => setIsEventModalOpen(true)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Slot</span>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => {
                const dayEvents = calendarEvents.filter(e => e.date === day.dateStr);
                const isToday = day.dateStr === '2026-08-05';
                return (
                  <div
                    key={day.dateStr}
                    className={`rounded-xl p-2 min-h-[300px] flex flex-col space-y-2 border transition-all ${
                      isToday
                        ? 'bg-indigo-50/50 dark:bg-slate-800/80 border-indigo-500 shadow-xs'
                        : 'bg-slate-50/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className={`text-[10px] font-bold block uppercase ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                        {day.name}
                      </span>
                      <span className={`text-xs font-semibold ${isToday ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {day.fullDate}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      {dayEvents.length === 0 ? (
                        <div className="text-[10px] text-slate-400 text-center pt-6 italic">Rest / Open</div>
                      ) : (
                        dayEvents.map((ev) => {
                          const course = courses.find(c => c.id === ev.courseId);
                          return (
                            <div
                              key={ev.id}
                              onClick={() => toggleCalendarEventCompleted(ev.id)}
                              className={`p-2 rounded-lg text-left cursor-pointer transition-all border ${
                                ev.isCompleted
                                  ? 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-50 line-through text-slate-400'
                                  : ev.type === 'ai_study'
                                  ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                                  : ev.type === 'feynman_review'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                                <span>{ev.startTime}</span>
                                {course && (
                                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                    {course.code}
                                  </span>
                                )}
                              </div>

                              <div className="text-[11px] font-semibold line-clamp-2 mt-0.5">
                                {ev.title}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="saas-card p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>AI Scheduler Preferences & Burnout Protection</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1">Daily Study Target</label>
                <select
                  value={userPreferences.dailyStudyGoalHours}
                  onChange={(e) => updateUserPreferences({ dailyStudyGoalHours: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={3.0}>3.0 Hours / Day</option>
                  <option value={4.5}>4.5 Hours / Day (Recommended)</option>
                  <option value={6.0}>6.0 Hours / Day (Intense)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1">Peak Energy Window</label>
                <select
                  value={userPreferences.preferredStudyTime}
                  onChange={(e) => updateUserPreferences({ preferredStudyTime: e.target.value as any })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="morning">Morning (9:00 - 12:00)</option>
                  <option value="afternoon">Afternoon (13:00 - 17:00)</option>
                  <option value="evening">Evening (18:00 - 22:00)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1">Pomodoro Break</label>
                <select
                  value={userPreferences.breakIntervalMinutes}
                  onChange={(e) => updateUserPreferences({ breakIntervalMinutes: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value={25}>25 Min Focus / 5 Min Break</option>
                  <option value={45}>45 Min Focus / 10 Min Break</option>
                  <option value={60}>60 Min Focus / 15 Min Break</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="saas-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                <span>Academic Deadlines</span>
              </h3>
              <span className="text-xs text-slate-400">{deadlines.length} Active Goals</span>
            </div>

            <div className="space-y-3">
              {deadlines.map((dl) => (
                <div
                  key={dl.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    dl.isCompleted
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleDeadlineCompleted(dl.id)}
                        className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                          dl.isCompleted ? 'bg-emerald-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {dl.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`text-xs font-semibold text-slate-900 dark:text-white ${dl.isCompleted ? 'line-through' : ''}`}>
                        {dl.title}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteDeadline(dl.id)}
                      className="text-slate-400 hover:text-rose-500 text-xs p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
                    <span>Due: <strong className="text-amber-600 dark:text-amber-400">{dl.dueDate}</strong></span>
                    <span>Target: <strong className="text-slate-900 dark:text-white">{dl.targetGrade || 'A'}</strong></span>
                    <span>Prep: {dl.estimatedPrepHours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isDeadlineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="saas-card w-full max-w-md p-6 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add Exam / Assignment Deadline</h3>
              <button onClick={() => setIsDeadlineModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateDeadline} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 301 Final Exam"
                  value={dTitle}
                  onChange={(e) => setDTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Course</label>
                  <select
                    value={dCourseId}
                    onChange={(e) => setDCourseId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  >
                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dDueDate}
                    onChange={(e) => setDDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Target Grade</label>
                  <input
                    type="text"
                    value={dTargetGrade}
                    onChange={(e) => setDTargetGrade(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Est. Prep Hours</label>
                  <input
                    type="number"
                    value={dEstHours}
                    onChange={(e) => setDEstHours(parseInt(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button type="button" onClick={() => setIsDeadlineModalOpen(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                <button type="submit" className="saas-button-primary">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="saas-card w-full max-w-md p-6 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add Custom Schedule Slot</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Focused Graph Algorithms Practice"
                  value={eTitle}
                  onChange={(e) => setETitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Date</label>
                  <input
                    type="date"
                    value={eDate}
                    onChange={(e) => setEDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Type</label>
                  <select
                    value={eType}
                    onChange={(e) => setEType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="ai_study">AI Study Block</option>
                    <option value="feynman_review">Feynman Drill</option>
                    <option value="class">Class Lecture</option>
                    <option value="break">Personal / Break</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={eStartTime}
                    onChange={(e) => setEStartTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">End Time</label>
                  <input
                    type="time"
                    value={eEndTime}
                    onChange={(e) => setEEndTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                <button type="submit" className="saas-button-primary">Add Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

