from app.ml.domain_engine import compute_domain_score, detect_best_domain


def get_student_domain_analysis(student):

    skills = student.skills or ""

    if student.internship_domain:
        domain_key = student.internship_domain.lower().replace(" ", "_")
        try:
            return compute_domain_score(skills, domain_key)
        except:
            return detect_best_domain(skills)
    else:
        return detect_best_domain(skills)
