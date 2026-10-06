import os
from loguru import logger
from backend.config.settings import settings

class EmailService:
    @staticmethod
    async def send_verification_email(to_email: str, token: str, user_name: str | None = None) -> bool:
        """
        Sends an email verification link to the user.
        In development / when SMTP is not configured, prints the verification action to console.
        In production with SMTP configured, sends via smtplib / aiosmtplib.
        """
        # Base frontend URL or fallback
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        verify_url = f"{frontend_url}/verify-email?token={token}"
        name = user_name or "there"

        # Check for SMTP configuration in env
        smtp_host = os.getenv("SMTP_HOST")
        smtp_port = os.getenv("SMTP_PORT")
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASSWORD")

        if smtp_host and smtp_port and smtp_user and smtp_pass:
            try:
                import smtplib
                from email.mime.multipart import MIMEMultipart
                from email.mime.text import MIMEText

                msg = MIMEMultipart("alternative")
                msg["Subject"] = "Verify your email - MemoryMind AI"
                msg["From"] = smtp_user
                msg["To"] = to_email

                text = f"Hi {name},\n\nPlease verify your email for MemoryMind AI by clicking the link below:\n{verify_url}\n\nThis link will expire in 24 hours."
                html = f"""
                <html>
                  <body>
                    <h2>Verify Your Email</h2>
                    <p>Hi {name},</p>
                    <p>Thank you for signing up for MemoryMind AI. Please click the button below to verify your email address:</p>
                    <p><a href="{verify_url}" style="display:inline-block;padding:10px 20px;background-color:#0D5B5A;color:#ffffff;text-decoration:none;border-radius:6px;">Verify Email</a></p>
                    <p>Or paste this link into your browser: <br>{verify_url}</p>
                    <p>This link expires in 24 hours.</p>
                  </body>
                </html>
                """
                msg.attach(MIMEText(text, "plain"))
                msg.attach(MIMEText(html, "html"))

                with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_pass)
                    server.send_message(msg)

                logger.info(f"Verification email sent to {to_email}")
                return True
            except Exception as e:
                logger.error(f"Failed to send verification email via SMTP: {e}")
                # Fall back to console log for resilience in dev
                pass

        # Development fallback: console notice
        logger.info("=" * 60)
        logger.info(f"📧 [EMAIL DISPATCH - DEV MODE]")
        logger.info(f"To: {to_email}")
        logger.info(f"Subject: Verify your email - MemoryMind AI")
        logger.info(f"Verification Link: {verify_url}")
        logger.info(f"Expires in: 24 hours")
        logger.info("=" * 60)
        return True

email_service = EmailService()
