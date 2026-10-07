from typing import List

def chunk_text(text: str, max_tokens: int = 800, overlap: int = 100) -> List[str]:
    # Extremely basic word-based chunker for now. 
    # In production, use tiktoken or LangChain's RecursiveCharacterTextSplitter
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk_words = words[i:i + max_tokens]
        chunks.append(" ".join(chunk_words))
        i += max_tokens - overlap
        if i >= len(words) - overlap:  # Avoid infinite loop or tiny tail chunks
            break
    return chunks
