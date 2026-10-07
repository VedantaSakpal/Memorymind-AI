# embeddings.py
try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    SentenceTransformer = None

import os
from backend.config.settings import settings

_model = None

def get_embedding_model():
    global _model
    if _model is None and SentenceTransformer is not None:
        model_name = settings.EMBEDDING_MODEL if hasattr(settings, "EMBEDDING_MODEL") else "all-MiniLM-L6-v2"
        _model = SentenceTransformer(model_name)
    return _model

def generate_embedding(text: str) -> list[float]:
    model = get_embedding_model()
    if not model:
        # Fallback for dev if sentence-transformers isn't installed yet
        return [0.0] * 384
    
    return model.encode(text).tolist()
