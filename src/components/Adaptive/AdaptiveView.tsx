import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrainCircuit, Sliders, Zap, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdaptiveView: React.FC = () => {
  const { topics, courses, updateTopicMastery, rebalanceAISchedule, setActiveTab } = useApp();
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id || 't1');

  const currentTopic = topics.find(t => t.id === selectedTopicId) || topics[0];
  const currentCourse = courses.find(c => c.id === currentTopic?.courseId);

  const handleScoreChange = (newScore: number) => {
    if (currentTopic) {
      updateTopicMastery(currentTopic.id, newScore);
    }
  };

  const handleTriggerRebalance = async () => {
    await rebalanceAISchedule();
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Adaptive Learning Matrix & Knowledge Graph</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time mastery tracking across your courses. Adjust confidence ratings to auto-tune your schedule.
          </p>
        </div>

        <button
          onClick={handleTriggerRebalance}
          className="saas-button-primary flex items-center space-x-2 text-xs"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Sync & Re-balance Schedule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Course Topics Mastery Breakdown
          </h3>

          {topics.length === 0 ? (
            <div className="saas-card p-6 text-center space-y-3">
              <p className="text-xs text-slate-400">
                No topics added yet. Upload study materials or complete a Feynman session to build your mastery graph.
              </p>
              <button
                onClick={() => setActiveTab('materials')}
                className="saas-button-primary text-xs mx-auto"
              >
                Upload Study Material
              </button>
            </div>
          ) : (
            topics.map((t) => {
              const course = courses.find(c => c.id === t.courseId);
              const isSelected = selectedTopicId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopicId(t.id)}
                  className={`saas-card p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      {course && (
                        <span className="saas-badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-mono text-[10px]">
                          {course.code}
                        </span>
                      )}
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white leading-snug">
                        {t.name}
                      </h4>
                    </div>

                    <span
                      className={`saas-badge font-mono text-xs font-bold ${
                        t.masteryScore >= 75
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : t.masteryScore >= 60
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {t.masteryScore}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all ${
                        t.masteryScore >= 75 ? 'bg-emerald-500' : t.masteryScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${t.masteryScore}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="lg:col-span-7">
          {currentTopic ? (
            <div className="saas-card p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    {currentCourse && (
                      <span className="saas-badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-mono text-[10px]">
                        {currentCourse.code}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">Last Reviewed: {currentTopic.lastReviewed}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                    {currentTopic.name}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveTab('feynman')}
                  className="saas-button-primary flex items-center space-x-1.5 text-xs"
                >
                  <span>Practice Feynman</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-500" />
                    Self-Assessment Confidence Rating
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {currentTopic.masteryScore}%
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={currentTopic.masteryScore}
                  onChange={(e) => handleScoreChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0% (Unfamiliar)</span>
                  <span>50% (Competent)</span>
                  <span>100% (Mastered)</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Subtopic Knowledge Breakdown
                </h4>
                <div className="space-y-2">
                  {currentTopic.subtopics.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{sub.name}</span>
                      <span
                        className={`saas-badge text-[10px] font-semibold uppercase ${
                          sub.status === 'mastered'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : sub.status === 'review_needed'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {sub.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="saas-card p-12 text-center space-y-3">
              <p className="text-xs text-slate-400">Select a topic from the left or upload materials to view mastery details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
