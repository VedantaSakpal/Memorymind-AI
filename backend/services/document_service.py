import uuid
from loguru import logger
from backend.services.parser import parse_file
from backend.services.chunker import chunk_text
from backend.services.embeddings import generate_embedding
from backend.models.document import Document, DocumentChunk
from backend.core.database import async_session_maker

async def process_document_background(doc_id: uuid.UUID, file_bytes: bytes, filename: str):
    logger.info(f"Starting background processing for document {doc_id}")
    
    async with async_session_maker() as db:
        try:
            # 1. Parse text
            text = parse_file(file_bytes, filename)
            if not text.strip():
                raise ValueError("No extractable text found in document.")
            
            # 2. Chunk text
            chunks = chunk_text(text)
            
            # 3. Embed & store
            for i, chunk_content in enumerate(chunks):
                embedding = generate_embedding(chunk_content)
                
                # Fetch user_id from doc to attach to chunk
                doc = await db.get(Document, doc_id)
                if not doc:
                    return
                
                new_chunk = DocumentChunk(
                    document_id=doc_id,
                    user_id=doc.user_id,
                    content=chunk_content,
                    page_number=1, # simplified for now
                    embedding=embedding
                )
                db.add(new_chunk)
            
            # 4. Update status
            doc = await db.get(Document, doc_id)
            doc.status = "ready"
            await db.commit()
            
            logger.info(f"Successfully processed document {doc_id} into {len(chunks)} chunks.")
            
        except Exception as e:
            logger.error(f"Error processing document {doc_id}: {str(e)}")
            doc = await db.get(Document, doc_id)
            if doc:
                doc.status = "failed"
                doc.error_message = str(e)
                await db.commit()
