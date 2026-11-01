import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { Header } from './components/layout/Header.js';
import { DutyLoginScreen, SecondaryUnlockModal } from './components/modals/AuthLoginModal.js';
import { AttendanceView } from './views/AttendanceView.js';
import { OutOfClassView } from './views/OutOfClassView.js';
import { ViolationsView } from './views/ViolationsView.js';
import { DashboardView } from './views/DashboardView.js';
import { HomeroomView } from './views/HomeroomView.js';
import { StudentAffairsView } from './views/StudentAffairsView.js';
import { AdminView } from './views/AdminView.js';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { session, activeTab, setActiveTab, toasts, dismissToast } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unlockRole, setUnlockRole] = useState<'homeroom' | 'student_affairs' | 'admin' | null>(null);

  // Bagian 3 Alur 1: If no session, show ONLY the Duty Login Screen
  if (!session) {
    return <DutyLoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenUnlockModal={(role) => setUnlockRole(role)}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Header */}
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dynamic View Content */}
        <main className="flex-1 pb-12">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'attendance' && <AttendanceView />}
          {activeTab === 'out_of_class' && <OutOfClassView />}
          {activeTab === 'violations' && <ViolationsView />}
          {activeTab === 'homeroom' && <HomeroomView />}
          {activeTab === 'student_affairs' && <StudentAffairsView />}
          {activeTab === 'admin' && <AdminView />}
        </main>
      </div>

      {/* Password Unlock Modal for Wali Kelas, Kesiswaan, Admin */}
      <SecondaryUnlockModal
        role={unlockRole}
        onClose={() => setUnlockRole(null)}
        onSuccess={() => {
          if (unlockRole) setActiveTab(unlockRole);
        }}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3 rounded-lg shadow-lg border text-xs animate-in slide-in-from-bottom-2 duration-150 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
              <span className="leading-tight">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-white/70 hover:text-white shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
