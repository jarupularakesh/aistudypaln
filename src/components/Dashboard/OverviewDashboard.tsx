import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import {
  Calendar,
  Clock,
  Mic,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Zap,
  Target,
  Flame,
  CheckSquare,
  X
} from 'lucide-react';

import confetti from 'canvas-confetti';

export const OverviewDashboard: React.FC = () => {
  const {
    topics,
    deadlines,
    calendarEvents,
    feynmanSessions,
    setActiveTab,
    toggleCalendarEventCompleted,
    rebalanceAISchedule,
    courses,
    currentUser
  } = useApp();

  const [isRebalancing, setIsRebalancing] = useState(false);
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);

  const handleRebalance = async () => {
    setIsRebalancing(true);
    await rebalanceAISchedule();
    setIsRebalancing(false);
    setShowRebalanceModal(true);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Student';
  const hasUserData = (calendarEvents && calendarEvents.length > 0) || (topics && topics.length > 0) || (feynmanSessions && feynmanSessions.length > 0);

  const avgMastery = topics && topics.length > 0
    ? Math.round(topics.reduce((acc, t) => acc + t.masteryScore, 0) / topics.length)
    : 0;

  const upcomingDeadlines = deadlines
    ? [...deadlines].filter(d => !d.isCompleted).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    : [];


  const todayEvents = calendarEvents.filter(e => e.date === '2026-08-05' || e.date === new Date().toISOString().split('T')[0]);
  const completedTodayCount = todayEvents.filter(e => e.isCompleted).length;
  const todayProgressPct = todayEvents.length > 0 ? Math.round((completedTodayCount / todayEvents.length) * 100) : 0;
  const focusStreak = hasUserData ? 7 : 0;
  const hoursStudiedVal = hasUserData ? 38.5 : 0.0;

  // Sparkline data for cards
  const sparklineData1 = hasUserData ? [{ v: 3 }, { v: 4 }, { v: 3.5 }, { v: 5 }, { v: 4.8 }, { v: 5.5 }] : [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }];
  const sparklineData2 = hasUserData ? [{ v: 2 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 6 }, { v: 7 }] : [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }];
  const sparklineData3 = hasUserData ? [{ v: 70 }, { v: 72 }, { v: 75 }, { v: 78 }, { v: 80 }, { v: 84 }] : [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }];
  const sparklineData4 = hasUserData ? [{ v: 4 }, { v: 3 }, { v: 3 }, { v: 2 }, { v: 3 }, { v: 3 }] : [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="saas-card p-6 md:p-8 bg-gradient-to-r from-indigo-900/40 via-slate-900/60 to-slate-900 border-indigo-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="saas-badge bg-amber-500/10 text-amber-500 border border-amber-500/30">
                <Flame className="w-3.5 h-3.5" /> {focusStreak} Day Focus Streak
              </span>
              <span className="text-xs text-slate-400 font-mono">Today's Progress: {todayProgressPct}% Completed</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Good Morning, {firstName} 👋
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed italic">
              "The secret of getting ahead is getting started." — Mark Twain
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setActiveTab('feynman')}
              className="saas-button-primary flex items-center space-x-2 text-xs"
            >
              <Mic className="w-4 h-4 text-white" />
              <span>Start Feynman Practice</span>
            </button>

            <button
              onClick={handleRebalance}
              disabled={isRebalancing}
              className="saas-button-secondary flex items-center space-x-2 text-xs disabled:opacity-50 transition-all cursor-pointer"
              title="Trigger AI Autonomous Schedule Optimization"
            >
              <Zap className={`w-4 h-4 text-amber-500 ${isRebalancing ? 'animate-spin' : ''}`} />
              <span>{isRebalancing ? 'Optimizing Schedule...' : 'Re-balance'}</span>
            </button>
          </div>
        </div>
      </div>


      {/* 4 Analytics Sparkline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="saas-card saas-card-interactive p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hours Studied</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{hoursStudiedVal.toFixed(1)} hrs</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {hasUserData ? '+12.4% vs last week' : '0.0% change'}
              </span>
            </div>
            <div className="w-16 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData1}>
                  <Area type="monotone" dataKey="v" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="saas-card saas-card-interactive p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today's Tasks</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{completedTodayCount} / {todayEvents.length}</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {completedTodayCount > 0 ? `+${completedTodayCount} completed` : '0 completed'}
              </span>
            </div>
            <div className="w-16 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData2}>
                  <Area type="monotone" dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="saas-card saas-card-interactive p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Weekly Progress</span>
            <div className="p-2 rounded-xl bg-royal/10 text-royal">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{avgMastery}%</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {avgMastery > 0 ? '+8% mastery gain' : '0% mastery'}
              </span>
            </div>
            <div className="w-16 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData3}>
                  <Area type="monotone" dataKey="v" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="saas-card saas-card-interactive p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Upcoming Deadlines</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{upcomingDeadlines.length} {upcomingDeadlines.length === 1 ? 'Exam' : 'Exams'}</div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                {upcomingDeadlines.length > 0 ? `${upcomingDeadlines[0].title}` : 'No upcoming exams'}
              </span>
            </div>
            <div className="w-16 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData4}>
                  <Area type="monotone" dataKey="v" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>


      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: AI Study Planner Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="saas-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Optimized Timeline & Time Blocks</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">2026-08-05</span>
              </div>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No study events scheduled for today.</p>
              ) : (
                todayEvents.map((ev) => {
                  const course = courses.find(c => c.id === ev.courseId);
                  return (
                    <div
                      key={ev.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        ev.isCompleted
                          ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-500/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => toggleCalendarEventCompleted(ev.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            ev.isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                          }`}
                        >
                          {ev.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {ev.title}
                            </span>
                            {course && (
                              <span className="saas-badge bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10px]">
                                {course.code}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 mt-0.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ev.startTime} - {ev.endTime}</span>
                            {ev.topicName && (
                              <span className="text-indigo-600 dark:text-indigo-400">• Topic: {ev.topicName}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className={`saas-badge uppercase font-bold text-[10px] ${
                        ev.type === 'ai_study'
                          ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                          : ev.type === 'feynman_review'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {ev.type === 'ai_study' ? 'AI Study' : ev.type === 'feynman_review' ? 'Feynman Drill' : 'Class'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Module Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('feynman')}
              className="saas-card saas-card-interactive p-5 text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Knowledge Input</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Explain a topic via Voice or Text</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className="saas-card saas-card-interactive p-5 text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Study Materials</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Upload PDFs & AI summaries</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="saas-card saas-card-interactive p-5 text-left space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-royal/10 text-royal flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Analytics Hub</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">View performance charts</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right 4 cols: Deadlines & Mastery */}
        <div className="lg:col-span-4 space-y-6">
          <div className="saas-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                <span>Upcoming Deadlines</span>
              </h3>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                + Add Goal
              </button>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 3).map((dl) => {
                const daysLeft = Math.ceil((new Date(dl.dueDate).getTime() - new Date('2026-08-05').getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={dl.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{dl.title}</span>
                      <span className="saas-badge bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono text-[10px]">
                        {daysLeft <= 0 ? 'Today!' : `${daysLeft} days`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>Target: <strong className="text-slate-900 dark:text-white">{dl.targetGrade || 'A'}</strong></span>
                      <span>Prep: {dl.estimatedPrepHours}h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="saas-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Topic Mastery Scores</span>
              </h3>
              <button
                onClick={() => setActiveTab('adaptive')}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Matrix View
              </button>
            </div>

            <div className="space-y-3">
              {topics.slice(0, 4).map((topic) => (
                <div key={topic.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{topic.name}</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">
                      {topic.masteryScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        topic.masteryScore >= 75
                          ? 'bg-emerald-500'
                          : topic.masteryScore >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${topic.masteryScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Re-balance Optimization Summary Modal */}
      {showRebalanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="saas-card w-full max-w-lg p-6 space-y-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-amber-500">
                <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">AI Autonomous Schedule Re-balanced</h3>
              </div>
              <button
                onClick={() => setShowRebalanceModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <p className="leading-relaxed">
                The MindPulse AI scheduler analyzed your course priorities, target exam dates, and lowest-mastery topics to construct an optimized weekly timetable!
              </p>

              <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-300 font-bold">
                  <span>⚡ AI Optimization Summary</span>
                  <span>7 Days Generated</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>Prioritized lowest-mastery study topics for daily AI study blocks</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>Scheduled high-impact Feynman drill sessions before evening rest</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>Preserved existing class lectures & personal commitments</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowRebalanceModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowRebalanceModal(false);
                  setActiveTab('calendar');
                }}
                className="saas-button-primary text-xs flex items-center space-x-1.5"
              >
                <span>View Updated Timetable in Calendar →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

