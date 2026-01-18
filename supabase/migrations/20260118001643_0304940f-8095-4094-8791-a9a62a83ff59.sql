-- First, delete departments from faculties we're replacing (not College of Health Sciences)
DELETE FROM departments WHERE faculty_id IN (
  SELECT id FROM faculties WHERE college_id IS NULL
);

-- Delete standalone faculties (not under College of Health Sciences)
DELETE FROM faculties WHERE college_id IS NULL;

-- Insert Faculty of Humanities and Social Sciences with departments
WITH new_faculty AS (
  INSERT INTO faculties (name, display_order) VALUES 
    ('Faculty of Humanities and Social Sciences', 1)
  RETURNING id
)
INSERT INTO departments (faculty_id, name, display_order) 
SELECT id, dept_name, dept_order FROM new_faculty, 
  (VALUES 
    ('Department of History and International Studies', 1),
    ('Department of Islamic Studies', 2),
    ('Department of Languages', 3),
    ('Department of Mass Communication', 4),
    ('Department of Political and Public Administration', 5),
    ('Department of Sociology', 6)
  ) AS depts(dept_name, dept_order);

-- Insert Faculty of Management Sciences with departments
WITH new_faculty AS (
  INSERT INTO faculties (name, display_order) VALUES 
    ('Faculty of Management Sciences', 2)
  RETURNING id
)
INSERT INTO departments (faculty_id, name, display_order) 
SELECT id, dept_name, dept_order FROM new_faculty, 
  (VALUES 
    ('Department of Accounting', 1),
    ('Department of Banking and Finance', 2),
    ('Department of Business Administration', 3),
    ('Department of Economics', 4)
  ) AS depts(dept_name, dept_order);

-- Insert Faculty of Education with departments
WITH new_faculty AS (
  INSERT INTO faculties (name, display_order) VALUES 
    ('Faculty of Education', 3)
  RETURNING id
)
INSERT INTO departments (faculty_id, name, display_order) 
SELECT id, dept_name, dept_order FROM new_faculty, 
  (VALUES 
    ('Department of Education Management and Counselling', 1),
    ('Department of Arts and Social Science Education', 2),
    ('Department of Science Education', 3)
  ) AS depts(dept_name, dept_order);

-- Insert Faculty of Natural and Applied Sciences with departments
WITH new_faculty AS (
  INSERT INTO faculties (name, display_order) VALUES 
    ('Faculty of Natural and Applied Sciences', 4)
  RETURNING id
)
INSERT INTO departments (faculty_id, name, display_order) 
SELECT id, dept_name, dept_order FROM new_faculty, 
  (VALUES 
    ('Department of Biological Sciences', 1),
    ('Department of Chemical and Geological Sciences', 2),
    ('Department of Physical Sciences', 3)
  ) AS depts(dept_name, dept_order);

-- Insert Faculty of Computing, Engineering and Technology with departments
WITH new_faculty AS (
  INSERT INTO faculties (name, display_order) VALUES 
    ('Faculty of Computing, Engineering and Technology', 5)
  RETURNING id
)
INSERT INTO departments (faculty_id, name, display_order) 
SELECT id, dept_name, dept_order FROM new_faculty, 
  (VALUES 
    ('Department of Computer Science', 1),
    ('Department of Data Science', 2)
  ) AS depts(dept_name, dept_order);

-- Insert Faculty of Law with departments
WITH new_faculty AS (
  INSERT INTO faculties (name, display_order) VALUES 
    ('Faculty of Law', 6)
  RETURNING id
)
INSERT INTO departments (faculty_id, name, display_order) 
SELECT id, dept_name, dept_order FROM new_faculty, 
  (VALUES 
    ('Department of Common Law', 1),
    ('Department of Common and Islamic Law', 2)
  ) AS depts(dept_name, dept_order);

-- Insert Faculty of Agriculture with department
WITH new_faculty AS (
  INSERT INTO faculties (name, display_order) VALUES 
    ('Faculty of Agriculture', 7)
  RETURNING id
)
INSERT INTO departments (faculty_id, name, display_order) 
SELECT id, dept_name, dept_order FROM new_faculty, 
  (VALUES 
    ('Department of Agriculture', 1)
  ) AS depts(dept_name, dept_order);