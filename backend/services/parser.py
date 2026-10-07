import io
import fitz  # PyMuPDF
from docx import Document as DocxDocument

def parse_file(file_bytes: bytes, filename: str) -> str:
    """Extract text from PDF, DOCX, or TXT."""
    ext = filename.lower().split('.')[-1]
    
    if ext == 'pdf':
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text() + "\n"
            return text
        except Exception:
            pass # Fallback or error

    elif ext in ['doc', 'docx']:
        try:
            doc = DocxDocument(io.BytesIO(file_bytes))
            return "\n".join([para.text for para in doc.paragraphs])
        except Exception:
            pass

    elif ext == 'txt':
        return file_bytes.decode('utf-8', errors='ignore')

    return ""
