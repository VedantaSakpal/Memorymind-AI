"""Add vector extension

Revision ID: 0a614ab04daa
Revises: f98bc9baed5c
Create Date: 2026-10-07 22:59:23.320213

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0a614ab04daa'
down_revision: Union[str, Sequence[str], None] = 'f98bc9baed5c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute('CREATE EXTENSION IF NOT EXISTS vector;')


def downgrade() -> None:
    """Downgrade schema."""
    op.execute('DROP EXTENSION IF EXISTS vector;')
