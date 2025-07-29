Tech Stack:
  Backend: Django (Python)
  Frontend: 
  Database: Default Django DB (SQLite/PostgreSQL as needed)
  Email: For sending job alerts and matched-job mails to students

Apps and Their Roles:
  1. accounts
      Handles: User authentication (Admin, Student), profile info
      Models:
        User (extends AbstractUser)
        StudentProfile (linked with User via OneToOne)
      Features:
        Signup/login/logout
        Student profile data (skills, resume, etc.)
        Admin identification
      HTML: login.html, register.html, profile.html

  2. jobs
      Handles: Job postings
      Features:
        Admin can create jobs
        Admin can download CSV of applicants per job
        Students can see and apply to jobs
      HTML:
        job_list.html (visible to students)
        job_detail.html (students view job details + apply)
        job_form.html (admin adds job)
        admin_jobs.html (admin job management)
  3. notifications
      Handles:
        Sending emails to all students (on job post)
        Sending skill-matched job notifications (classification)
        No HTML/UI needed – fully automated 



Key Features Built / Decided:
 Student signup/login
 Job creation by admin
 Students apply with one click
 Export job-wise application CSVs (admin only)
 Skill-based email notification to matched students
 General job post email to all students
