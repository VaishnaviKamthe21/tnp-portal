from app.ml.domain_registry import DOMAIN_REGISTRY


WEIGHTS = {
    "core": 3,
    "advanced": 2,
    "trending": 2.5
}


def clean_text(text):
    if not text:
        return ""
    return text.lower()


def compute_domain_score(student_skills: str, domain_key: str):

    student_skills = clean_text(student_skills)
    domain = DOMAIN_REGISTRY[domain_key]

    score = 0
    max_score = 0

    matched = {
        "core": [],
        "advanced": [],
        "trending": []
    }

    for level in ["core", "advanced", "trending"]:

        for skill in domain[level]:
            weight = WEIGHTS[level]
            max_score += weight

            if skill.lower() in student_skills:
                score += weight
                matched[level].append(skill)

    alignment = round(score / max_score, 3) if max_score > 0 else 0

    return {
        "domain": domain["label"],
        "alignment_score": alignment,
        "matched_skills": matched
    }

def detect_best_domain(student_skills: str):

    best_domain = None
    best_score = 0
    best_details = None

    for key in DOMAIN_REGISTRY.keys():
        result = compute_domain_score(student_skills, key)

        if result["alignment_score"] > best_score:
            best_score = result["alignment_score"]
            best_domain = key
            best_details = result

    return best_details
