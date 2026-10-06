import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Course,
  StudyMaterial,
  FeynmanSession,
  GeneratedNote,
  TopicMastery,
  AcademicDeadline,
  CalendarEvent,
  UserPreferences,
  ActiveTab,
  User
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_MATERIALS,
  INITIAL_FEYNMAN_SESSIONS,
  INITIAL_NOTES,
  INITIAL_TOPICS,
  INITIAL_DEADLINES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_USER_PREFERENCES,
  INITIAL_USER,
  PRESET_USERS
} from '../services/mockData';
import { generateOptimizedSchedule } from '../services/aiService';

interface AppContextType {
  activeTab: ActiveTab['id'];
  setActiveTab: (tab: ActiveTab['id']) => void;

  currentUser: User;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => void;

  courses: Course[];
  materials: StudyMaterial[];
  feynmanSessions: FeynmanSession[];
  notes: GeneratedNote[];
  topics: TopicMastery[];
  deadlines: AcademicDeadline[];
  calendarEvents: CalendarEvent[];
  userPreferences: UserPreferences;

  // Actions
  addMaterial: (material: StudyMaterial) => void;
  deleteMaterial: (id: string) => void;
  updateMaterial: (material: StudyMaterial) => void;

  addFeynmanSession: (session: FeynmanSession) => void;
  
  addNote: (note: GeneratedNote) => void;
  deleteNote: (id: string) => void;

  updateTopicMastery: (topicId: string, newScore: number) => void;

  addDeadline: (deadline: AcademicDeadline) => void;
  toggleDeadlineCompleted: (id: string) => void;
  deleteDeadline: (id: string) => void;

  addCalendarEvent: (event: CalendarEvent) => void;
  toggleCalendarEventCompleted: (id: string) => void;
  deleteCalendarEvent: (id: string) => void;

  rebalanceAISchedule: () => Promise<void>;
  updateUserPreferences: (prefs: Partial<UserPreferences>) => void;

  selectedCourseFilter: string;
  setSelectedCourseFilter: (courseId: string) => void;

  selectedGlobalDate: string;
  setSelectedGlobalDate: (date: string) => void;
  
  // Floating AI Chat
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;

