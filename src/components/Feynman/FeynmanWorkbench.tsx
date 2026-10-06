import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateFeynmanExplanation } from '../../services/aiService';
import type { FeynmanSession, GeneratedNote } from '../../types';
import {
  Mic,
  MicOff,
  Sparkles,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Send,
  Award,
  BookmarkPlus,
  Volume2,
  FileText,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_TOPICS = [
  { id: 'preset_1', name: 'Graph Algorithms & Heuristics', courseId: 'c1', masteryScore: 85 },
  { id: 'preset_2', name: 'Cellular Respiration & ATP Synthesis', courseId: 'c2', masteryScore: 78 },
  { id: 'preset_3', name: 'Macroeconomic Inflation & Interest Rates', courseId: 'c3', masteryScore: 90 },
  { id: 'preset_4', name: 'Organic Chemistry Substitution Reactions', courseId: 'c4', masteryScore: 72 },
  { id: 'preset_5', name: 'Quantum Mechanics Wavefunction Dynamics', courseId: 'c5', masteryScore: 80 }
];

export const FeynmanWorkbench: React.FC = () => {
  const { topics, courses, addFeynmanSession, addNote } = useApp();

  const displayTopics = topics.length > 0 ? topics : PRESET_TOPICS;

  const [selectedTopicId, setSelectedTopicId] = useState<string>(displayTopics[0]?.id || 'preset_1');
  const [customTopicName, setCustomTopicName] = useState<string>('');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textExplanation, setTextExplanation] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micStatusMsg, setMicStatusMsg] = useState<string | null>(null);

  const timerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Audio Context & Recorder refs
  const micStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<any>(null);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [sessionResult, setSessionResult] = useState<FeynmanSession | null>(null);

  const selectedTopicObj = displayTopics.find(t => t.id === selectedTopicId);
  const currentTopicName = selectedTopicId === 'custom'
    ? (customTopicName.trim() || 'Custom Study Topic')
    : (selectedTopicObj?.name || 'Study Topic');
  const currentCourse = courses.find(c => c.id === selectedTopicObj?.courseId) || courses[0];

  // Real-time canvas wave drawing using AudioContext analyser or simulated sine wave fallback
  useEffect(() => {
    if (!isRecording || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          x += sliceWidth;
        }
      } else {
        // Fallback smooth sine wave visualization
        for (let x = 0; x < width; x += 3) {
          const sine = Math.sin(x * 0.05 + step) * Math.cos(x * 0.02 + step * 0.5);
          const y = centerY + sine * (height / 2.8) * Math.min(1, step * 0.1);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        step += 0.12;
      }

      ctx.stroke();
      animFrameRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setMicStatusMsg(null);
    setAudioUrl(null);
    audioChunksRef.current = [];

    // Attempt microphone stream
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        // Set up Web Audio API Analyser for real amplitude wave
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const audioCtx = new AudioCtx();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;
          }
        } catch (e) {
          console.warn('AudioContext setup skipped:', e);
        }

        // Set up MediaRecorder
        try {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (evt) => {
            if (evt.data.size > 0) {
              audioChunksRef.current.push(evt.data);
            }
          };
          recorder.start(200);
          mediaRecorderRef.current = recorder;
        } catch (e) {
          console.warn('MediaRecorder error:', e);
        }
      }
    } catch (err: any) {
      console.warn('Microphone permission or access error:', err);
      setMicStatusMsg('Microphone permission not granted or mic unavailable. Transcribing in simulation mode.');
    }

    setIsRecording(true);
    setRecordingSeconds(0);
    setAudioTranscript('');

    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    // Set up Web Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalTranscript = '';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }
          const text = (finalTranscript + interimTranscript).trim();
          if (text) {
            setAudioTranscript(text);
          }
        };

        recognition.onerror = (evt: any) => {
          console.warn('Speech recognition notice:', evt.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition start error:', e);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Stop Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    // Stop MediaRecorder & create audio URL
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
          }
        };
      } catch (e) {}
    }

    // Stop Mic Tracks
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    // Close AudioContext
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
      analyserRef.current = null;
    }

    // If no transcript was captured during recording, inform the user cleanly without forcing unrelated text
    if (!audioTranscript || audioTranscript.trim().length === 0) {
      setMicStatusMsg('Voice recording complete. You can speak into your mic, type/edit your explanation below, or insert a sample explanation.');
    }
  };

  const insertSampleTranscript = () => {
    setAudioTranscript(
      `To explain ${currentTopicName} simply: the core mechanism centers on understanding its fundamental mechanisms, step-by-step logic, and key application rules without overcomplicating the core principles.`
    );
  };

  const handleEvaluate = async () => {
    const rawInput = inputMode === 'voice' ? audioTranscript : textExplanation;
    if (!rawInput.trim()) return;

    setIsEvaluating(true);
    const report = await evaluateFeynmanExplanation(
      currentTopicName,
      rawInput,
      currentCourse?.name || 'General Studies'
    );

    const fullSession: FeynmanSession = {
      id: 'fs_' + Date.now(),
      topicId: selectedTopicId,
      topicTitle: currentTopicName,
      courseId: currentCourse?.id || 'c1',
      date: new Date().toISOString().split('T')[0],
      explanationType: inputMode,
      rawTranscript: rawInput,
      durationSeconds: recordingSeconds,
      clarityScore: report.clarityScore || 80,
      completenessScore: report.completenessScore || 75,
      accuracyScore: report.accuracyScore || 85,
      overallMastery: report.overallMastery || 80,
      strengths: report.strengths || [],
      missingConcepts: report.missingConcepts || [],
      misconceptions: report.misconceptions || [],
      generatedMasterNote: report.generatedMasterNote || ''
    };

    addFeynmanSession(fullSession);
    setSessionResult(fullSession);
    setIsEvaluating(false);

    try {
      if (fullSession.overallMastery >= 75) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (e) {}
  };

  const handleSaveToMasterNotes = () => {
    if (!sessionResult) return;

    const newNote: GeneratedNote = {
      id: 'gn_' + Date.now(),
      title: `Feynman Master Note: ${sessionResult.topicTitle}`,
      courseId: sessionResult.courseId,
      topicName: sessionResult.topicTitle,
      createdDate: new Date().toISOString().split('T')[0],
      tags: ['Feynman Technique', 'Voice Synthesis', 'Self-Explanation'],
      markdownContent: sessionResult.generatedMasterNote,
      keyTakeaways: sessionResult.strengths,
      relatedMaterialIds: []
    };

    addNote(newNote);
    alert('✅ Saved AI-Generated Master Note to your Notes Library!');
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="saas-badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 mb-2">
          <Brain className="w-3.5 h-3.5" />
          <span>Feynman Technique Method</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Knowledge Input & Concept Evaluator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
          Explain a concept in your own words using <strong>Voice Recording</strong> or <strong>Typed Text</strong>. The AI evaluates your understanding, spots missing nuances, and generates structured master study notes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="saas-card p-5 space-y-4">
            <div className="space-y-3">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block">Select Target Study Topic</label>
              <select
                value={selectedTopicId}
                onChange={(e) => {
                  setSelectedTopicId(e.target.value);
                  setSessionResult(null);
                  setAudioTranscript('');
                  setAudioUrl(null);
                  setMicStatusMsg(null);
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <optgroup label="Academic Study Topics">
                  {displayTopics.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} {'masteryScore' in t ? `(Mastery: ${t.masteryScore}%)` : ''}
                    </option>
                  ))}
                </optgroup>
                <option value="custom">✍️ Custom Topic (Type Below)</option>
              </select>

              {selectedTopicId === 'custom' && (
                <div className="space-y-1 pt-1 animate-fade-in">
                  <label className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Enter Custom Topic Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Molecular Biology, Data Structures, or European History"
                    value={customTopicName}
                    onChange={(e) => setCustomTopicName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-indigo-400 dark:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Input Format:</span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setInputMode('voice')}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    inputMode === 'voice' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice Note</span>
                </button>

                <button
                  onClick={() => setInputMode('text')}
                  className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    inputMode === 'text' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Typed Explanation</span>
                </button>
              </div>
            </div>
          </div>

          {inputMode === 'voice' ? (
            <div className="saas-card p-6 space-y-6 text-center">
              <div className="space-y-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Record Voice Explanation for: <strong className="text-slate-900 dark:text-white">{currentTopicName}</strong>
                </span>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">
                  Imagine teaching this topic to a beginner. Keep it concise, mention constraints & formulas.
                </p>
              </div>

              {micStatusMsg && (
                <div className="p-3 text-xs bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 text-left flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{micStatusMsg}</span>
                </div>
              )}

              <div className="h-24 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={96}
                  className="w-full h-full"
                />
                {!isRecording && (
                  <div className="absolute text-xs text-slate-400">
                    Microphone ready. Click Record below to begin.
                  </div>
                )}
                {isRecording && (
                  <div className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-500 font-mono flex items-center gap-1.5 border border-rose-500/30">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>Listening & Transcribing Live...</span>
                  </div>
                )}
              </div>

              {/* Audio Playback player if available */}
              {audioUrl && !isRecording && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-indigo-500" />
                    <span>Recorded Voice Playback</span>
                  </span>
                  <audio controls src={audioUrl} className="w-full h-8" />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3">
                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-rose-600/30 animate-pulse transition-all"
                  >
                    <MicOff className="w-4 h-4" />
                    <span>Stop Recording ({formatSeconds(recordingSeconds)})</span>
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className="saas-button-primary flex items-center space-x-2 text-xs"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Voice Recording</span>
                  </button>
                )}

                {!isRecording && (
                  <button
                    onClick={insertSampleTranscript}
                    className="py-2.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center space-x-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Use Sample Transcript</span>
                  </button>
                )}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-left space-y-1.5">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Real-time Spoken Transcript</span>
                <textarea
                  rows={4}
                  placeholder="Your spoken words will display here in real-time. You can also edit or refine them manually..."
                  value={audioTranscript}
                  onChange={(e) => setAudioTranscript(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono focus:outline-none border-none resize-y"
                />
              </div>
            </div>
          ) : (
            <div className="saas-card p-6 space-y-4">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Explain your understanding of {currentTopicName} in detail</label>
                <textarea
                  rows={8}
                  placeholder={`Explain ${currentTopicName} in simple terms. Include step-by-step logic, key equations, and common pitfalls...`}
                  value={textExplanation}
                  onChange={(e) => setTextExplanation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-900 dark:text-white focus:outline-none leading-relaxed font-mono"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || (inputMode === 'voice' ? !audioTranscript.trim() : !textExplanation.trim())}
            className="w-full saas-button-primary py-3.5 text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isEvaluating ? (
              <span>AI Analyzing Comprehension & Gaps...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Evaluate Explanation for {currentTopicName}</span>
              </>
            )}
          </button>
        </div>

        {/* Right 5 cols: AI Evaluation & Breakdown Report */}
        <div className="lg:col-span-5 space-y-6">
          {sessionResult ? (
            <div className="saas-card p-6 space-y-6 border-indigo-500/30">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono uppercase font-bold">AI Comprehension Score</span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{sessionResult.topicTitle}</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-indigo-600/30 font-mono">
                  {sessionResult.overallMastery}%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-mono">Clarity</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{sessionResult.clarityScore}%</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-mono">Accuracy</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{sessionResult.accuracyScore}%</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-mono">Completeness</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">{sessionResult.completenessScore}%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Demonstrated Strengths
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {sessionResult.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {sessionResult.missingConcepts.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Missing Nuances & Omissions
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {sessionResult.missingConcepts.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  onClick={handleSaveToMasterNotes}
                  className="w-full saas-button-secondary py-2.5 text-xs flex items-center justify-center space-x-2"
                >
                  <BookmarkPlus className="w-4 h-4 text-indigo-500" />
                  <span>Save AI-Synthesized Master Note</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="saas-card p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Comprehensive Evaluation Ready</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Record your explanation on the left and click Evaluate to generate your mastery score report.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
