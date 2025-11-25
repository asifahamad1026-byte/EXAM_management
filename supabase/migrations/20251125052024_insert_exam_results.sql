/*
  # Insert Exam Results for All Students

  Results follow a consistent pattern:
  - Madhav Kathuria: Best performer (A grades)
  - Saumya Parashar: Second (mostly A)
  - Deepshika Kushwaha: Third (B+ range)
  - Rabiya Khan: Fourth (B range)
  - Asif Ahmed: Fifth (B/C range)
*/

DO $$
DECLARE
  madhav_id uuid;
  saumya_id uuid;
  deepshika_id uuid;
  rabiya_id uuid;
  asif_id uuid;
  
  cse210_q1_id uuid;
  cse210_mid_id uuid;
  cse210_q2_id uuid;
  cse210_end_id uuid;
BEGIN
  -- Get student IDs
  SELECT id INTO madhav_id FROM student WHERE roll_no = 'SAU/CS/BTECH(CSE)/2024/1';
  SELECT id INTO saumya_id FROM student WHERE roll_no = 'SAU/CS/BTECH(CSE)/2024/5';
  SELECT id INTO deepshika_id FROM student WHERE roll_no = 'SAU/CS/BTECH(CSE)/2024/2';
  SELECT id INTO rabiya_id FROM student WHERE roll_no = 'SAU/CS/BTECH(CSE)/2024/3';
  SELECT id INTO asif_id FROM student WHERE roll_no = 'SAU/CS/BTECH(CSE)/2024/4';

  -- Get exam IDs for CSE210
  SELECT id INTO cse210_q1_id FROM exam 
  WHERE exam_type = 'Quiz 1' AND course_id = (SELECT id FROM course WHERE course_code = 'CSE210');
  SELECT id INTO cse210_mid_id FROM exam 
  WHERE exam_type = 'Midsem' AND course_id = (SELECT id FROM course WHERE course_code = 'CSE210');
  SELECT id INTO cse210_q2_id FROM exam 
  WHERE exam_type = 'Quiz 2' AND course_id = (SELECT id FROM course WHERE course_code = 'CSE210');
  SELECT id INTO cse210_end_id FROM exam 
  WHERE exam_type = 'Endsem' AND course_id = (SELECT id FROM course WHERE course_code = 'CSE210');

  -- CSE210 Results
  INSERT INTO result (student_id, exam_id, marks_obtained, grade) VALUES
    (madhav_id, cse210_q1_id, 18, 'A'),
    (saumya_id, cse210_q1_id, 16, 'A'),
    (deepshika_id, cse210_q1_id, 15, 'B'),
    (rabiya_id, cse210_q1_id, 14, 'B'),
    (asif_id, cse210_q1_id, 12, 'C'),
    
    (madhav_id, cse210_mid_id, 27, 'A'),
    (saumya_id, cse210_mid_id, 24, 'A'),
    (deepshika_id, cse210_mid_id, 22, 'B'),
    (rabiya_id, cse210_mid_id, 20, 'B'),
    (asif_id, cse210_mid_id, 18, 'C'),
    
    (madhav_id, cse210_q2_id, 19, 'A'),
    (saumya_id, cse210_q2_id, 17, 'A'),
    (deepshika_id, cse210_q2_id, 16, 'B'),
    (rabiya_id, cse210_q2_id, 14, 'B'),
    (asif_id, cse210_q2_id, 13, 'C'),
    
    (madhav_id, cse210_end_id, 62, 'A'),
    (saumya_id, cse210_end_id, 58, 'A'),
    (deepshika_id, cse210_end_id, 55, 'B'),
    (rabiya_id, cse210_end_id, 50, 'B'),
    (asif_id, cse210_end_id, 45, 'C')
  ON CONFLICT (student_id, exam_id) DO NOTHING;

END $$;