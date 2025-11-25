import { useState, useMemo } from 'react';
import { useResults, useCourses } from '../hooks/useExamData';
import { BarChart3, TrendingUp } from 'lucide-react';

export function ExamAnalysis() {
  const { data: results, loading } = useResults();
  const { data: courses } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const courseResults = useMemo(() => {
    if (!selectedCourse || !results.length) return [];

    return results
      .filter((r) => r.exam?.course?.id === selectedCourse && r.marks_obtained !== null)
      .map((r) => ({
        studentName: r.student?.full_name || 'Unknown',
        examType: r.exam?.exam_type || 'Unknown',
        marks: r.marks_obtained || 0,
        grade: r.grade || 'N/A',
        maxMarks: r.exam?.max_marks || 100,
      }))
      .sort((a, b) => b.marks - a.marks);
  }, [selectedCourse, results]);

  const statistics = useMemo(() => {
    if (courseResults.length === 0) return null;

    const marks = courseResults.map((r) => r.marks);
    const total = marks.reduce((a, b) => a + b, 0);
    const avg = total / marks.length;
    const max = Math.max(...marks);
    const min = Math.min(...marks);

    return { total, avg, max, min };
  }, [courseResults]);

  const examGroups = useMemo(() => {
    const groups: Record<string, typeof courseResults> = {};
    courseResults.forEach((result) => {
      if (!groups[result.examType]) {
        groups[result.examType] = [];
      }
      groups[result.examType].push(result);
    });
    return groups;
  }, [courseResults]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Exam Analysis</h1>
        <p className="text-gray-600 mt-1">Performance analytics and visualizations</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course to Analyze</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.course_name} ({course.course_code})
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium">Average Marks</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.avg.toFixed(1)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium">Highest Marks</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{statistics.max.toFixed(1)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium">Lowest Marks</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{statistics.min.toFixed(1)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium">Total Results</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{courseResults.length}</p>
          </div>
        </div>
      )}

      {selectedCourse && !loading && courseResults.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
          <p className="text-gray-700">No results available for this course yet.</p>
        </div>
      )}

      {selectedCourse &&
        courseResults.length > 0 &&
        Object.entries(examGroups).map(([examType, results]) => (
          <div key={examType} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {examType}
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rank</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Marks</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Grade</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.map((result, idx) => {
                      const percentage = ((result.marks / result.maxMarks) * 100).toFixed(1);
                      return (
                        <tr key={`${result.studentName}-${idx}`} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-3 text-sm font-medium text-gray-900">#{idx + 1}</td>
                          <td className="px-6 py-3 text-sm text-gray-900">{result.studentName}</td>
                          <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">
                            {result.marks.toFixed(1)}
                          </td>
                          <td className="px-6 py-3 text-sm text-center">
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                                result.grade === 'A'
                                  ? 'bg-green-500'
                                  : result.grade === 'B'
                                    ? 'bg-blue-500'
                                    : result.grade === 'C'
                                      ? 'bg-yellow-500'
                                      : result.grade === 'D'
                                        ? 'bg-orange-500'
                                        : 'bg-red-500'
                              }`}
                            >
                              {result.grade}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-right text-gray-600">{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
