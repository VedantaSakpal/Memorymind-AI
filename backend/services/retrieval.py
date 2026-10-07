import uuid
from typing import List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from backend.services.embeddings import generate_embedding
from backend.models.document import DocumentChunk
from loguru import logger

async def get_relevant_chunks(
    db: AsyncSession,
    user_id: uuid.UUID,
    query: str,
    document_id: Optional[uuid.UUID] = None,
    match_count: int = 5,
    match_threshold: float = 0.5
) -> List[Dict]:
    # 1. Embed query
    logger.info(f"[CHAT] Generating query embedding for user {user_id}...")
    query_embedding = generate_embedding(query)
    logger.info(f"[CHAT] Query embedding generated (dim: {len(query_embedding)})")
    
    # 2. Query DB with cosine distance
    logger.info(f"[CHAT] Searching vectors...")
    
    # Calculate similarity as 1 - cosine_distance
    # Less distance = more similarity. pgvector operator is `<=>` for cosine distance
    similarity_col = (1 - DocumentChunk.embedding.cosine_distance(query_embedding)).label("similarity")
    
    conditions = [DocumentChunk.user_id == user_id]
    if document_id:
        conditions.append(DocumentChunk.document_id == document_id)
        
    stmt = (
        select(DocumentChunk, similarity_col)
        .where(and_(*conditions))
        .where(DocumentChunk.embedding.cosine_distance(query_embedding) < (1 - match_threshold))
        .order_by(DocumentChunk.embedding.cosine_distance(query_embedding))
        .limit(match_count)
    )
    
    result = await db.execute(stmt)
    rows = result.all()
    
    logger.info(f"[CHAT] Retrieved {len(rows)} chunks")
    for i, row in enumerate(rows):
        logger.info(f"[CHAT] Chunk {i+1} similarity: {row.similarity:.4f}")
    
    return [
        {
            "id": str(row.DocumentChunk.id),
            "document_id": str(row.DocumentChunk.document_id),
            "content": row.DocumentChunk.content,
            "similarity": row.similarity
        }
        for row in rows
    ]