  // Theme state
  themeMode: 'light' | 'dark';
  toggleThemeMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'mindpulse_ai_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab['id']>('dashboard');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedGlobalDate, setSelectedGlobalDate] = useState<string>('2026-08-05');

  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(currentUser));
  }, [currentUser]);

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'theme');
    return (saved as 'light' | 'dark') || 'dark';
  });


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDemoUser = (id: string) => id.startsWith('usr_demo_');

  const loadUserData = (userId: string, key: string, defaultDemoVal: any) => {
    const userKey = STORAGE_KEY_PREFIX + userId + '_' + key;
    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing localStorage for', userKey, e);
      }
    }
    return isDemoUser(userId) ? defaultDemoVal : (Array.isArray(defaultDemoVal) ? [] : defaultDemoVal);
  };

  const [courses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => 
    loadUserData(currentUser.id, 'materials', INITIAL_MATERIALS)
  );

  const [feynmanSessions, setFeynmanSessions] = useState<FeynmanSession[]>(() => 
    loadUserData(currentUser.id, 'feynman', INITIAL_FEYNMAN_SESSIONS)
  );

  const [notes, setNotes] = useState<GeneratedNote[]>(() => 
    loadUserData(currentUser.id, 'notes', INITIAL_NOTES)
  );

  const [topics, setTopics] = useState<TopicMastery[]>(() => 
    loadUserData(currentUser.id, 'topics', INITIAL_TOPICS)
  );

  const [deadlines, setDeadlines] = useState<AcademicDeadline[]>(() => 
    loadUserData(currentUser.id, 'deadlines', INITIAL_DEADLINES)
  );

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => 
    loadUserData(currentUser.id, 'calendar', INITIAL_CALENDAR_EVENTS)
  );

  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => 
    loadUserData(currentUser.id, 'prefs', INITIAL_USER_PREFERENCES)
  );

  // Sync state whenever active user changes
  useEffect(() => {
    setMaterials(loadUserData(currentUser.id, 'materials', INITIAL_MATERIALS));
    setFeynmanSessions(loadUserData(currentUser.id, 'feynman', INITIAL_FEYNMAN_SESSIONS));
    setNotes(loadUserData(currentUser.id, 'notes', INITIAL_NOTES));
    setTopics(loadUserData(currentUser.id, 'topics', INITIAL_TOPICS));
    setDeadlines(loadUserData(currentUser.id, 'deadlines', INITIAL_DEADLINES));
    setCalendarEvents(loadUserData(currentUser.id, 'calendar', INITIAL_CALENDAR_EVENTS));
    setUserPreferences(loadUserData(currentUser.id, 'prefs', INITIAL_USER_PREFERENCES));
  }, [currentUser.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + currentUser.id + '_materials', JSON.stringify(materials));
  }, [materials, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + currentUser.id + '_feynman', JSON.stringify(feynmanSessions));
  }, [feynmanSessions, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + currentUser.id + '_notes', JSON.stringify(notes));
  }, [notes, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + currentUser.id + '_topics', JSON.stringify(topics));
  }, [topics, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + currentUser.id + '_deadlines', JSON.stringify(deadlines));
  }, [deadlines, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + currentUser.id + '_calendar', JSON.stringify(calendarEvents));
  }, [calendarEvents, currentUser.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + currentUser.id + '_prefs', JSON.stringify(userPreferences));
  }, [userPreferences, currentUser.id]);


  const addMaterial = (newMat: StudyMaterial) => {
    setMaterials(prev => [newMat, ...prev]);
  };

  const deleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const updateMaterial = (updated: StudyMaterial) => {
    setMaterials(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const addFeynmanSession = (session: FeynmanSession) => {
    setFeynmanSessions(prev => [session, ...prev]);
    updateTopicMastery(session.topicId, session.overallMastery);
  };

  const addNote = (note: GeneratedNote) => {
    setNotes(prev => [note, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const updateTopicMastery = (topicId: string, newScore: number) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId || t.name.toLowerCase().includes(topicId.toLowerCase())) {
        return {
          ...t,
          masteryScore: newScore,
          lastReviewed: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    }));
  };

  const addDeadline = (deadline: AcademicDeadline) => {
    setDeadlines(prev => [...prev, deadline]);
  };

  const toggleDeadlineCompleted = (id: string) => {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, isCompleted: !d.isCompleted } : d));
  };

  const deleteDeadline = (id: string) => {
    setDeadlines(prev => prev.filter(d => d.id !== id));
  };

  const addCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, event]);
  };

  const toggleCalendarEventCompleted = (id: string) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e));
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  const rebalanceAISchedule = async () => {
    const generatedEvents = await generateOptimizedSchedule(topics, deadlines, userPreferences, selectedGlobalDate);
    setCalendarEvents(prev => {
      const fixedEvents = prev.filter(e => e.type === 'class' || e.type === 'commitment');
      return [...fixedEvents, ...generatedEvents];
    });
  };


  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0].length > 0) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  const login = (email: string, name?: string) => {
    const preset = PRESET_USERS.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (preset) {
      setCurrentUser({ ...preset, isLoggedIn: true });
    } else {
      const formattedName = name && name.trim() ? name.trim() : email.split('@')[0];
      const initials = getInitials(formattedName);
      setCurrentUser({
        id: 'usr_' + Date.now(),
        name: formattedName,
        email: email.trim(),
        avatarInitials: initials,
        plan: 'Pro Student Plan',
        isLoggedIn: true
      });
    }
  };

  const logout = () => {
    setCurrentUser(prev => ({ ...prev, isLoggedIn: false }));
    setIsAuthModalOpen(true);
  };

  const updateUserProfile = (profile: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...profile };
      if (profile.name) {
        updated.avatarInitials = getInitials(profile.name);
      }
      return updated;
    });
  };

  const updateUserPreferences = (prefs: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...prefs }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        updateUserProfile,
        courses,
        materials,
        feynmanSessions,
        notes,
        topics,
        deadlines,
        calendarEvents,
        userPreferences,
        addMaterial,
        deleteMaterial,
        updateMaterial,
        addFeynmanSession,
        addNote,
        deleteNote,
        updateTopicMastery,
        addDeadline,
        toggleDeadlineCompleted,
        deleteDeadline,
        addCalendarEvent,
        toggleCalendarEventCompleted,
        deleteCalendarEvent,
        rebalanceAISchedule,
        updateUserPreferences,
        selectedCourseFilter,
        setSelectedCourseFilter,
        selectedGlobalDate,
        setSelectedGlobalDate,
        isAIChatOpen,
        setIsAIChatOpen,
        themeMode,
        toggleThemeMode
      }}

    >
      {children}
    </AppContext.Provider>
  );

};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
