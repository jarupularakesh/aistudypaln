import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Send, Sparkles, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIChatDrawer: React.FC = () => {
  const { isAIChatOpen, setIsAIChatOpen, currentUser } = useApp();

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Student';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${firstName}! I am your AI Academic Tutor. Indexed 4 active courses & study materials. Ask me anything about graph algorithms, molecular biology, or fiscal policy!`,
      timestamp: '05:45 AM'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    'Explain Dijkstra vs A* Search',
    'How does DNA Polymerase III proofread?',
    'Keynesian Multiplier equation?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = '';
      const lower = query.toLowerCase();

      if (lower.includes('dijkstra') || lower.includes('a*') || lower.includes('graph')) {
        responseText = `### 📌 Dijkstra vs A* Search
- **Dijkstra**: Evaluated distance metric $g(n)$ from start node. Always explores lowest cost unvisited node using a Min-Heap Priority Queue.
- **A* Search**: Evaluates $f(n) = g(n) + h(n)$, where $h(n)$ is an **admissible heuristic**.
- **Key Exam Takeaway**: A* reaches the goal significantly faster than Dijkstra because the heuristic guides traversal directly toward the target!`;
      } else if (lower.includes('dna') || lower.includes('polymerase') || lower.includes('proofread')) {
        responseText = `### 🧬 DNA Polymerase Proofreading
- DNA Polymerase III possesses an intrinsic **$3' \\rightarrow 5'$ exonuclease activity**.
- When an incorrect nucleotide is incorporated, the mismatched $3'-\\text{OH}$ end causes structural stalling.
- The enzyme reverses direction, removes the incorrect base, and resumes $5' \\rightarrow 3'$ synthesis.`;
      } else if (lower.includes('multiplier') || lower.includes('keynesian') || lower.includes('fiscal')) {
        responseText = `### 📈 Keynesian Spending Multiplier
$$k = \\frac{1}{1 - \\text{MPC}} = \\frac{1}{\\text{MPS}}$$
If Marginal Propensity to Consume $(\\text{MPC}) = 0.75$:
$$k = \\frac{1}{1 - 0.75} = \\frac{1}{0.25} = 4$$
A **$10 Billion** increase in government spending shifts aggregate demand by **$40 Billion**!`;
      } else {
        responseText = `Great question regarding **${query}**! Based on your course materials in CS 301 and BIO 202, the key concept involves breaking down the process into primary invariants and verifying edge conditions.`;
      }

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  if (!isAIChatOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-colors">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>AI Study Tutor</span>
              <span className="saas-badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[9px]">Pro Engine</span>
            </h3>
            <p className="text-[10px] text-slate-400">4 Active Courses Indexed</p>
          </div>
        </div>

        <button
          onClick={() => setIsAIChatOpen(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] text-xs space-y-1 ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md font-medium'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none whitespace-pre-wrap'
              }`}
            >
              <p className="leading-relaxed">{m.text}</p>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">{m.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium italic p-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>AI Tutor analyzing response...</span>
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-1.5 overflow-x-auto">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[10px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0 font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask AI Tutor anything..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="saas-button-primary p-2.5 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};


