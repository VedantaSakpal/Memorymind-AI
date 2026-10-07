import uuid
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.dependencies.database import get_db
from backend.api.v1.auth import get_current_user
from backend.models.user import User
from backend.models.document import Document
from backend.schemas.document import DocumentRead
from backend.services.document_service import process_document_background

# If you use Supabase storage, you would upload it there. 
# For now, we simulate storage and process it.

router = APIRouter()

@router.post("/upload", response_model=DocumentRead)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Create document record in DB
    new_doc = Document(
        user_id=current_user.id,
        name=file.filename,
        file_path=f"uploads/{current_user.id}/{file.filename}",
        status="processing"
    )
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)
    
    file_bytes = await file.read()
    
    # 2. Add to background tasks
    background_tasks.add_task(process_document_background, new_doc.id, file_bytes, file.filename)
    
    return new_doc

@router.get("/", response_model=List[DocumentRead])
async def get_documents(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Document).where(Document.user_id == current_user.id, Document.deleted_at == None)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.delete("/{document_id}")
async def delete_document(
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Document).where(Document.id == document_id, Document.user_id == current_user.id)
    result = await db.execute(stmt)
    document = result.scalar_one_or_none()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
        
    await db.delete(document)
    await db.commit()
    return {"success": True, "message": "Document deleted successfully"}
