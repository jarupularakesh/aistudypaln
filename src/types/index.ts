export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Course {
  id: string;
  name: string;
  code: string; // e.g. CS 301
  color: string; // HEX or Tailwind color
  instructor?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  courseId: string;
  type: 'pdf' | 'slides' | 'notes' | 'audio' | 'link';
  uploadDate: string;
  fileSize?: string;
  pageCount?: number;
  tags: string[];
  summary?: string;
  keyConcepts?: string[];
  formulas?: string[];
  glossary?: { term: string; definition: string }[];
  flashcards?: { question: string; answer: string }[];
  quiz?: { question: string; options: string[]; correctAnswer: number; explanation: string }[];
  contentSnippet?: string;
}

export interface FeynmanSession {
  id: string;
  topicId: string;
  topicTitle: string;
  courseId: string;
  date: string;
  explanationType: 'voice' | 'text';
  rawTranscript: string;
  durationSeconds?: number;
  clarityScore: number; // 0-100
  completenessScore: number; // 0-100
  accuracyScore: number; // 0-100
  overallMastery: number; // 0-100
  strengths: string[];
  missingConcepts: string[];
  misconceptions: string[];
  generatedMasterNote: string;
}

export interface GeneratedNote {
  id: string;
  title: string;
  courseId: string;
  topicName: string;
  createdDate: string;
  tags: string[];
  markdownContent: string;
  keyTakeaways: string[];
  relatedMaterialIds: string[];
}

export interface TopicMastery {
  id: string;
  courseId: string;
  name: string;
  masteryScore: number; // 0 - 100
  lastReviewed: string;
  difficulty: 'easy' | 'medium' | 'hard';
  recommendedStudyHours: number;
  subtopics: { name: string; status: 'mastered' | 'review_needed' | 'weak' }[];
}

export interface AcademicDeadline {
  id: string;
  title: string;
  courseId: string;
  dueDate: string; // YYYY-MM-DD
  type: 'exam' | 'assignment' | 'quiz' | 'project';
  targetGrade?: string;
  weightPercentage?: number;
  estimatedPrepHours: number;
  isCompleted: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  courseId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm 24h
  endTime: string; // HH:mm 24h
  type: 'class' | 'commitment' | 'ai_study' | 'feynman_review' | 'break';
  priority: Priority;
  isCompleted?: boolean;
  topicName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  plan: string;
  isLoggedIn: boolean;
}

export interface UserPreferences {
  dailyStudyGoalHours: number;
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
  breakIntervalMinutes: number;
  enableBurnoutProtection: boolean;
  feynmanTargetMastery: number;
  customApiKey?: string;
}

export interface ActiveTab {
  id:
    | 'dashboard'
    | 'planner'
    | 'calendar'
    | 'tasks'
    | 'feynman'
    | 'analytics'
    | 'notes'
    | 'focus'
    | 'settings'
    | 'materials'
    | 'adaptive';
}


