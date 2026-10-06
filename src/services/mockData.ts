import type { Course, StudyMaterial, FeynmanSession, GeneratedNote, TopicMastery, AcademicDeadline, CalendarEvent, UserPreferences, User } from '../types';

export const PRESET_USERS: User[] = [
  {
    id: 'usr_demo_1',
    name: 'Alex Chen',
    email: 'alex.chen@mit.edu',
    avatarInitials: 'AC',
    plan: 'Pro Student Plan',
    isLoggedIn: true
  },
  {
    id: 'usr_demo_2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@stanford.edu',
    avatarInitials: 'SJ',
    plan: 'Pro Student Plan',
    isLoggedIn: true
  },
  {
    id: 'usr_demo_3',
    name: 'Noel Sabu',
    email: 'noel.s@university.edu',
    avatarInitials: 'NS',
    plan: 'Pro Student Plan',
    isLoggedIn: true
  }
];

export const INITIAL_USER: User = PRESET_USERS[0];


export const INITIAL_COURSES: Course[] = [
  { id: 'c1', code: 'CS 301', name: 'Data Structures & Algorithms', color: '#6366f1', instructor: 'Dr. Aris Thorne' },
  { id: 'c2', code: 'BIO 202', name: 'Cellular & Molecular Biology', color: '#10b981', instructor: 'Prof. Elena Vance' },
  { id: 'c3', code: 'ECON 101', name: 'Principles of Macroeconomics', color: '#f59e0b', instructor: 'Dr. Marcus Sterling' },
  { id: 'c4', code: 'PHYS 150', name: 'Thermodynamics & Kinetics', color: '#ec4899', instructor: 'Prof. Clara Oswald' },
];

