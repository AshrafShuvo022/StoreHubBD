"""add facebook_page to sellers

Revision ID: d6e7f8a9b0c1
Revises: c4d5e6f7a8b9
Create Date: 2026-03-29

"""
from alembic import op
import sqlalchemy as sa

revision = 'd6e7f8a9b0c1'
down_revision = 'c4d5e6f7a8b9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('sellers',
        sa.Column('facebook_page', sa.String(100), nullable=True)
    )


def downgrade() -> None:
    op.drop_column('sellers', 'facebook_page')
