import uuid
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class MessageBase(BaseModel):
    role: str
    content: str

class MessageCreate(MessageBase):
    pass

class MessageRead(MessageBase):
    id: uuid.UUID
    session_id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ChatSessionCreate(BaseModel):
    document_id: Optional[uuid.UUID] = None
    title: str

class ChatSessionRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    document_id: Optional[uuid.UUID]
    title: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ChatRequest(BaseModel):
    session_id: uuid.UUID
    document_id: Optional[uuid.UUID] = None
    message: str
