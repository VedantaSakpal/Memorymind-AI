"""Add verification token table

Revision ID: f98bc9baed5c
Revises: 
Create Date: 2026-09-11 19:39:00.583626

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f98bc9baed5c'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'verification_tokens',
        sa.Column('id', sa.UUID(), nullable=False, primary_key=True),
        sa.Column('user_id', sa.UUID(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('token', sa.String(), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_verification_tokens_user_id', 'verification_tokens', ['user_id'])
    op.create_index('ix_verification_tokens_token', 'verification_tokens', ['token'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_verification_tokens_token', table_name='verification_tokens')
    op.drop_index('ix_verification_tokens_user_id', table_name='verification_tokens')
    op.drop_table('verification_tokens')
