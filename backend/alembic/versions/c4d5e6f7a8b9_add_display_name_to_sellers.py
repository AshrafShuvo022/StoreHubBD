"""add display_name to sellers

Revision ID: c4d5e6f7a8b9
Revises: b3c4d5e6f7a8
Create Date: 2026-03-26

"""
from alembic import op
import sqlalchemy as sa

revision = 'c4d5e6f7a8b9'
down_revision = 'b3c4d5e6f7a8'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('sellers',
        sa.Column('display_name', sa.String(150), nullable=True)
    )


def downgrade() -> None:
    op.drop_column('sellers', 'display_name')
