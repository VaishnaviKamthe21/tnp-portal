def compute_match_score(student, job):
    score = 0.0

    # -----------------------------
    # 1. CGPA Match (40%)
    # -----------------------------
    if student.cgpa and job.min_cgpa:
        if student.cgpa >= job.min_cgpa:
            score += 0.4

    # -----------------------------
    # 2. Skills Match (60%)
    # -----------------------------
    if student.skills and job.required_skills:
        student_skills = set(
            s.strip().lower() for s in student.skills.split(",")
        )
        job_skills = set(
            s.strip().lower() for s in job.required_skills.split(",")
        )

        overlap = len(student_skills.intersection(job_skills))

        if overlap > 0:
            score += 0.6 * (overlap / len(job_skills))

    return round(score, 2)
