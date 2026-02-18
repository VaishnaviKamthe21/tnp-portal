from sentence_transformers import SentenceTransformer

print("🔹 Loading SBERT once...")
sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
print("✅ SBERT loaded")
