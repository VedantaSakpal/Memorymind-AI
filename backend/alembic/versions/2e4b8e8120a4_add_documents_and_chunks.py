"""Add documents and chunks

Revision ID: 2e4b8e8120a4
Revises: f98bc9baed5c
Create Date: 2026-10-06 21:06:11.578350

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2e4b8e8120a4'
down_revision: Union[str, Sequence[str], None] = 'f98bc9baed5c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
