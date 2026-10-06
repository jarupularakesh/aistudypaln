import type { FeynmanSession, StudyMaterial, CalendarEvent, TopicMastery, AcademicDeadline, UserPreferences } from '../types';

/**
 * AI Service supporting simulated intelligence with realistic domain-specific analysis
 * for Feynman Technique evaluation, material summarization, and schedule optimization.
 */

export async function evaluateFeynmanExplanation(
  topicTitle: string,
  rawExplanation: string,
  courseName: string = 'General Course'
): Promise<Partial<FeynmanSession>> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const wordCount = rawExplanation.trim().split(/\s+/).length;

  let clarityScore = Math.min(95, Math.max(50, 60 + Math.floor(wordCount / 2)));
  let completenessScore = Math.min(95, Math.max(40, 50 + Math.floor(wordCount / 1.5)));
  let accuracyScore = Math.min(98, Math.max(65, 75 + Math.floor(Math.random() * 15)));

  if (rawExplanation.toLowerCase().includes('don\'t know') || rawExplanation.toLowerCase().includes('not sure')) {
    completenessScore = Math.max(30, completenessScore - 25);
    accuracyScore = Math.max(40, accuracyScore - 15);
  }

  const overallMastery = Math.round((clarityScore * 0.3) + (completenessScore * 0.4) + (accuracyScore * 0.3));

  const strengths: string[] = [
    `Clear articulation of core principles in ${topicTitle}`,
    `Good use of domain terminology relevant to ${courseName}`,
  ];

  if (wordCount > 30) {
    strengths.push('Described real-world constraints and operational edge cases');
  }

  const missingConcepts: string[] = [];
  const misconceptions: string[] = [];

  if (completenessScore < 75) {
    missingConcepts.push(`Formal mathematical / algorithmic complexity bounds`);
    missingConcepts.push(`Nuanced trade-offs when scaling or applying to edge conditions`);
  } else {
    missingConcepts.push(`Alternative optimization strategies in advanced scenarios`);
  }

  if (accuracyScore < 70) {
    misconceptions.push(`Possible confusion regarding state mutation during iteration`);
  }

  const generatedMasterNote = `## 📝 AI Master Note: ${topicTitle}
*Synthesized from Student Feynman Self-Explanation on ${new Date().toLocaleDateString()}*

---

### 🌟 Demonstrated Understanding (${overallMastery}% Mastery)
${rawExplanation.trim()}

---

### 🔍 Key Takeaways & Verified Concepts
- **Core Mechanism**: Explicitly captured the main execution steps for **${topicTitle}**.
- **Strengths**: ${strengths.join('; ')}.

---

### ⚠️ Gaps & Reinforcement Targets
${missingConcepts.map(c => `- 📌 **${c}**: Review recommended study material.`).join('\n')}

---

### 🚀 Recommended Next Action
${overallMastery >= 80 
  ? `✅ High mastery achieved! Schedule a quick spaced-repetition review in 5 days.`
  : `💡 Allocate a 45-minute focused AI study session targeting: ${missingConcepts.join(', ')}.`}`;

  return {
    topicTitle,
    clarityScore,
    completenessScore,
    accuracyScore,
    overallMastery,
    strengths,
    missingConcepts,
    misconceptions,
    generatedMasterNote
  };
}

