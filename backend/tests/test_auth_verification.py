import uuid
import pytest
from datetime import datetime, timedelta, timezone
from httpx import AsyncClient, ASGITransport
from sqlalchemy import select, delete

from backend.main import app
from backend.models.user import User
from backend.models.auth import VerificationToken
from backend.core.database import async_session_maker


@pytest.mark.asyncio
async def test_password_strength_validation():
    """Weak passwords must be rejected at schema validation level."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Too short (< 8 chars)
        res = await client.post("/api/v1/auth/register", json={
            "email": "test_weak@example.com",
            "password": "Pass1!",
            "full_name": "Test User"
        })
        assert res.status_code == 422

        # No uppercase
        res = await client.post("/api/v1/auth/register", json={
            "email": "test_weak@example.com",
            "password": "password123!",
            "full_name": "Test User"
        })
        assert res.status_code == 422

        # No lowercase
        res = await client.post("/api/v1/auth/register", json={
            "email": "test_weak@example.com",
            "password": "PASSWORD123!",
            "full_name": "Test User"
        })
        assert res.status_code == 422

        # No number
        res = await client.post("/api/v1/auth/register", json={
            "email": "test_weak@example.com",
            "password": "Password!",
            "full_name": "Test User"
        })
        assert res.status_code == 422

        # No special character
        res = await client.post("/api/v1/auth/register", json={
            "email": "test_weak@example.com",
            "password": "Password123",
            "full_name": "Test User"
        })
        assert res.status_code == 422


@pytest.mark.asyncio
async def test_full_registration_verification_and_login_flow():
    """Test full cycle: register -> unverified login blocked -> verify email -> login allowed -> access me."""
    test_email = f"auth_test_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "SecurePassword123!"
    test_name = "Auth Tester"

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Register with strong password
        reg_res = await client.post("/api/v1/auth/register", json={
            "email": test_email,
            "password": test_password,
            "full_name": test_name
        })
        assert reg_res.status_code == 201
        user_data = reg_res.json()
        assert user_data["email"] == test_email
        assert user_data["is_verified"] is False
        assert "password" not in user_data
        assert "password_hash" not in user_data

        # 2. Try to login before verification -> Should return 403 Forbidden
        login_fail_res = await client.post("/api/v1/auth/login", data={
            "username": test_email,
            "password": test_password
        })
        assert login_fail_res.status_code == 403
        data = login_fail_res.json()
        detail = data.get("detail") or data.get("error", {}).get("detail", "")
        assert "Email not verified" in detail

        # 3. Retrieve verification token from database directly
        async with async_session_maker() as session:
            result = await session.execute(
                select(VerificationToken).join(User).where(User.email == test_email)
            )
            token_obj = result.scalars().first()
            assert token_obj is not None
            valid_token = token_obj.token

        # 4. Verify with an invalid token -> Should return 400 Bad Request
        invalid_verify_res = await client.post("/api/v1/auth/verify-email", json={"token": "non-existent-token"})
        assert invalid_verify_res.status_code == 400

        # 5. Verify with valid token -> Should return 200 OK
        verify_res = await client.post("/api/v1/auth/verify-email", json={"token": valid_token})
        assert verify_res.status_code == 200
        assert "Email verified successfully" in verify_res.json()["message"]

        # 6. Single-use check: reusing same token should fail with 400
        reuse_res = await client.post("/api/v1/auth/verify-email", json={"token": valid_token})
        assert reuse_res.status_code == 400

        # 7. Login after verification -> Should succeed and return JWT tokens
        login_success_res = await client.post("/api/v1/auth/login", data={
            "username": test_email,
            "password": test_password
        })
        assert login_success_res.status_code == 200
        tokens = login_success_res.json()
        assert "access_token" in tokens
        assert "refresh_token" in tokens
        access_token = tokens["access_token"]

        # 8. Access protected route with Bearer token
        me_res = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {access_token}"})
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data["email"] == test_email
        assert me_data["is_verified"] is True

        # Cleanup test user from db
        async with async_session_maker() as session:
            await session.execute(delete(User).where(User.email == test_email))
            await session.commit()


@pytest.mark.asyncio
async def test_resend_verification_and_rate_limiting():
    """Test resending verification email and rate limiting cooldown."""
    test_email = f"rate_limit_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "SecurePassword123!"

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Register unverified user
        reg_res = await client.post("/api/v1/auth/register", json={
            "email": test_email,
            "password": test_password,
            "full_name": "Rate Limit Test"
        })
        assert reg_res.status_code == 201

        # 2. Immediately call resend-verification -> Should return 429 Too Many Requests
        resend_res = await client.post("/api/v1/auth/resend-verification", json={"email": test_email})
        assert resend_res.status_code == 429
        data = resend_res.json()
        detail = data.get("detail") or data.get("error", {}).get("detail", "")
        assert "Please wait" in detail

        # Cleanup test user from db
        async with async_session_maker() as session:
            await session.execute(delete(User).where(User.email == test_email))
            await session.commit()


@pytest.mark.asyncio
async def test_expired_token_handling():
    """Expired token must be rejected with 400."""
    test_email = f"expired_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "SecurePassword123!"

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Register unverified user
        reg_res = await client.post("/api/v1/auth/register", json={
            "email": test_email,
            "password": test_password,
            "full_name": "Expired Test"
        })
        assert reg_res.status_code == 201

        # 2. Manually set token expires_at to past
        async with async_session_maker() as session:
            result = await session.execute(
                select(VerificationToken).join(User).where(User.email == test_email)
            )
            token_obj = result.scalars().first()
            assert token_obj is not None
            token_obj.expires_at = datetime.now(timezone.utc) - timedelta(hours=1)
            await session.commit()
            expired_token = token_obj.token

        # 3. Attempt verification with expired token -> Should return 400
        res = await client.post("/api/v1/auth/verify-email", json={"token": expired_token})
        assert res.status_code == 400
        data = res.json()
        detail = data.get("detail") or data.get("error", {}).get("detail", "")
        assert "expired" in detail.lower()

        # Cleanup test user
        async with async_session_maker() as session:
            await session.execute(delete(User).where(User.email == test_email))
            await session.commit()
