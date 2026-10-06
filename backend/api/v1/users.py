import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.v1.auth import get_current_user
from backend.dependencies.database import get_db
from backend.models.user import User, UserSettings
from backend.schemas.user import UserRead, UserUpdate, UserSettingsRead, UserSettingsUpdate

router = APIRouter()


# ─── GET /users/me ────────────────────────────────────────────────────────────

@router.get("/me", response_model=UserRead)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get the current user's full profile."""
    return current_user


# ─── PATCH /users/me ──────────────────────────────────────────────────────────

@router.patch("/me", response_model=UserRead)
async def update_my_profile(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update the current user's profile (name, avatar)."""
    if updates.full_name is not None:
        current_user.full_name = updates.full_name
    if updates.avatar_url is not None:
        current_user.avatar_url = updates.avatar_url
    await db.commit()
    await db.refresh(current_user)
    return current_user


# ─── GET /users/me/settings ───────────────────────────────────────────────────

@router.get("/me/settings", response_model=UserSettingsRead)
async def get_my_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the current user's app settings."""
    from sqlalchemy.future import select
    result = await db.execute(
        select(UserSettings).where(UserSettings.user_id == current_user.id)
    )
    settings_row = result.scalars().first()
    if not settings_row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Settings not found")
    return settings_row


# ─── PATCH /users/me/settings ─────────────────────────────────────────────────

@router.patch("/me/settings", response_model=UserSettingsRead)
async def update_my_settings(
    updates: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update the current user's app settings."""
    from sqlalchemy.future import select
    result = await db.execute(
        select(UserSettings).where(UserSettings.user_id == current_user.id)
    )
    settings_row = result.scalars().first()
    if not settings_row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Settings not found")

    for field, value in updates.model_dump(exclude_none=True).items():
        setattr(settings_row, field, value)

    await db.commit()
    await db.refresh(settings_row)
    return settings_row
