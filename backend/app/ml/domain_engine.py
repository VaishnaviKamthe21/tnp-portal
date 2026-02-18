from .domain_registry import DOMAIN_REGISTRY


def normalize_skill_text(skill_text: str):
    if not skill_text:
        return set()

    return set(
        skill.strip().lower()
        for skill in skill_text.split(",")
    )


def determine_readiness(score: float):
    if score >= 0.75:
        return "Industry Ready"
    elif score >= 0.5:
        return "Moderately Ready"
    elif score >= 0.3:
        return "Needs Improvement"
    else:
        return "Beginner Level"


def compute_domain_alignment(student_skills: str):

    skill_list = normalize_skill_text(student_skills)

    best_domain = None
    best_score = 0
    best_data = None

    for domain_name, categories in DOMAIN_REGISTRY.items():

        earned = 0
        total = 0

        matched = {"core": [], "advanced": [], "trending": []}
        missing = {"core": [], "advanced": [], "trending": []}

        for category, skills in categories.items():

            weight = 3 if category == "core" else 2 if category == "advanced" else 1

            for skill in skills:
                total += weight

                if skill.lower() in skill_list:
                    earned += weight
                    matched[category].append(skill)
                else:
                    missing[category].append(skill)

        score = round(earned / total, 3) if total else 0

        if score > best_score:
            best_score = score
            best_domain = domain_name
            best_data = {
                "matched": matched,
                "missing": missing,
                "score": score
            }

    readiness = determine_readiness(best_score)

    return {
        "domain": best_domain,
        "alignment_score": best_score,
        "readiness_level": readiness,
        "matched_skills": best_data["matched"],
        "missing_skills": best_data["missing"]
    }