export const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    id: 'm1',
    courseId: 'c1',
    title: 'Graph Algorithms & Shortest Path (Dijkstra vs A*)',
    type: 'pdf',
    uploadDate: '2026-08-01',
    fileSize: '4.2 MB',
    pageCount: 32,
    tags: ['Graphs', 'Dijkstra', 'Heuristics', 'Algorithms'],
    summary: 'Comprehensive overview of weighted graph traversal techniques. Details Dijkstra algorithm using priority queues (O((V+E)log V)) and A* search using admissible heuristic functions f(n) = g(n) + h(n).',
    keyConcepts: [
      'Single-source shortest path optimization',
      'Min-Heap / Priority Queue performance impact',
      'Admissible vs Consistent heuristic criteria in A*',
      'Negative weight edge limitation in Dijkstra'
    ],
    formulas: [
      'f(n) = g(n) + h(n)',
      'Time Complexity: O((|V| + |E|) log |V|)',
      'Space Complexity: O(|V|)'
    ],
    glossary: [
      { term: 'Admissible Heuristic', definition: 'A heuristic function that never overestimates the true cost to reach the goal node.' },
      { term: 'Relaxation Step', definition: 'The process of testing whether updating shortest distance to a vertex improves upon the current best estimate.' }
    ],
    flashcards: [
      { question: 'Why does Dijkstra fail with negative edge weights?', answer: 'Dijkstra assumes that once a node is popped from the priority queue, its shortest distance is finalized. Negative edges violate this greedy property.' },
      { question: 'What condition guarantees A* is optimal?', answer: 'The heuristic function h(n) must be admissible (never overestimates remaining distance).' },
      { question: 'What is the time complexity of Dijkstra using a Min-Heap?', answer: 'O((V + E) log V)' }
    ],
    quiz: [
      {
        question: 'Which heuristic property prevents A* from re-opening closed nodes?',
        options: ['Admissibility', 'Consistency (Monotonicity)', 'Completeness', 'Strict Dominance'],
        correctAnswer: 1,
        explanation: 'Consistency guarantees that f(n) is non-decreasing along any path, ensuring optimal paths are found without re-opening visited nodes.'
      }
    ],
    contentSnippet: `Graph Theory & Shortest Path Analysis
Slide 1: Single-Source Shortest Paths
- Given a weighted directed graph G = (V, E) with non-negative edge weights w(u,v) >= 0.
- Dijkstra's algorithm maintains a tentative distance d[u] for each vertex u.
- Greedy strategy: Always select unvisited vertex u with minimum d[u].
- Edge Relaxation: If d[u] + w(u,v) < d[v], then d[v] = d[u] + w(u,v).`
  },
  {
    id: 'm2',
    courseId: 'c2',
    title: 'DNA Replication & Polymerase Function',
    type: 'slides',
    uploadDate: '2026-08-03',
    fileSize: '12.8 MB',
    pageCount: 45,
    tags: ['Genomics', 'Enzymes', 'Polymerase', 'Replication Fork'],
    summary: 'Detailed examination of semi-conservative DNA replication in prokaryotes and eukaryotes. Explores Helicase, Primase, DNA Polymerase III proofreading (3\' to 5\' exonuclease), and Okazaki fragment ligation.',
    keyConcepts: [
      'Semi-conservative replication mechanism (Meselson-Stahl)',
      'Leading vs Lagging strand synthesis dynamics',
      'Proofreading exonuclease activity & high-fidelity copy rate',
      'Telomerase end-replication solution in eukaryotes'
    ],
    formulas: [
      'Error rate with proofreading: ~1 in 10^9 base pairs',
      'Synthesizing direction: 5\' → 3\''
    ],
    glossary: [
      { term: 'Okazaki Fragment', definition: 'Short synthetic segments of DNA created on the lagging strand during replication.' },
      { term: 'Topoisomerase', definition: 'Enzyme that relieves torsional strain created by unwinding the DNA double helix.' }
    ],
    flashcards: [
      { question: 'In which direction does DNA Polymerase synthesize new strands?', answer: '5\' to 3\' direction continuously on leading strand, discontinuously on lagging strand.' },
      { question: 'Which enzyme seals nicks in the phosphodiester backbone?', answer: 'DNA Ligase.' }
    ],
    quiz: [
      {
        question: 'Which enzyme synthesizes RNA primers required to initiate DNA synthesis?',
        options: ['DNA Polymerase I', 'Helicase', 'Primase', 'Topoisomerase'],
        correctAnswer: 2,
        explanation: 'Primase is a specialized RNA polymerase that lays down short RNA primers for DNA Polymerase.'
      }
    ],
    contentSnippet: `Cellular Biology Lecture 8
Topic: DNA Replication Machinery
- Helicase unwinds double helix at origin of replication.
- Single-Strand Binding Proteins (SSBs) coat template strands.
- DNA Polymerase III synthesizes continuously along 5\' to 3\' leading template.`
  },
  {
    id: 'm3',
    courseId: 'c3',
    title: 'Fiscal Policy & Keynesian Multiplier Model',
    type: 'notes',
    uploadDate: '2026-08-04',
    fileSize: '1.1 MB',
    tags: ['Keynesian', 'Fiscal Policy', 'Multiplier', 'Macroeconomics'],
    summary: 'Analysis of government spending, taxation, Marginal Propensity to Consume (MPC), and aggregate demand shifts in closed and open economic models.',
    keyConcepts: [
      'Spending Multiplier equation k = 1 / (1 - MPC)',
      'Tax Multiplier equation k_t = -MPC / (1 - MPC)',
      'Crowding-out effect on private investment',
      'Automatic vs Discretionary fiscal stabilizers'
    ],
    formulas: [
      'Multiplier (k) = 1 / (1 - MPC)',
      'MPC + MPS = 1',
      'Tax Multiplier = -MPC / (1 - MPC)'
    ],
    glossary: [
      { term: 'MPC (Marginal Propensity to Consume)', definition: 'The fraction of an additional dollar of disposable income spent on consumption.' }
    ],
    flashcards: [
      { question: 'If MPC = 0.8, what is the government spending multiplier?', answer: '1 / (1 - 0.8) = 1 / 0.2 = 5.' }
    ],
    quiz: [
      {
        question: 'What happens to the multiplier when Marginal Propensity to Save (MPS) increases?',
        options: ['Multiplier increases', 'Multiplier decreases', 'Multiplier remains unchanged', 'Becomes infinite'],
        correctAnswer: 1,
        explanation: 'As MPS increases, less money is re-spent in each round of circulation, decreasing the aggregate multiplier.'
      }
    ],
    contentSnippet: `Macroeconomic Dynamics
Keynesian IS-LM Framework:
- Aggregate Expenditure AE = C + I + G + NX
- Government purchase increase ΔG shifts AE upward by ΔG * k.`
  }
];

