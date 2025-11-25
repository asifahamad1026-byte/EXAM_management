import { useState } from 'react';
import { LayoutDashboard, Users, ClipboardList, BarChart3, GraduationCap } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { StudentManagement } from './components/StudentManagement';
import { EnterMarks } from './components/EnterMarks';
import { ExamAnalysis } from './components/ExamAnalysis';

type MenuOption = 'dashboard' | 'students' | 'marks' | 'analysis';

function App() {
  const [currentPage, setCurrentPage] = useState<MenuOption>('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'marks', label: 'Enter Marks', icon: ClipboardList },
    { id: 'analysis', label: 'Exam Analysis', icon: BarChart3 },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">SAU Exam Management</h1>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-64 bg-white border-r border-gray-200 lg:min-h-screen">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as MenuOption)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'students' && <StudentManagement />}
            {currentPage === 'marks' && <EnterMarks />}
            {currentPage === 'analysis' && <ExamAnalysis />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
