import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Student = {
  id: string;
  stud_id: number;
  roll_no: string;
  full_name: string;
  department: string;
  semester: number;
  email: string;
};

export type Course = {
  id: string;
  course_id: number;
  course_code: string;
  course_name: string;
  credits: number;
  department: string;
};

export type Exam = {
  id: string;
  exam_id: number;
  course_id: string;
  exam_type: string;
  exam_date: string;
  max_marks: number;
};

export type Result = {
  id: string;
  student_id: string;
  exam_id: string;
  marks_obtained: number | null;
  grade: string | null;
};
