"""
Seed script for TNP Portal
Run using:
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
    print("\n🌱 Seeding database with demo data...\n")

    db: Session = SessionLocal()

    try:
        # ------------------------
        # Clear existing data
        # ------------------------
        db.query(Application).delete()
        db.query(StudentProfile).delete()
        db.query(Job).delete()
        db.query(User).delete()
        db.commit()

        # ------------------------
        # Create Admin
        # ------------------------
        admin = User(
            email="admin@test.com",
            password_hash=hash_password("admin123"),
            role="admin"
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

        # ------------------------
        # Create Students (Users)
        # ------------------------
        student_users = [
            ("vaishnavi@student.com", "Vaishnavi Kamthe"),
            ("amit@student.com", "Amit Sharma"),
            ("sneha@student.com", "Sneha Patil"),
            ("rahul@student.com", "Rahul Verma"),
        ]

        students = []

        for email, name in student_users:
            user = User(
                email=email,
                password_hash=hash_password("student123"),
                role="student"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            students.append((user, name))

        # ------------------------
        # Create Student Profiles
        # ------------------------
        profiles = [
            StudentProfile(
                user_id=students[0][0].id,
                full_name="Vaishnavi Kamthe",
                department="CSE",
                batch_year=2026,
                age=22,
                cgpa=8.9,
                backlogs=0,
                attendance=85,
                sem1_gpa=8.5,
                sem2_gpa=8.7,
                sem3_gpa=8.8,
                sem4_gpa=8.9,
                skills="python,ml,fastapi,sql",
                clubs="coding club,ai club",
                internships=1,
                internship_domain="Data Science",
                placement_domain="Data Analyst",
                coding_score=80,
                aptitude_score=85,
                resume_link="https://drive.google.com/demo_resume1",
                placed_status=False
            ),
            StudentProfile(
                user_id=students[1][0].id,
                full_name="Amit Sharma",
                department="IT",
                batch_year=2026,
                age=23,
                cgpa=7.8,
                backlogs=1,
                attendance=78,
                sem1_gpa=7.2,
                sem2_gpa=7.5,
                sem3_gpa=7.7,
                skills="java,spring,dbms",
                clubs="tech club",
                internships=0,
                internship_domain=None,
                placement_domain=None,
                coding_score=70,
                aptitude_score=75,
                resume_link="https://drive.google.com/demo_resume2",
                placed_status=False
            ),
            StudentProfile(
                user_id=students[2][0].id,
                full_name="Sneha Patil",
                department="CSE",
                batch_year=2026,
                age=22,
                cgpa=9.2,
                backlogs=0,
                attendance=92,
                sem1_gpa=9.0,
                sem2_gpa=9.1,
                sem3_gpa=9.3,
                sem4_gpa=9.2,
                skills="data science,python",
                clubs="ai club,math club",
                internships=2,
                internship_domain="Data Science",
                placement_domain="Data Scientist",
                coding_score=90,
                aptitude_score=92,
                resume_link="https://drive.google.com/demo_resume3",
                placed_status=True
            ),
            StudentProfile(
                user_id=students[3][0].id,
                full_name="Rahul Verma",
                department="ENTC",
                batch_year=2026,
                age=23,
                cgpa=8.0,
                backlogs=0,
                attendance=80,
                sem1_gpa=7.8,
                sem2_gpa=8.0,
                sem3_gpa=8.1,
                skills="iot,embedded,c++",
                clubs="robotics club",
                internships=1,
                internship_domain="Embedded Systems",
                placement_domain=None,
                coding_score=78,
                aptitude_score=72,
                resume_link="https://drive.google.com/demo_resume4",
                placed_status=False
            ),
        ]

        db.add_all(profiles)
        db.commit()

        # ------------------------
        # Create Jobs
        # ------------------------
        jobs = [
            Job(
                company="TCS",
                title="Data Analyst",
                description="Analytics, SQL, Python",
                min_cgpa=7.5,
                required_skills="python,sql,data analysis"
            ),
            Job(
                company="Infosys",
                title="Backend Developer",
                description="Java, Spring Boot, REST APIs",
                min_cgpa=7.0,
                required_skills="java,spring,rest"
            ),
        ]

        db.add_all(jobs)
        db.commit()

        # ------------------------
        # Create Applications
        # ------------------------
        applications = [
            Application(student_id=profiles[0].id, job_id=jobs[0].id),
            Application(student_id=profiles[1].id, job_id=jobs[1].id),
        ]

        db.add_all(applications)
        db.commit()

        # ------------------------
        # Done
        # ------------------------
        print("✅ Database seeded successfully!\n")

        print("Demo Accounts:")
        print("Admin Login:")
        print("   Email: admin@test.com")
        print("   Pass : admin123\n")

        print("Student Logins:")
        for email, _ in student_users:
            print(f"   {email} / student123")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
