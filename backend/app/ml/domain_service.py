from .domain_engine import compute_domain_alignment


def get_domain_advisory(student):

    # If internship_domain exists → use it
    if student.internship_domain:
        domain_hint = student.internship_domain
    else:
        domain_hint = None

    advisory = compute_domain_alignment(student.skills)

    return advisory
