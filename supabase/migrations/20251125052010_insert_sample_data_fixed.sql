/*
  # Insert Sample Data for Exam Management System

  1. Student Records - 5 real students
  2. Courses - 5 courses across CSE and Management
  3. Exams - 4 exams per course
  4. Rooms - 6 exam halls
  5. Invigilators - 5 faculty members
  6. Enrollments - All students enrolled in all courses
*/

-- Insert Students
INSERT INTO student (roll_no, full_name, department, semester, email)
VALUES
  ('SAU/CS/BTECH(CSE)/2024/1', 'Madhav Kathuria', 'CSE', 3, 'madhav@students.sau.ac.in'),
  ('SAU/CS/BTECH(CSE)/2024/2', 'Deepshika Kushwaha', 'CSE', 3, 'deepshika@students.sau.ac.in'),
  ('SAU/CS/BTECH(CSE)/2024/3', 'Rabiya Khan', 'CSE', 3, 'rabiya@students.sau.ac.in'),
  ('SAU/CS/BTECH(CSE)/2024/4', 'Asif Ahmed', 'CSE', 3, 'asif@students.sau.ac.in'),
  ('SAU/CS/BTECH(CSE)/2024/5', 'Saumya Parashar', 'CSE', 3, 'saumya@students.sau.ac.in')
ON CONFLICT (roll_no) DO NOTHING;

-- Insert Courses
INSERT INTO course (course_code, course_name, credits, department)
VALUES
  ('CSE210', 'Design and Analysis of Algorithms', 4, 'CSE'),
  ('MTH216', 'Probability and Statistics', 4, 'CSE'),
  ('CSE237', 'Database Management Systems', 4, 'CSE'),
  ('CSE208', 'OOP with Java', 4, 'CSE'),
  ('MNG101', 'Principles of Management', 4, 'CSE')
ON CONFLICT (course_code) DO NOTHING;

-- Insert Rooms
INSERT INTO room (room_capacity, building)
VALUES
  (120, 'CSE 231'),
  (120, 'CSE 232'),
  (60, 'CSE 233'),
  (60, 'CSE 234'),
  (120, 'CSE 125'),
  (120, 'CSE 126')
ON CONFLICT DO NOTHING;

-- Insert Invigilators
INSERT INTO invigilator (name, designation)
VALUES
  ('Dr. Ananya Mehta', 'Assistant Professor'),
  ('Dr. Rohit Sharma', 'Associate Professor'),
  ('Prof. Kavita Khanna', 'Lecturer'),
  ('Dr. Taniya Seth', 'Professor'),
  ('Prof. Nisha Thomas', 'Senior Lecturer')
ON CONFLICT DO NOTHING;

-- Get course IDs for exams
DO $$
DECLARE
  cse210_id uuid;
  mth216_id uuid;
  cse237_id uuid;
  cse208_id uuid;
  mng101_id uuid;
BEGIN
  SELECT id INTO cse210_id FROM course WHERE course_code = 'CSE210';
  SELECT id INTO mth216_id FROM course WHERE course_code = 'MTH216';
  SELECT id INTO cse237_id FROM course WHERE course_code = 'CSE237';
  SELECT id INTO cse208_id FROM course WHERE course_code = 'CSE208';
  SELECT id INTO mng101_id FROM course WHERE course_code = 'MNG101';

  -- CSE210 Exams
  INSERT INTO exam (course_id, exam_type, exam_date, max_marks) VALUES
    (cse210_id, 'Quiz 1', '2025-02-20', 20),
    (cse210_id, 'Midsem', '2025-03-10', 30),
    (cse210_id, 'Quiz 2', '2025-04-20', 20),
    (cse210_id, 'Endsem', '2025-05-05', 70);

  -- MTH216 Exams
  INSERT INTO exam (course_id, exam_type, exam_date, max_marks) VALUES
    (mth216_id, 'Quiz 1', '2025-02-21', 20),
    (mth216_id, 'Midsem', '2025-03-12', 30),
    (mth216_id, 'Quiz 2', '2025-04-21', 20),
    (mth216_id, 'Endsem', '2025-05-07', 70);

  -- CSE237 Exams
  INSERT INTO exam (course_id, exam_type, exam_date, max_marks) VALUES
    (cse237_id, 'Quiz 1', '2025-02-22', 20),
    (cse237_id, 'Midsem', '2025-03-14', 30),
    (cse237_id, 'Quiz 2', '2025-04-22', 20),
    (cse237_id, 'Endsem', '2025-05-09', 70);

  -- CSE208 Exams
  INSERT INTO exam (course_id, exam_type, exam_date, max_marks) VALUES
    (cse208_id, 'Quiz 1', '2025-02-23', 20),
    (cse208_id, 'Midsem', '2025-03-16', 30),
    (cse208_id, 'Quiz 2', '2025-04-23', 20),
    (cse208_id, 'Endsem', '2025-05-11', 70);

  -- MNG101 Exams
  INSERT INTO exam (course_id, exam_type, exam_date, max_marks) VALUES
    (mng101_id, 'Quiz 1', '2025-02-24', 20),
    (mng101_id, 'Midsem', '2025-03-18', 30),
    (mng101_id, 'Quiz 2', '2025-04-24', 20),
    (mng101_id, 'Endsem', '2025-05-13', 70);
END $$;

-- Insert Enrollments
INSERT INTO enrollment (student_id, course_id, year, status)
SELECT s.id, c.id, 2025, 'Active'
FROM student s
CROSS JOIN course c
ON CONFLICT (student_id, course_id, year) DO NOTHING;