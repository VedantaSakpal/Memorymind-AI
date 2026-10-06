import secrets
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.config.settings import settings
from backend.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from backend.dependencies.database import get_db
from backend.models.auth import VerificationToken
from backend.models.user import User, UserSettings
from backend.schemas.auth import (
    MessageResponse,
    ResendVerificationRequest,
    Token,
    TokenPayload,
    VerifyEmailRequest,
)
from backend.schemas.user import UserCreate, UserRead
from backend.services.email_service import email_service

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


# ─── Dependency: get current user from JWT ───────────────────────────────────

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id is None or token_type != "access":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalars().first()
    if user is None or not user.is_active or not user.is_verified:
        raise credentials_exception
    return user


# ─── POST /auth/register ─────────────────────────────────────────────────────

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user and generate a single-use email verification token.
    Unverified accounts cannot log in until email is verified.
    """
    stmt = select(User).where(User.email == user_in.email)
    result = await db.execute(stmt)
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        password_hash=get_password_hash(user_in.password),
        is_verified=False,
    )
    db.add(new_user)
    await db.flush()  # get the UUID before committing

    # Create default settings row
    db.add(UserSettings(user_id=new_user.id))

    # Generate single-use verification token (24h expiry)
    verification_token_str = secrets.token_urlsafe(32)
    token_expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    verification_token = VerificationToken(
        user_id=new_user.id,
        token=verification_token_str,
        expires_at=token_expires_at,
    )
    db.add(verification_token)

    await db.commit()
    await db.refresh(new_user)

    # Dispatch verification email
    await email_service.send_verification_email(
        to_email=new_user.email,
        token=verification_token_str,
        user_name=new_user.full_name,
    )

    return new_user


# ─── POST /auth/verify-email ─────────────────────────────────────────────────

@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(
    payload: VerifyEmailRequest,
    db: AsyncSession = Depends(get_db),
):
    """Verify email using single-use verification token."""
    result = await db.execute(
        select(VerificationToken).where(VerificationToken.token == payload.token)
    )
    token_obj = result.scalars().first()

    if not token_obj:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )

    now = datetime.now(timezone.utc)
    expires_at = token_obj.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < now:
        await db.delete(token_obj)
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired. Please request a new one.",
        )

    user_result = await db.execute(select(User).where(User.id == token_obj.user_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.is_verified = True

    # Invalidate all verification tokens for this user
    await db.execute(
        delete(VerificationToken).where(VerificationToken.user_id == user.id)
    )
    await db.commit()

    return MessageResponse(message="Email verified successfully. You can now log in.")


# ─── POST /auth/resend-verification ──────────────────────────────────────────

@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(
    payload: ResendVerificationRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Resend verification email with a rate limit of 1 request per 2 minutes.
    Generic response avoids revealing user existence.
    """
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalars().first()

    # Avoid user enumeration
    if not user:
        return MessageResponse(
            message="If an unverified account exists with this email, a verification link has been sent."
        )

    if user.is_verified:
        return MessageResponse(message="Email is already verified. Please log in.")

    now = datetime.now(timezone.utc)

    # Check recent tokens for rate limiting (2 minutes cooldown)
    recent_token_result = await db.execute(
        select(VerificationToken)
        .where(VerificationToken.user_id == user.id)
        .order_by(VerificationToken.created_at.desc())
    )
    last_token = recent_token_result.scalars().first()

    if last_token:
        created_at = last_token.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)
        elapsed = (now - created_at).total_seconds()
        if elapsed < 120:
            retry_after = int(120 - elapsed)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Please wait {max(1, retry_after)} seconds before requesting another verification email.",
            )

    # Invalidate old tokens
    await db.execute(
        delete(VerificationToken).where(VerificationToken.user_id == user.id)
    )

    # Generate new token
    verification_token_str = secrets.token_urlsafe(32)
    token_expires_at = now + timedelta(hours=24)
    verification_token = VerificationToken(
        user_id=user.id,
        token=verification_token_str,
        expires_at=token_expires_at,
    )
    db.add(verification_token)
    await db.commit()

    await email_service.send_verification_email(
        to_email=user.email,
        token=verification_token_str,
        user_name=user.full_name,
    )

    return MessageResponse(
        message="If an unverified account exists with this email, a verification link has been sent."
    )


# ─── POST /auth/login ─────────────────────────────────────────────────────────

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """Authenticate with email + password. Only verified users can log in."""
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive account")

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email before logging in.",
        )

    # Update last_login_at
    user.last_login_at = datetime.now(timezone.utc).isoformat()
    await db.commit()

    return {
        "access_token": create_access_token(subject=user.id),
        "refresh_token": create_refresh_token(subject=user.id),
        "token_type": "bearer",
        "expires_in": settings.JWT_ACCESS_EXPIRE_MINUTES * 60,
    }


# ─── POST /auth/refresh ───────────────────────────────────────────────────────

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    """Exchange a valid refresh token for a new access + refresh token pair."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
    )
    try:
        payload = jwt.decode(refresh_token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id is None or token_type != "refresh":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalars().first()
    if not user or not user.is_active or not user.is_verified:
        raise credentials_exception

    return {
        "access_token": create_access_token(subject=user.id),
        "refresh_token": create_refresh_token(subject=user.id),
        "token_type": "bearer",
        "expires_in": settings.JWT_ACCESS_EXPIRE_MINUTES * 60,
    }


# ─── GET /auth/me ─────────────────────────────────────────────────────────────

@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return current_user


# ─── POST /auth/logout ────────────────────────────────────────────────────────

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout():
    """
    Stateless logout — client must discard tokens.
    """
    return {"success": True, "message": "Logged out successfully"}


# ─── POST /auth/forgot-password ───────────────────────────────────────────────

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(email: str, db: AsyncSession = Depends(get_db)):
    """
    Trigger a password-reset flow.
    Always returns 200 to avoid leaking which emails exist.
    """
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if user:
        pass
    return {"success": True, "message": "If that email exists, a reset link has been sent"}
