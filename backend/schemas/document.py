import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class DocumentBase(BaseModel):
    name: str

class DocumentCreate(DocumentBase):
    file_path: str

class DocumentRead(DocumentBase):
    id: uuid.UUID
    user_id: uuid.UUID
    file_path: str
    status: str
    error_message: Optional[str]
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
