# 🎓 AI Study Planner & Active Learning Workbench

A modern, intelligent, active learning assistant built with **React**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and the **Google Gemini API**. 

Designed to supercharge student productivity with adaptive study schedules, active recall tools, the Feynman technique, Pomodoro focus sessions, and AI-driven document analysis.

---

## ✨ Key Features

- 🧠 **Adaptive AI Schedule Generator**: Automatically generates optimized study timetables tailored to your exams, study hours, subject difficulty, and cognitive energy levels.
- 💬 **AI Study Copilot**: Integrated chatbot powered by Google Gemini to answer questions, summarize complex topics, and create instant revision guides.
- 🔬 **Feynman Learning Workbench**: Test your understanding by explaining concepts in plain language. AI analyzes your explanation and pinpoints knowledge gaps.
- ⏱️ **Focus Mode (Pomodoro Timer)**: Stay in the flow state with customizable focus blocks, break intervals, ambient sounds, and session logging.
- 📄 **Materials & PDF Extractor**: Upload notes and PDFs for automated client-side text extraction, key takeaway generation, and smart flashcard creation.
- 📊 **Analytics & Mastery Dashboard**: Track your daily study streak, topic mastery percentage, hours invested, and productivity heatmaps.
- 🔍 **Global Command Palette (`Ctrl/Cmd + K`)**: Lightning-fast search and keyboard navigation across all tasks, notes, and study modules.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Glassmorphism UI, Lucide React Icons
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Document Processing**: `pdfjs-dist` for in-browser PDF parsing
- **Data Persistence**: LocalStorage with state context

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-study-planner.git
   cd ai-study-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## 📂 Project Structure

```text
ai-study-planner/
├── public/              # Static assets & icons
├── src/
│   ├── assets/          # Images & illustrations
│   ├── components/      # UI components (Adaptive, Analytics, Feynman, Focus, Materials, etc.)
│   ├── context/         # App state management (AppContext)
│   ├── services/        # Gemini AI service integration & mock data
│   ├── types/           # TypeScript interfaces & domain models
│   ├── utils/           # Helper utilities & PDF extractor
│   ├── App.tsx          # Main layout & router integration
│   └── main.tsx         # Application entry point
├── package.json
└── vite.config.ts
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
