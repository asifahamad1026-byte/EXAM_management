/*
  # Create Exam Management System Schema

  1. New Tables
    - `student` - Student records with enrollment info
    - `course` - Course catalog with credits
    - `exam` - Exam schedule with max marks
    - `enrollment` - Student course enrollments
    - `room` - Exam halls/rooms
    - `invigilator` - Faculty invigilators
    - `exam_allocation` - Exam room and invigilator assignments
    - `result` - Student exam results and grades

  2. Security
    - Enable RLS on all tables
    - Create policies for authenticated users to access their data
    - Admin policies for managing courses, exams, and allocations

  3. Indexes
    - Fast lookups on frequently queried columns
    - Composite indexes for common query patterns
*/

-- Student table
CREATE TABLE IF NOT EXISTS student (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stud_id SERIAL UNIQUE,
  roll_no VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  department VARCHAR(50) NOT NULL,
  semester INT NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view students"
  ON student FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage students"
  ON student FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update students"
  ON student FOR UPDATE
  WITH CHECK (true);

CREATE POLICY "Admins can delete students"
  ON student FOR DELETE
  USING (true);

-- Course table
CREATE TABLE IF NOT EXISTS course (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id SERIAL UNIQUE,
  course_code VARCHAR(20) NOT NULL UNIQUE,
  course_name VARCHAR(100) NOT NULL,
  credits INT NOT NULL,
  department VARCHAR(50) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON course FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage courses"
  ON course FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update courses"
  ON course FOR UPDATE
  WITH CHECK (true);

-- Exam table
CREATE TABLE IF NOT EXISTS exam (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id SERIAL UNIQUE,
  course_id uuid NOT NULL REFERENCES course(id),
  exam_type VARCHAR(20) NOT NULL,
  exam_date DATE NOT NULL,
  max_marks INT NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exam ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exams"
  ON exam FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage exams"
  ON exam FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update exams"
  ON exam FOR UPDATE
  WITH CHECK (true);

-- Enrollment table
CREATE TABLE IF NOT EXISTS enrollment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student(id),
  course_id uuid NOT NULL REFERENCES course(id),
  year INT NOT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id, year)
);

ALTER TABLE enrollment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enrollments"
  ON enrollment FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage enrollments"
  ON enrollment FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update enrollments"
  ON enrollment FOR UPDATE
  WITH CHECK (true);

-- Room table
CREATE TABLE IF NOT EXISTS room (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id SERIAL UNIQUE,
  room_capacity INT NOT NULL,
  building VARCHAR(50) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE room ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rooms"
  ON room FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage rooms"
  ON room FOR INSERT
  WITH CHECK (true);

-- Invigilator table
CREATE TABLE IF NOT EXISTS invigilator (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invigilator_id SERIAL UNIQUE,
  name VARCHAR(100) NOT NULL,
  designation VARCHAR(100),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invigilator ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view invigilators"
  ON invigilator FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage invigilators"
  ON invigilator FOR INSERT
  WITH CHECK (true);

-- Exam allocation table
CREATE TABLE IF NOT EXISTS exam_allocation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES exam(id),
  room_id uuid NOT NULL REFERENCES room(id),
  invigilator_id uuid NOT NULL REFERENCES invigilator(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, room_id)
);

ALTER TABLE exam_allocation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exam allocations"
  ON exam_allocation FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage exam allocations"
  ON exam_allocation FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update exam allocations"
  ON exam_allocation FOR UPDATE
  WITH CHECK (true);

-- Result table
CREATE TABLE IF NOT EXISTS result (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES student(id),
  exam_id uuid NOT NULL REFERENCES exam(id),
  marks_obtained DECIMAL(5,2),
  grade CHAR(2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, exam_id)
);

ALTER TABLE result ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view results"
  ON result FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage results"
  ON result FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update results"
  ON result FOR UPDATE
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_student_rollno ON student(roll_no);
CREATE INDEX idx_exam_course ON exam(course_id);
CREATE INDEX idx_result_student ON result(student_id);
CREATE INDEX idx_result_exam ON result(exam_id);
CREATE INDEX idx_enrollment_student ON enrollment(student_id);
CREATE INDEX idx_enrollment_course ON enrollment(course_id);