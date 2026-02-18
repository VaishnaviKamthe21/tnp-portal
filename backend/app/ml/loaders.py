# app/ml/loaders.py
import os
import pickle
import shap

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")   

def load_pickle(filename):
    path = os.path.join(MODEL_DIR, filename)
    print("📦 Loading:", path)

    if not os.path.exists(path):
        raise FileNotFoundError(f"❌ File not found: {path}")

    with open(path, "rb") as f:
        return pickle.load(f)

placement_model = load_pickle("xgboost_placement_model.pkl")
FEATURE_NAMES = load_pickle("feature_names.pkl")
shap_explainer = shap.TreeExplainer(placement_model)

print("✅ All ML artifacts loaded successfully")
