"""add store sections to sellers

Revision ID: a1b2c3d4e5f6
Revises: f8a9b0c1d2e3
Create Date: 2026-03-29

"""
from alembic import op
import sqlalchemy as sa

revision = 'a1b2c3d4e5f6'
down_revision = 'f8a9b0c1d2e3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('sellers',
        sa.Column('show_best_sellers', sa.Boolean(), nullable=False, server_default='true')
    )
    op.add_column('sellers',
        sa.Column('show_new_arrivals', sa.Boolean(), nullable=False, server_default='true')
    )


def downgrade() -> None:
    op.drop_column('sellers', 'show_new_arrivals')
    op.drop_column('sellers', 'show_best_sellers')
