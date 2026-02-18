# app/ml/test.py

from app.database import SessionLocal
from app.models.student import StudentProfile
from app.ml.predictors import predict_placement_probability
from app.ml.explainer import explain_student


def run_test():
    db = SessionLocal()

    student = db.query(StudentProfile).first()

    print("Testing student:", student.full_name)

    prob = predict_placement_probability(student)
    print("Placement Probability:", prob)

    explanation = explain_student(student)

    print("\nTop SHAP Contributors:")
    for item in explanation:
        print(item)


if __name__ == "__main__":
    run_test()
