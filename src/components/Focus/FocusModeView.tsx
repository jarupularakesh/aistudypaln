import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FocusModeView: React.FC = () => {
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);
  const [selectedSound, setSelectedSound] = useState<'rain' | 'lofi' | 'off'>('rain');
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    setSecondsLeft(sessionMinutes * 60);
  }, [sessionMinutes]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            setCompletedSessions(c => c + 1);
            try { confetti({ particleCount: 80, spread: 70 }); } catch(e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(sessionMinutes * 60);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.round(((sessionMinutes * 60 - secondsLeft) / (sessionMinutes * 60)) * 100);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Deep Focus Studio & Pomodoro Timer</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Distraction-free environment engineered to maximize flow states and cognitive retention.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>{completedSessions} Pomodoros Completed Today</span>
        </div>
      </div>

      {/* Main Focus Card */}
      <div className="saas-card p-8 md:p-12 text-center relative overflow-hidden space-y-8 border-indigo-500/20">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {isActive ? 'FOCUS SESSION IN PROGRESS' : 'READY TO FOCUS'}
          </span>
          <div className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            {formatTime(secondsLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto space-y-1.5">
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-royal to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Progress: {progressPercentage}%</span>
            <span>Target: {sessionMinutes}m</span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="flex items-center space-x-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isActive ? 'Pause Focus' : 'Start Focus Session'}</span>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-indigo-500" />}
          </button>
        </div>

        {/* Duration Selectors */}
        <div className="pt-4 flex items-center justify-center space-x-3 text-xs">
          <span className="text-slate-400 font-medium mr-2">Duration:</span>
          {[25, 45, 60].map(mins => (
            <button
              key={mins}
              onClick={() => {
                setSessionMinutes(mins);
                setIsActive(false);
              }}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                sessionMinutes === mins
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mins} Minutes
            </button>
          ))}
        </div>
      </div>

      {/* Ambient Soundscapes */}
      <div className="saas-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-500" />
          <span>Flow-State Ambient Soundscapes</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <button
            onClick={() => setSelectedSound('rain')}
            className={`p-4 rounded-xl text-left border transition-all ${
              selectedSound === 'rain'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-semibold'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="font-bold mb-1">🌧️ Heavy Rain & Thunder</div>
            <div className="text-[11px] opacity-80">Soft rhythmic rainfall for maximum concentration</div>
          </button>

          <button
            onClick={() => setSelectedSound('lofi')}
            className={`p-4 rounded-xl text-left border transition-all ${
              selectedSound === 'lofi'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-semibold'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="font-bold mb-1">☕ Lofi Study Lounge</div>
            <div className="text-[11px] opacity-80">Gentle tempo chillhop beats without lyrics</div>
          </button>

          <button
            onClick={() => setSelectedSound('off')}
            className={`p-4 rounded-xl text-left border transition-all ${
              selectedSound === 'off'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-semibold'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="font-bold mb-1">🔇 Silent Mode</div>
            <div className="text-[11px] opacity-80">Pure silence for deep reading and calculations</div>
          </button>
        </div>
      </div>
    </div>
  );
};
