from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.dependencies.database import get_db
from backend.api.v1.auth import get_current_user
from backend.models.user import User
from backend.models.chat import ChatSession, Message
from backend.schemas.chat import ChatRequest, ChatSessionCreate, ChatSessionRead
from backend.services.retrieval import get_relevant_chunks
from backend.services.llm import stream_rag_answer

router = APIRouter()

@router.post("/session", response_model=ChatSessionRead)
async def create_chat_session(
    request: ChatSessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_session = ChatSession(
        user_id=current_user.id,
        document_id=request.document_id,
        title=request.title
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    return new_session

@router.post("/")
async def chat_endpoint(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify session
    session_result = await db.execute(select(ChatSession).where(ChatSession.id == request.session_id, ChatSession.user_id == current_user.id))
    chat_session = session_result.scalars().first()
    if not chat_session:
        raise HTTPException(status_code=404, detail="Chat session not found")

    # Save user message
    user_msg = Message(session_id=chat_session.id, role="user", content=request.message)
    db.add(user_msg)
    await db.commit()

    # Get recent chat history
    msg_result = await db.execute(
        select(Message)
        .where(Message.session_id == chat_session.id)
        .order_by(Message.created_at.asc())
    )
    history_msgs = msg_result.scalars().all()
    # exclude the one we just added, keep last 10
    history = [{"role": m.role, "content": m.content} for m in history_msgs[:-1]][-10:]

    # Retrieve context
    chunks = await get_relevant_chunks(
        db=db,
        user_id=current_user.id,
        query=request.message,
        document_id=request.document_id
    )

    async def event_stream():
        full_response = ""
        # Use SSE format
        async for chunk_text in stream_rag_answer(request.message, chunks, history):
            full_response += chunk_text
            # Replace newlines for valid SSE
            safe_text = chunk_text.replace("\n", "\\n")
            yield f"data: {safe_text}\n\n"
        
        # Save assistant message to DB after streaming is done
        assistant_msg = Message(session_id=chat_session.id, role="assistant", content=full_response)
        db.add(assistant_msg)
        await db.commit()
        
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
