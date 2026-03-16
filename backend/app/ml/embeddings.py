from sentence_transformers import SentenceTransformer

print("[ML] Loading SBERT...")
sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
print("[ML] SBERT loaded")
