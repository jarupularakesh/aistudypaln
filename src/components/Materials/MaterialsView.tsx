import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { StudyMaterial } from '../../types';
import { summarizeMaterialWithAI } from '../../services/aiService';
import { extractTextFromDocumentFile } from '../../utils/pdfExtractor';
import {
  FileText,
  Upload,
  BookOpen,
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Tag,
  Search,
  Eye,
  FileCheck,
  UploadCloud
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MaterialsView: React.FC = () => {
  const { materials, courses, addMaterial, deleteMaterial, selectedCourseFilter } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(materials[0] || null);
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'flashcards' | 'quiz' | 'document'>('summary');
  
  // Upload modal & PDF processing state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || 'c1');
  const [newType, setNewType] = useState<StudyMaterial['type']>('pdf');
  const [newSnippet, setNewSnippet] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('0 MB');
  const [uploadedPageCount, setUploadedPageCount] = useState(1);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Flashcards state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Filtered materials
  const filteredMaterials = materials.filter(m => {
    const matchesCourse = selectedCourseFilter === 'all' || m.courseId === selectedCourseFilter;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCourse && matchesSearch;
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingPdf(true);
    try {
      const extracted = await extractTextFromDocumentFile(file);
      setNewTitle(extracted.title);
      setUploadedFileName(file.name);
      setUploadedFileSize(extracted.fileSize);
      setUploadedPageCount(extracted.pageCount);
      setNewType(extracted.fileType);
      setNewSnippet(extracted.extractedText);
    } catch (err) {
      console.error('Error parsing document:', err);
    } finally {
      setIsParsingPdf(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSummarizing(true);
    const aiResults = await summarizeMaterialWithAI(newTitle, newSnippet);

    const created: StudyMaterial = {
      id: 'm_' + Date.now(),
      title: newTitle,
      courseId: newCourseId,
      type: newType,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: uploadedFileSize || '2.5 MB',
      pageCount: uploadedPageCount || 10,
      tags: ['PDF Upload', 'AI Summarized'],
      contentSnippet: newSnippet || `PDF Document "${newTitle}" parsed and analyzed by MindPulse AI.`,
      ...aiResults
    };

    addMaterial(created);
    setSelectedMaterial(created);
    setActiveSubTab('summary');
    setIsSummarizing(false);
    setIsUploadOpen(false);
    setNewTitle('');
    setNewSnippet('');
    setUploadedFileName('');

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleQuizAnswer = (questionIdx: number, optionIdx: number) => {
    if (submittedQuiz) return;
    setUserAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const calculateQuizScore = () => {
    if (!selectedMaterial?.quiz) return 0;
    let correct = 0;
    selectedMaterial.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correct++;
    });
    return Math.round((correct / selectedMaterial.quiz.length) * 100);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Study Material Library</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload PDFs, lecture slides, and notes. AI auto-extracts summaries, flashcards & quizzes.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="saas-button-primary flex items-center space-x-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Material</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="saas-card p-3 flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
        <input
          type="text"
          placeholder="Search materials by title, keyword, or topic tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Two Panel Layout: List on Left, Document AI Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Material Cards List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {filteredMaterials.length === 0 ? (
            <div className="saas-card p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No materials match your filter.</p>
            </div>
          ) : (
            filteredMaterials.map((mat) => {
              const course = courses.find(c => c.id === mat.courseId);
              const isSelected = selectedMaterial?.id === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => {
                    setSelectedMaterial(mat);
                    setCurrentFlashcardIndex(0);
                    setIsCardFlipped(false);
                    setUserAnswers({});
                    setSubmittedQuiz(false);
                  }}
                  className={`saas-card p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {course && (
                          <span className="saas-badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-mono text-[10px]">
                            {course.code}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{mat.type}</span>
                      </div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {mat.title}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMaterial(mat.id);
                        if (selectedMaterial?.id === mat.id) {
                          setSelectedMaterial(filteredMaterials.find(m => m.id !== mat.id) || null);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Delete Material"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {mat.summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-800/80 mt-3 text-[10px] text-gray-500">
                    <span>{mat.uploadDate}</span>
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-indigo-400" />
                      <span>{mat.tags[0]}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Panel: Detailed AI Material Viewer (8 cols) */}
        <div className="lg:col-span-8">
          {selectedMaterial ? (
            <div className="saas-card overflow-hidden space-y-0">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="saas-badge bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
                      AI INDEXED
                    </span>
                    <span className="text-xs text-slate-400">{selectedMaterial.fileSize} • {selectedMaterial.uploadDate}</span>
                  </div>

                  {/* SubTab Switcher */}
                  <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs">
                    <button
                      onClick={() => setActiveSubTab('summary')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        activeSubTab === 'summary' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Summary</span>
                    </button>

                    <button
                      onClick={() => setActiveSubTab('flashcards')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        activeSubTab === 'flashcards' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Flashcards ({selectedMaterial.flashcards?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => setActiveSubTab('quiz')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        activeSubTab === 'quiz' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> AI Quiz</span>
                    </button>

                    <button
                      onClick={() => setActiveSubTab('document')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        activeSubTab === 'document' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Text Content</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {selectedMaterial.title}
                  </h3>

                  <button
                    onClick={() => {
                      if ('speechSynthesis' in window && selectedMaterial?.summary) {
                        const utterance = new SpeechSynthesisUtterance(selectedMaterial.summary.replace(/[#*•]/g, ''));
                        utterance.rate = 1.0;
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="saas-button-secondary flex items-center space-x-1.5 text-xs"
                    title="Read Summary Out Loud"
                  >
                    <span>🔊 Listen</span>
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6">
                {activeSubTab === 'summary' && (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500" /> AI Executive Summary
                      </h4>
                      <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {selectedMaterial.summary}
                      </div>
                    </div>

                    {selectedMaterial.keyConcepts && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Key Concepts & High-Yield Takeaways
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedMaterial.keyConcepts.map((concept, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-snug">{concept}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMaterial.formulas && selectedMaterial.formulas.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Essential Equations & Formulas
                        </h4>
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-amber-200 dark:border-amber-900/40 space-y-2 font-mono text-xs text-amber-800 dark:text-amber-300">
                          {selectedMaterial.formulas.map((formula, idx) => (
                            <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                              {formula}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMaterial.glossary && selectedMaterial.glossary.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Terminology Glossary
                        </h4>
                        <div className="space-y-2">
                          {selectedMaterial.glossary.map((item, idx) => (
                            <div key={idx} className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-xs">
                              <span className="font-bold text-emerald-400">{item.term}: </span>
                              <span className="text-gray-300">{item.definition}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSubTab === 'flashcards' && (
                  <div className="space-y-6">
                    {selectedMaterial.flashcards && selectedMaterial.flashcards.length > 0 ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Card {currentFlashcardIndex + 1} of {selectedMaterial.flashcards.length}</span>
                          <span>Click card to flip</span>
                        </div>

                        <div
                          onClick={() => setIsCardFlipped(!isCardFlipped)}
                          className="w-full min-h-[220px] p-8 rounded-2xl glass-panel-glow flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:border-cyan-400/60"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-3">
                            {isCardFlipped ? 'ANSWER (BACK)' : 'QUESTION (FRONT)'}
                          </span>

                          <h3 className="text-base md:text-lg font-bold text-white max-w-xl leading-relaxed">
                            {isCardFlipped
                              ? selectedMaterial.flashcards[currentFlashcardIndex].answer
                              : selectedMaterial.flashcards[currentFlashcardIndex].question
                            }
                          </h3>

                          <p className="text-[10px] text-gray-500 mt-6">
                            Tap anywhere to {isCardFlipped ? 'see question' : 'reveal answer'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <button
                            disabled={currentFlashcardIndex === 0}
                            onClick={() => {
                              setCurrentFlashcardIndex(prev => Math.max(0, prev - 1));
                              setIsCardFlipped(false);
                            }}
                            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-xs text-white rounded-xl border border-gray-800"
                          >
                            Previous Card
                          </button>

                          <button
                            disabled={currentFlashcardIndex === selectedMaterial.flashcards.length - 1}
                            onClick={() => {
                              setCurrentFlashcardIndex(prev => Math.min(selectedMaterial.flashcards!.length - 1, prev + 1));
                              setIsCardFlipped(false);
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs text-white rounded-xl font-semibold shadow-md shadow-indigo-600/30"
                          >
                            Next Card →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 py-8 text-center">No flashcards available for this resource.</p>
                    )}
                  </div>
                )}

                {activeSubTab === 'quiz' && (
                  <div className="space-y-6">
                    {selectedMaterial.quiz && selectedMaterial.quiz.length > 0 ? (
                      <div className="space-y-6">
                        {selectedMaterial.quiz.map((q, qIdx) => (
                          <div key={qIdx} className="p-4 bg-gray-900 rounded-2xl border border-gray-800 space-y-3">
                            <h4 className="text-xs font-bold text-white flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px]">
                                {qIdx + 1}
                              </span>
                              <span>{q.question}</span>
                            </h4>

                            <div className="space-y-2">
                              {q.options.map((option, optIdx) => {
                                const isSelected = userAnswers[qIdx] === optIdx;
                                const isCorrect = q.correctAnswer === optIdx;
                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleQuizAnswer(qIdx, optIdx)}
                                    className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between border ${
                                      submittedQuiz
                                        ? isCorrect
                                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-medium'
                                          : isSelected
                                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                          : 'bg-gray-950/60 border-gray-800 text-gray-400'
                                        : isSelected
                                        ? 'bg-indigo-600/30 border-indigo-500 text-white font-medium'
                                        : 'bg-gray-950/60 border-gray-800 text-gray-300 hover:border-gray-700'
                                    }`}
                                  >
                                    <span>{option}</span>
                                    {submittedQuiz && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                    {submittedQuiz && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                                  </button>
                                );
                              })}
                            </div>

                            {submittedQuiz && (
                              <div className="p-3 bg-gray-950 rounded-xl text-[11px] text-gray-300 border border-gray-800">
                                💡 <strong className="text-indigo-400">Explanation:</strong> {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                          {submittedQuiz ? (
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-bold text-white">Score: <strong className="text-cyan-400">{calculateQuizScore()}%</strong></span>
                              <button
                                onClick={() => {
                                  setUserAnswers({});
                                  setSubmittedQuiz(false);
                                }}
                                className="text-xs text-indigo-400 hover:underline"
                              >
                                Retry Quiz
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSubmittedQuiz(true);
                                try {
                                  confetti({ particleCount: 40, spread: 50 });
                                } catch (e) {}
                              }}
                              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20"
                            >
                              Submit Quiz Answers
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 py-8 text-center">No AI quiz questions generated for this document yet.</p>
                    )}
                  </div>
                )}

                {activeSubTab === 'document' && (
                  <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedMaterial.contentSnippet || 'No raw snippet content uploaded.'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
              <BookOpen className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-xs text-gray-400">Select a material from the left panel to inspect AI analysis.</p>
            </div>
          )}
        </div>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="saas-card w-full max-w-lg p-6 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Upload & Summarize PDF / Document</span>
              </h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Drag & Drop File Picker Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 rounded-2xl p-5 text-center cursor-pointer bg-indigo-50/40 dark:bg-slate-800/40 transition-all space-y-2 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.pptx,.ppt,.txt,.md,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {isParsingPdf ? (
                  <div className="py-3 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Extracting PDF text content...</span>
                  </div>
                ) : uploadedFileName ? (
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-indigo-200 dark:border-indigo-700">
                    <div className="flex items-center space-x-3 text-left">
                      <FileCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{uploadedFileName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {uploadedFileSize} • {uploadedPageCount} Pages • {newType.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-1 rounded">
                      Ready for AI
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">Click to select PDF</span> or drag and drop file
                      <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, PPTX, TXT, Markdown, and Word files up to 50MB</p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Material Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 301 Lecture 5: Graph Theory PDF"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Course</label>
                  <select
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.code}: {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="slides">Lecture Slides (PPTX)</option>
                    <option value="notes">Typed Notes</option>
                    <option value="audio">Audio Recording</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-medium block mb-1">Extracted Text Preview / Custom Snippet</label>
                <textarea
                  rows={4}
                  placeholder="PDF text content will automatically extract here upon uploading..."
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSummarizing || isParsingPdf || !newTitle.trim()}
                  className="saas-button-primary flex items-center space-x-2 text-xs disabled:opacity-50"
                >
                  {isSummarizing ? (
                    <span>AI Summarizing PDF...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Upload & Summarize PDF</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