export async function summarizeMaterialWithAI(
  title: string,
  contentSnippet: string
): Promise<Partial<StudyMaterial>> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const cleanText = (contentSnippet || '')
    .replace(/[\uFFFD\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract paragraphs or sentences
  const paragraphs = cleanText
    .split(/\n+|\s{4,}/)
    .map(p => p.trim())
    .filter(p => p.length > 20 && !p.startsWith('--- Page'));

  const validParagraphs = paragraphs.slice(0, 5);

  let executiveSummary = '';
  if (validParagraphs.length > 0) {
    const mainTakeaways = validParagraphs.map(p => `• ${p.slice(0, 140)}...`).join('\n');
    executiveSummary = `### 📌 Core Executive Summary for "${title}"\n\n${validParagraphs[0]}\n\n#### 🎯 Key Document Takeaways:\n${mainTakeaways}\n\n*This document establishes essential theoretical foundations, architectural constraints, and exam-focused formulas.*`;
  } else {
    executiveSummary = `### 📌 Core Executive Summary for "${title}"\n\nSynthesized comprehensive lecture materials for **${title}**. The document covers core theoretical frameworks, operational constraints, system trade-offs, and exam-critical problem patterns.\n\n#### 🎯 Key Document Takeaways:\n• Primary mathematical model and system execution architecture.\n• Critical performance trade-offs under high-throughput conditions.\n• Standard exam problem patterns & verification heuristics.`;
  }

  const keyConcepts = validParagraphs.length >= 2
    ? validParagraphs.slice(0, 4).map((p, idx) => `Concept ${idx + 1}: ${p.slice(0, 80)}`)
    : [
        `Foundational architecture and mathematical model of ${title}`,
        `Critical performance trade-offs and complexity bounds under high-throughput conditions`,
        `Standard exam problem patterns & verification heuristics`,
        `State space traversal, invariants, and edge condition handling`
      ];

  const formulas = [
    `Optimal Threshold T = \\sqrt{N \\cdot \\log(N)}`,
    `Efficiency \\eta = 1 - \\frac{Q_C}{Q_H}`,
    `Complexity Bound O(E \\log V)`
  ];

  const glossary = [
    { term: 'Primary Determinant', definition: 'The dominant variable controlling systemic state transitions.' },
    { term: 'Invariant Condition', definition: 'A mathematical property that remains true throughout execution cycles.' },
    { term: 'Asymptotic Upper Bound', definition: 'Formal limit describing execution behavior under worst-case scaling.' }
  ];

  const flashcards = validParagraphs.length >= 2
    ? [
        {
          question: `What is the core focus of page 1 in ${title}?`,
          answer: validParagraphs[0].slice(0, 140)
        },
        {
          question: `What primary mechanism is detailed in ${title}?`,
          answer: validParagraphs[1].slice(0, 140)
        },
        {
          question: `How does ${title} optimize efficiency?`,
          answer: `By maintaining state invariants and pruning redundant computation paths.`
        }
      ]
    : [
        {
          question: `What is the primary thesis of ${title}?`,
          answer: `To structure core course concepts while preserving analytical invariants.`
        },
        {
          question: `What is the key execution constraint in ${title}?`,
          answer: `State memory overhead, edge-case validation, and operational complexity bounds.`
        },
        {
          question: `How does ${title} optimize runtime efficiency?`,
          answer: `By pruning redundant search branches and caching repeated sub-state calculations.`
        }
      ];

  const quiz = [
    {
      question: `Which parameter directly impacts the performance of ${title}?`,
      options: ['State Density & Step Size', 'Initial Memory Offset', 'Static Hash Table Index', 'Unbounded Branch Factor'],
      correctAnswer: 0,
      explanation: 'State density and iteration step size govern overall convergence speed and stability.'
    },
    {
      question: `What primary invariant must be preserved during ${title} execution?`,
      options: ['Non-negative distance bounds', 'Constant time disk access', 'Linear search scaling', 'Randomized thread order'],
      correctAnswer: 0,
      explanation: 'Maintaining valid distance invariants guarantees algorithm correctness and termination.'
    }
  ];

  return {
    summary: executiveSummary,
    keyConcepts,
    formulas,
    glossary,
    flashcards,
    quiz
  };
}

const PRESET_FALLBACK_TOPICS: TopicMastery[] = [
  { id: 't1', name: 'Graph Algorithms & Heuristics', courseId: 'c1', masteryScore: 45, lastReviewed: '2026-08-01', difficulty: 'hard', recommendedStudyHours: 4, subtopics: [] },
  { id: 't2', name: 'Cellular Respiration & ATP Synthesis', courseId: 'c2', masteryScore: 55, lastReviewed: '2026-08-02', difficulty: 'medium', recommendedStudyHours: 3, subtopics: [] },
  { id: 't3', name: 'Macroeconomic Inflation & Interest Rates', courseId: 'c3', masteryScore: 60, lastReviewed: '2026-08-03', difficulty: 'medium', recommendedStudyHours: 3, subtopics: [] },
  { id: 't4', name: 'Organic Chemistry Substitution Reactions', courseId: 'c4', masteryScore: 50, lastReviewed: '2026-08-04', difficulty: 'hard', recommendedStudyHours: 4, subtopics: [] }
];


export async function generateOptimizedSchedule(
  topics: TopicMastery[],
  _deadlines: AcademicDeadline[],
  userPrefs: UserPreferences,
  startDateStr?: string
): Promise<CalendarEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newEvents: CalendarEvent[] = [];

  let baseDate = new Date();
  if (startDateStr) {
    const [y, m, d] = startDateStr.split('-').map(Number);
    baseDate = new Date(y, m - 1, d);
  } else {
    baseDate = new Date(2026, 7, 5);
  }

  const effectiveTopics = topics.length > 0 ? topics : PRESET_FALLBACK_TOPICS;
  const weakTopics = [...effectiveTopics].sort((a, b) => a.masteryScore - b.masteryScore);
  const daysAhead = [0, 1, 2, 3, 4, 5, 6];

  daysAhead.forEach((dayOffset, idx) => {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + dayOffset);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const assignedTopic = weakTopics[idx % weakTopics.length];
    
    if (assignedTopic) {
      newEvents.push({
        id: `auto-ev-${Date.now()}-${idx}-1`,
        date: dateStr,
        startTime: userPrefs.preferredStudyTime === 'morning' ? '09:00' : '16:00',
        endTime: userPrefs.preferredStudyTime === 'morning' ? '10:30' : '17:30',
        title: `AI Study: ${assignedTopic.name}`,
        courseId: assignedTopic.courseId,
        type: 'ai_study',
        priority: assignedTopic.masteryScore < 50 ? 'urgent' : 'high',
        topicName: assignedTopic.name
      });
    }

    if (assignedTopic && assignedTopic.masteryScore < 70) {
      newEvents.push({
        id: `auto-ev-${Date.now()}-${idx}-2`,
        date: dateStr,
        startTime: '19:00',
        endTime: '19:45',
        title: `Feynman Drill: ${assignedTopic.name}`,
        courseId: assignedTopic.courseId,
        type: 'feynman_review',
        priority: 'high',
        topicName: assignedTopic.name
      });
    }
  });

  return newEvents;
}

