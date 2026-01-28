"""
Seed Script for TNP Portal
==========================

Run once to insert demo users, students, jobs, and applications.

Command:
    python -m app.seed
"""

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.models.student import StudentProfile
from app.models.job import Job
from app.models.application import Application
from app.utils.hashing import hash_password


def seed_database():
    db: Session = SessionLocal()

    print("\n🌱 Seeding database with demo data...\n")

    # ---------------------------------------------------
    # RESET DATABASE TABLES (Safe for demo)
    # ---------------------------------------------------
    db.query(Application).delete()
    db.query(StudentProfile).delete()
    db.query(Job).delete()
    db.query(User).delete()
    db.commit()

    # ---------------------------------------------------
    # ADMIN USER
    # ---------------------------------------------------
    admin_user = User(
        email="admin@test.com",
        password_hash=hash_password("admin123"),
        role="admin"
    )
    db.add(admin_user)
    db.commit()

    # ---------------------------------------------------
    # STUDENT USERS + STUDENT PROFILES
    # ---------------------------------------------------
    student_users = [
        User(
            email="vaishnavi@student.com",
            password_hash=hash_password("student123"),
            role="student"
        ),
        User(
            email="amit@student.com",
            password_hash=hash_password("student123"),
            role="student"
        ),
        User(
            email="sneha@student.com",
            password_hash=hash_password("student123"),
            role="student"
        ),
        User(
            email="rahul@student.com",
            password_hash=hash_password("student123"),
            role="student"
        ),
    ]

    db.add_all(student_users)
    db.commit()

    students = [
        StudentProfile(
            user_id=student_users[0].id,
            full_name="Vaishnavi Kamthe",
            department="CSE",
            batch_year=2026,
            cgpa=8.9,
            skills="python,ml,fastapi,sql",
            internships=1,
            coding_score=85,
            aptitude_score=80,
            resume_link="https://drive.google.com/demo_resume1",
            placed_status=False
        ),
        StudentProfile(
            user_id=student_users[1].id,
            full_name="Amit Sharma",
            department="IT",
            batch_year=2026,
            cgpa=7.8,
            skills="java,spring,dbms",
            internships=0,
            coding_score=70,
            aptitude_score=75,
            resume_link="https://drive.google.com/demo_resume2",
            placed_status=False
        ),
        StudentProfile(
            user_id=student_users[2].id,
            full_name="Sneha Patil",
            department="CSE",
            batch_year=2026,
            cgpa=9.2,
            skills="data science,python",
            internships=2,
            coding_score=92,
            aptitude_score=90,
            resume_link="https://drive.google.com/demo_resume3",
            placed_status=True
        ),
        StudentProfile(
            user_id=student_users[3].id,
            full_name="Rahul Verma",
            department="ENTC",
            batch_year=2026,
            cgpa=8.0,
            skills="iot,embedded,c++",
            internships=1,
            coding_score=78,
            aptitude_score=72,
            resume_link="https://drive.google.com/demo_resume4",
            placed_status=False
        ),
    ]

    db.add_all(students)
    db.commit()

    # ---------------------------------------------------
    # JOB POSTINGS
    # ---------------------------------------------------
    jobs = [
        Job(
            company="TCS",
            title="Software Developer",
            description="Backend role with Python + SQL",
            min_cgpa=7.5,
            required_skills="python,sql"
        ),
        Job(
            company="Infosys",
            title="Data Analyst",
            description="ML + Data Science role",
            min_cgpa=8.0,
            required_skills="python,ml,data science"
        ),
        Job(
            company="Wipro",
            title="IoT Engineer",
            description="Embedded + IoT Development",
            min_cgpa=7.0,
            required_skills="iot,c++,embedded"
        ),
    ]

    db.add_all(jobs)
    db.commit()

    # ---------------------------------------------------
    # APPLICATIONS (One-click Apply Demo)
    # ---------------------------------------------------
    applications = [
        Application(student_id=students[0].id, job_id=jobs[0].id),
        Application(student_id=students[1].id, job_id=jobs[1].id),
        Application(student_id=students[2].id, job_id=jobs[1].id),
        Application(student_id=students[3].id, job_id=jobs[2].id),
    ]


    db.add_all(applications)
    db.commit()

    db.close()

    # ---------------------------------------------------
    # DONE
    # ---------------------------------------------------
    print("✅ Database seeded successfully!\n")

    print("Demo Accounts:")
    print("Admin Login:")
    print("   Email: admin@test.com")
    print("   Pass : admin123\n")

    print("Student Logins:")
    print("   vaishnavi@student.com / student123")
    print("   amit@student.com      / student123")
    print("   sneha@student.com     / student123")
    print("   rahul@student.com     / student123\n")


if __name__ == "__main__":
    seed_database()
