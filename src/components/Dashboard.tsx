import { useStudents, useCourses, useExams } from '../hooks/useExamData';
import { BarChart3, BookOpen, Users, ClipboardList } from 'lucide-react';

export function Dashboard() {
  const { data: students, loading: studentLoading } = useStudents();
  const { data: courses, loading: courseLoading } = useCourses();
  const { data: exams, loading: examLoading } = useExams();

  const stats = [
    {
      label: 'Total Students',
      value: studentLoading ? '-' : students.length,
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Active Courses',
      value: courseLoading ? '-' : courses.length,
      icon: BookOpen,
      color: 'bg-green-50 text-green-700 border-green-200',
    },
    {
      label: 'Exams Scheduled',
      value: examLoading ? '-' : exams.length,
      icon: ClipboardList,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      label: 'Performance',
      value: 'Tracking',
      icon: BarChart3,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-lg border p-6 ${stat.color} backdrop-blur-sm transition hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 opacity-50" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">Welcome to Exam Management System</h2>
        <p className="text-gray-600 mt-2">Select a module from the sidebar to begin managing students, exams, and results.</p>
      </div>
    </div>
  );
}
