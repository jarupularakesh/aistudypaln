import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard';
import { MaterialsView } from './components/Materials/MaterialsView';
import { FeynmanWorkbench } from './components/Feynman/FeynmanWorkbench';
import { NotesView } from './components/Notes/NotesView';
import { PlannerView } from './components/Planner/PlannerView';
import { AdaptiveView } from './components/Adaptive/AdaptiveView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { FocusModeView } from './components/Focus/FocusModeView';
import { TasksView } from './components/Tasks/TasksView';
import { CalendarView } from './components/Calendar/CalendarView';
import { SettingsView } from './components/Settings/SettingsView';
import { AIChatDrawer } from './components/Chat/AIChatDrawer';
import { AuthModal } from './components/Auth/AuthModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-colors duration-200">
      {activeTab === 'dashboard' && <OverviewDashboard />}
      {activeTab === 'planner' && <PlannerView />}
      {activeTab === 'calendar' && <CalendarView />}
      {activeTab === 'tasks' && <TasksView />}
      {activeTab === 'feynman' && <FeynmanWorkbench />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'notes' && <NotesView />}
      {activeTab === 'focus' && <FocusModeView />}
      {activeTab === 'materials' && <MaterialsView />}
      {activeTab === 'adaptive' && <AdaptiveView />}
      {activeTab === 'settings' && <SettingsView />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
        <AIChatDrawer />
        <AuthModal />
      </div>
    </AppProvider>
  );
}


export default App;

