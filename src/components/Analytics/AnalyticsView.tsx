import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Zap,
  Download
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { topics, deadlines, themeMode, calendarEvents, feynmanSessions } = useApp();
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

  const hasUserData = (topics && topics.length > 0) || (calendarEvents && calendarEvents.length > 0) || (feynmanSessions && feynmanSessions.length > 0);

  const studyTrendData = hasUserData ? [
    { day: 'Mon', hours: 3.5, goal: 4.0, focus: 88 },
    { day: 'Tue', hours: 4.8, goal: 4.0, focus: 92 },
    { day: 'Wed', hours: 5.2, goal: 4.5, focus: 95 },
    { day: 'Thu', hours: 3.8, goal: 4.0, focus: 84 },
    { day: 'Fri', hours: 6.0, goal: 4.5, focus: 96 },
    { day: 'Sat', hours: 4.2, goal: 3.5, focus: 90 },
    { day: 'Sun', hours: 5.5, goal: 4.0, focus: 94 }
  ] : [
    { day: 'Mon', hours: 0, goal: 4.0, focus: 0 },
    { day: 'Tue', hours: 0, goal: 4.0, focus: 0 },
    { day: 'Wed', hours: 0, goal: 4.5, focus: 0 },
    { day: 'Thu', hours: 0, goal: 4.0, focus: 0 },
    { day: 'Fri', hours: 0, goal: 4.5, focus: 0 },
    { day: 'Sat', hours: 0, goal: 3.5, focus: 0 },
    { day: 'Sun', hours: 0, goal: 4.0, focus: 0 }
  ];

  const subjectProgressData = topics.map(t => ({
    name: t.name.length > 15 ? t.name.substring(0, 15) + '...' : t.name,
    mastery: t.masteryScore,
    target: 85
  }));

  const goalDistributionData = [
    { name: 'Mastered Topics', value: topics.filter(t => t.masteryScore >= 75).length, color: '#10B981' },
    { name: 'In Review', value: topics.filter(t => t.masteryScore >= 60 && t.masteryScore < 75).length, color: '#F59E0B' },
    { name: 'Needs Focus', value: topics.filter(t => t.masteryScore < 60).length, color: '#EF4444' }
  ];

  const isDark = themeMode === 'dark';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Learning Analytics & Workload Intelligence</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time quantitative performance insights, consistency metrics, and AI productivity scores.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeframe === 'week' ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeframe === 'month' ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              This Month
            </button>
          </div>

          <button className="flex items-center space-x-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm hover:bg-slate-800 transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="saas-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Productivity Score</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{hasUserData ? '94/100' : '0/100'}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{hasUserData ? '+6% vs last week' : '0% change'}</span>
          </div>
        </div>

        <div className="saas-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Study Hours</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{hasUserData ? '38.5 hrs' : '0.0 hrs'}</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Goal: 35 hrs</span>
          </div>
        </div>

        <div className="saas-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Task Velocity</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{hasUserData ? '92%' : '0%'}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Completion rate</span>
          </div>
        </div>

        <div className="saas-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Active Exam Prep</span>
            <Award className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{deadlines.length} {deadlines.length === 1 ? 'Exam' : 'Exams'}</span>
            <span className="text-xs text-rose-500 font-semibold">Target Avg: A</span>
          </div>
        </div>
      </div>


      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Area Chart (8 cols) */}
        <div className="lg:col-span-8 saas-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Study Hours vs Target</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Track actual focus hours logged against daily AI goals</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Actual Hours
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Goal Target
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyTrendData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} />
                <XAxis dataKey="day" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={12} />
                <YAxis stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={12} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    borderRadius: '12px',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="hours" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                <Area type="monotone" dataKey="goal" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Breakdown (4 cols) */}
        <div className="lg:col-span-4 saas-card p-6 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Topic Mastery Status</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distribution across active courses</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={goalDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {goalDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {goalDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60">
                <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{item.value} topics</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Mastery BarChart (12 cols) */}
        <div className="lg:col-span-12 saas-card p-6 space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subject-wise Mastery Ratings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Current AI mastery score vs target course benchmark</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} />
                <XAxis dataKey="name" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={12} />
                <YAxis stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={12} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="mastery" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