export const INITIAL_FEYNMAN_SESSIONS: FeynmanSession[] = [
  {
    id: 'fs1',
    topicId: 't1',
    topicTitle: 'Dijkstra Algorithm & Heuristics',
    courseId: 'c1',
    date: '2026-08-04',
    explanationType: 'voice',
    rawTranscript: 'Dijkstra algorithm works by using a priority queue to pick the smallest distance node. It visits every node and relaxes the neighboring edges. But if there are negative weights it breaks down because it assumes checked nodes are final.',
    durationSeconds: 42,
    clarityScore: 88,
    completenessScore: 72,
    accuracyScore: 94,
    overallMastery: 85,
    strengths: ['Accurately explained Priority Queue usage', 'Correctly identified negative edge limitation'],
    missingConcepts: ['Did not mention time complexity O((V+E)logV)', 'Omitted details on Fibonacci Heap optimization'],
    misconceptions: [],
    generatedMasterNote: 'Dijkstra Shortest Path Summary:\n- Uses Min-Heap priority queue.\n- Time Complexity: O((V+E) log V).\n- Constraint: Non-negative edge weights only.'
  }
];

export const INITIAL_NOTES: GeneratedNote[] = [
  {
    id: 'n1',
    courseId: 'c1',
    title: 'Master Note: Graph Traversal & Dijkstra Algorithm',
    topicName: 'Graph Algorithms',
    createdDate: '2026-08-04',
    tags: ['Graph Theory', 'Algorithms', 'Dijkstra', 'Cheat Sheet'],
    markdownContent: `## 📌 Core Concept
Dijkstra's Algorithm is a **greedy algorithm** used for finding the single-source shortest path in a weighted graph with **non-negative edge weights**.

---

### 🔑 Key Requirements & Properties
1. **Priority Queue (Min-Heap)**: Stores nodes sorted by current tentative distance.
2. **Edge Relaxation**: For edge $(u, v)$ with weight $w$, if $dist[u] + w < dist[v]$, update $dist[v] = dist[u] + w$.
3. **Non-Negative Edges Only**: Negative weights cause premature finalization of shortest paths.

---

### ⏱️ Complexity Breakdown
- **Standard Array Implementation**: $\\mathcal{O}(|V|^2)$
- **Min-Heap Binary Queue**: $\\mathcal{O}((|V| + |E|) \\log |V|)$
- **Fibonacci Heap**: $\\mathcal{O}(|E| + |V| \\log |V|)$

---

### 💡 High-Yield Exam Tip
> If an exam question mentions **admissible heuristics** or **h(n)**, transition from Dijkstra to **A* Search**!
`,
    keyTakeaways: [
      'Dijkstra uses greedy choice via Priority Queue min-heap',
      'Time complexity is O((V+E) log V)',
      'Negative edges ruin greedy guarantee'
    ],
    relatedMaterialIds: ['m1']
  }
];

export const INITIAL_TOPICS: TopicMastery[] = [
  {
    id: 't1',
    courseId: 'c1',
    name: 'Graph Algorithms (Dijkstra, A*, BFS/DFS)',
    masteryScore: 68,
    lastReviewed: '2026-08-04',
    difficulty: 'hard',
    recommendedStudyHours: 4,
    subtopics: [
      { name: 'Breadth-First & Depth-First Traversal', status: 'mastered' },
      { name: 'Dijkstra Algorithm & Min-Heap', status: 'mastered' },
      { name: 'A* Search & Admissible Heuristics', status: 'review_needed' },
      { name: 'Bellman-Ford & Negative Edges', status: 'weak' }
    ]
  },
  {
    id: 't2',
    courseId: 'c1',
    name: 'Dynamic Programming & Recurrence',
    masteryScore: 42,
    lastReviewed: '2026-07-28',
    difficulty: 'hard',
    recommendedStudyHours: 6,
    subtopics: [
      { name: 'Memoization vs Tabulation', status: 'review_needed' },
      { name: '0/1 Knapsack Problem', status: 'weak' },
      { name: 'Longest Common Subsequence', status: 'weak' }
    ]
  },
  {
    id: 't3',
    courseId: 'c2',
    name: 'DNA Replication & Polymerase',
    masteryScore: 88,
    lastReviewed: '2026-08-03',
    difficulty: 'medium',
    recommendedStudyHours: 2,
    subtopics: [
      { name: 'Leading & Lagging Strand Synthesis', status: 'mastered' },
      { name: 'Proofreading & DNA Polymerase III', status: 'mastered' },
      { name: 'Telomeres & Telomerase', status: 'mastered' }
    ]
  },
  {
    id: 't4',
    courseId: 'c3',
    name: 'Keynesian Fiscal Policy & Multiplier',
    masteryScore: 75,
    lastReviewed: '2026-08-04',
    difficulty: 'easy',
    recommendedStudyHours: 2,
    subtopics: [
      { name: 'MPC & MPS Calculation', status: 'mastered' },
      { name: 'Government Spending Multiplier', status: 'mastered' },
      { name: 'Crowding-out Investment Effect', status: 'review_needed' }
    ]
  },
  {
    id: 't5',
    courseId: 'c4',
    name: 'Second Law of Thermodynamics & Entropy',
    masteryScore: 50,
    lastReviewed: '2026-07-30',
    difficulty: 'hard',
    recommendedStudyHours: 5,
    subtopics: [
      { name: 'Carnot Engine Efficiency', status: 'review_needed' },
      { name: 'Entropy Calculation in Reversible Processes', status: 'weak' },
      { name: 'Gibbs Free Energy ΔG = ΔH - TΔS', status: 'review_needed' }
    ]
  }
];

