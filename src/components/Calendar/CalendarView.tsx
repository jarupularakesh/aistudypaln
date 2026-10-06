import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  Trash2,
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CalendarView: React.FC = () => {
  const {
    calendarEvents,
    deadlines,
    courses,
    addCalendarEvent,
    toggleCalendarEventCompleted,
    deleteCalendarEvent,
    rebalanceAISchedule,
    selectedGlobalDate,
    setSelectedGlobalDate
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Current viewed month date state
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (selectedGlobalDate) {
      const [y, m] = selectedGlobalDate.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(2026, 7, 1);
  });

  const selectedDay = selectedGlobalDate || '2026-08-05';
  const setSelectedDay = (date: string) => setSelectedGlobalDate(date);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Form states for adding new event slot
  const [slotTitle, setSlotTitle] = useState('');
  const [slotCourse, setSlotCourse] = useState(courses[0]?.id || '');
  const [slotDate, setSlotDate] = useState('2026-08-05');
  const [slotStartTime, setSlotStartTime] = useState('14:00');
  const [slotEndTime, setSlotEndTime] = useState('15:30');
  const [slotType, setSlotType] = useState<'ai_study' | 'feynman_review' | 'class' | 'commitment' | 'break'>('ai_study');
  const [slotPriority, setSlotPriority] = useState<'high' | 'medium' | 'low' | 'urgent'>('high');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthYearHeader = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleTodayClick = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDay(todayStr);
  };

  // Days calculations
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const paddingDays = Array.from({ length: firstDayOfWeek });
  const daysInMonth = Array.from({ length: totalDaysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return { dayNum, dateStr };
  });

  const handleTriggerRebalance = async () => {
    setIsOptimizing(true);
    await rebalanceAISchedule();
    setIsOptimizing(false);
    try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTitle.trim()) return;

    addCalendarEvent({
      id: 'ev_' + Date.now(),
      title: slotTitle.trim(),
      courseId: slotCourse || undefined,
      date: slotDate || selectedDay,
      startTime: slotStartTime,
      endTime: slotEndTime,
      type: slotType,
      priority: slotPriority
    });

    setIsModalOpen(false);
    setSlotTitle('');
  };

  const openAddModal = (dateStr?: string) => {
    if (dateStr) {
      setSlotDate(dateStr);
    } else {
      setSlotDate(selectedDay);
    }
    setIsModalOpen(true);
  };

  const dayEvents = calendarEvents.filter(e => e.date === selectedDay);
  const dayDeadlines = deadlines.filter(d => d.dueDate === selectedDay);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Interactive Calendar & AI Timetable</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Full monthly & daily study schedule with color-coded exam deadlines and AI time blocking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => openAddModal()}
            className="saas-button-secondary flex items-center space-x-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event Slot</span>
          </button>

          <button
            onClick={handleTriggerRebalance}
            disabled={isOptimizing}
            className="saas-button-primary flex items-center space-x-2 text-xs"
          >
            <Zap className={`w-4 h-4 text-amber-300 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing...' : 'AI Auto-Schedule'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar on Left (8 cols), Selected Day Timeline on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Calendar View (8 cols) */}
        <div className="lg:col-span-8 saas-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{monthYearHeader}</span>
              </h2>
              <button
                onClick={handleTodayClick}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20 hover:bg-indigo-100 transition-colors"
              >
                Today
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevMonth}
                title="Previous Month"
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                title="Next Month"
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-bold text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty padding cells before 1st day of month */}
            {paddingDays.map((_, idx) => (
              <div key={`pad_${idx}`} className="min-h-[85px] bg-slate-50/40 dark:bg-slate-900/20 rounded-xl border border-transparent" />
            ))}

            {daysInMonth.map(({ dayNum, dateStr }) => {
              const isSelected = selectedDay === dateStr;
              const isToday = dateStr === todayStr || dateStr === '2026-08-05';
              const events = calendarEvents.filter(e => e.date === dateStr);
              const dayDeadline = deadlines.find(d => d.dueDate === dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDay(dateStr)}
                  className={`min-h-[85px] p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : isToday
                      ? 'bg-slate-100 dark:bg-slate-800 border-indigo-400'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-indigo-400/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md' : 'text-slate-700 dark:text-slate-300'}`}>
                      {dayNum}
                    </span>
                    {dayDeadline && (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" title={`Deadline: ${dayDeadline.title}`} />
                    )}
                  </div>

                  <div className="space-y-1 mt-1">
                    {events.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] px-1.5 py-0.5 rounded truncate font-medium ${
                          ev.type === 'ai_study'
                            ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                            : ev.type === 'feynman_review'
                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-mono block">+{events.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Timetable Details (4 cols) */}
        <div className="lg:col-span-4 saas-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase">SELECTED DATE TIMETABLE</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono">{selectedDay}</h3>
            </div>
            <button
              onClick={() => openAddModal(selectedDay)}
              className="p-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              title="Add event on this date"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Show Deadlines on Selected Day */}
          {dayDeadlines.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-rose-500 uppercase font-mono">Academic Deadlines</span>
              {dayDeadlines.map((dl) => (
                <div key={dl.id} className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400">{dl.title}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Target Grade: {dl.targetGrade} • Prep Hours: {dl.estimatedPrepHours}h
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Events list */}
          <div className="space-y-3">
            {dayEvents.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-xs text-slate-400 italic">No study blocks scheduled for this date.</p>
                <button
                  onClick={() => openAddModal(selectedDay)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  + Add Event Slot
                </button>
              </div>
            ) : (
              dayEvents.map((ev) => {
                const course = courses.find(c => c.id === ev.courseId);
                return (
                  <div
                    key={ev.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      ev.isCompleted
                        ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleCalendarEventCompleted(ev.id)}
                          className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                            ev.isCompleted ? 'bg-emerald-500 text-white' : 'border border-slate-400 hover:border-indigo-500'
                          }`}
                        >
                          {ev.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{ev.title}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {course && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                            {course.code}
                          </span>
                        )}
                        <button
                          onClick={() => deleteCalendarEvent(ev.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ev.startTime} - {ev.endTime}</span>
                      </div>
                      <span className="saas-badge text-[9px] uppercase">
                        {ev.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="saas-card w-full max-w-md p-6 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-500">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add Schedule Slot</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Traversal Study Session"
                  value={slotTitle}
                  onChange={(e) => setSlotTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Event Type</label>
                  <select
                    value={slotType}
                    onChange={(e) => setSlotType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="ai_study">AI Study Block</option>
                    <option value="feynman_review">Feynman Drill</option>
                    <option value="class">Class Lecture</option>
                    <option value="commitment">Commitment</option>
                    <option value="break">Rest Break</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Start Time</label>
                  <input
                    type="time"
                    value={slotStartTime}
                    onChange={(e) => setSlotStartTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">End Time</label>
                  <input
                    type="time"
                    value={slotEndTime}
                    onChange={(e) => setSlotEndTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {courses.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-semibold">Course Tag</label>
                    <select
                      value={slotCourse}
                      onChange={(e) => setSlotCourse(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="">-- None --</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Priority</label>
                  <select
                    value={slotPriority}
                    onChange={(e) => setSlotPriority(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>


              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button type="submit" className="saas-button-primary">
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
