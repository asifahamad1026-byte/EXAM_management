import { useEffect, useState } from 'react';
import { supabase, Student, Course, Exam, Result } from '../lib/supabase';

export function useStudents() {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data: students, error } = await supabase
          .from('student')
          .select('*')
          .order('full_name');

        if (error) throw error;
        setData(students || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { data, loading, error };
}

export function useCourses() {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: courses, error } = await supabase
          .from('course')
          .select('*')
          .order('course_code');

        if (error) throw error;
        setData(courses || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { data, loading, error };
}

export function useExams() {
  const [data, setData] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data: exams, error } = await supabase
          .from('exam')
          .select('*')
          .order('exam_date');

        if (error) throw error;
        setData(exams || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return { data, loading, error };
}

export function useResults() {
  const [data, setData] = useState<(Result & { student: Student; exam: Exam & { course: Course } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const { data: results, error } = await supabase
        .from('result')
        .select(`
          *,
          student: student_id (id, full_name, roll_no, stud_id),
          exam: exam_id (id, exam_type, exam_date, max_marks, course_id,
            course: course_id (id, course_code, course_name)
          )
        `)
        .order('exam_id');

      if (error) throw error;
      setData(results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
}

export async function addStudent(student: Omit<Student, 'id' | 'stud_id'>) {
  const { error } = await supabase
    .from('student')
    .insert([student]);

  if (error) throw error;
}

export async function deleteStudent(id: string) {
  const { error } = await supabase
    .from('student')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function upsertResult(
  studentId: string,
  examId: string,
  marksObtained: number,
  grade: string
) {
  const { error } = await supabase
    .from('result')
    .upsert({
      student_id: studentId,
      exam_id: examId,
      marks_obtained: marksObtained,
      grade: grade,
    });

  if (error) throw error;
}