export const INITIAL_DEADLINES: AcademicDeadline[] = [
  {
    id: 'd1',
    title: 'CS 301 Midterm Exam',
    courseId: 'c1',
    dueDate: '2026-08-10',
    type: 'exam',
    targetGrade: 'A',
    weightPercentage: 30,
    estimatedPrepHours: 12,
    isCompleted: false
  },
  {
    id: 'd2',
    title: 'BIO 202 Lab Report - Genomics',
    courseId: 'c2',
    dueDate: '2026-08-08',
    type: 'assignment',
    targetGrade: 'A+',
    weightPercentage: 15,
    estimatedPrepHours: 4,
    isCompleted: false
  },
  {
    id: 'd3',
    title: 'PHYS 150 Problem Set #4',
    courseId: 'c4',
    dueDate: '2026-08-12',
    type: 'assignment',
    targetGrade: 'A',
    weightPercentage: 10,
    estimatedPrepHours: 5,
    isCompleted: false
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'ev1', date: '2026-08-05', startTime: '09:00', endTime: '10:30', title: 'CS 301 Lecture: Dynamic Programming', courseId: 'c1', type: 'class', priority: 'high' },
  { id: 'ev2', date: '2026-08-05', startTime: '11:00', endTime: '12:30', title: 'AI Study: Graph Algorithms Deep Dive', courseId: 'c1', type: 'ai_study', priority: 'high', topicName: 'Graph Algorithms' },
  { id: 'ev3', date: '2026-08-05', startTime: '14:00', endTime: '15:30', title: 'Feynman Voice Drill: A* Heuristics', courseId: 'c1', type: 'feynman_review', priority: 'high', topicName: 'A* Search' },
  { id: 'ev4', date: '2026-08-05', startTime: '16:00', endTime: '17:00', title: 'Gym & Break', type: 'break', priority: 'low' },
  { id: 'ev5', date: '2026-08-06', startTime: '10:00', endTime: '12:00', title: 'AI Study: Dynamic Programming Practice', courseId: 'c1', type: 'ai_study', priority: 'urgent', topicName: 'Dynamic Programming' },
  { id: 'ev6', date: '2026-08-06', startTime: '13:30', endTime: '15:00', title: 'BIO 202 Lecture: Enzyme Kinetics', courseId: 'c2', type: 'class', priority: 'medium' },
  { id: 'ev7', date: '2026-08-06', startTime: '15:30', endTime: '17:00', title: 'BIO 202 Lab Report Prep', courseId: 'c2', type: 'ai_study', priority: 'high' },
  { id: 'ev8', date: '2026-08-07', startTime: '09:30', endTime: '11:30', title: 'PHYS 150 Thermodynamics Review', courseId: 'c4', type: 'ai_study', priority: 'high', topicName: 'Thermodynamics' },
  { id: 'ev9', date: '2026-08-07', startTime: '14:00', endTime: '16:00', title: 'CS 301 Midterm Mock Exam', courseId: 'c1', type: 'ai_study', priority: 'urgent' }
];

export const INITIAL_USER_PREFERENCES: UserPreferences = {
  dailyStudyGoalHours: 4.5,
  preferredStudyTime: 'morning',
  breakIntervalMinutes: 45,
  enableBurnoutProtection: true,
  feynmanTargetMastery: 85
};
