import { useState, useMemo } from 'react';
import { useStudents, useCourses, useExams, useResults, upsertResult } from '../hooks/useExamData';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function EnterMarks() {
  const { data: students } = useStudents();
  const { data: courses } = useCourses();
  const { data: exams } = useExams();
  const { refetch: refetchResults } = useResults();

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [marks, setMarks] = useState<string>('');
  const [grade, setGrade] = useState<string>('A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredExams = useMemo(() => {
    if (!selectedCourse) return [];
    const courseId = courses.find((c) => c.id === selectedCourse)?.id;
    return exams.filter((e) => e.course_id === courseId);
  }, [selectedCourse, exams, courses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!selectedStudent || !selectedExam || !marks) {
        throw new Error('Please fill in all required fields');
      }

      const marksValue = parseFloat(marks);
      if (isNaN(marksValue) || marksValue < 0 || marksValue > 100) {
        throw new Error('Marks must be between 0 and 100');
      }

      const student = students.find((s) => s.id === selectedStudent);
      const exam = exams.find((e) => e.id === selectedExam);

      if (!student || !exam) {
        throw new Error('Invalid student or exam selection');
      }

      await upsertResult(selectedStudent, selectedExam, marksValue, grade);

      setSuccess(`Marks recorded for ${student.full_name} in ${exam.exam_type}`);
      setMarks('');
      setGrade('A');
      setSelectedExam('');
      await refetchResults();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Enter Exam Marks</h1>
        <p className="text-gray-600 mt-1">Record and update student exam results</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Student *</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Student --</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name} ({student.roll_no})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course *</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name} ({course.course_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam *</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              required
              disabled={!selectedCourse}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">-- Select Exam --</option>
              {filteredExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.exam_type} ({exam.max_marks} marks) - {exam.exam_date}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marks Obtained *</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              required
              placeholder="0.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Saving...' : 'Submit Result'}
        </button>
      </form>
    </div>
  );
}
