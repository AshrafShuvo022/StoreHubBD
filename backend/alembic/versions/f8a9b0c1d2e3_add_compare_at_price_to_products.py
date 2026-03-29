"""add compare_at_price to products

Revision ID: f8a9b0c1d2e3
Revises: e7f8a9b0c1d2
Create Date: 2026-03-29

"""
from alembic import op
import sqlalchemy as sa

revision = 'f8a9b0c1d2e3'
down_revision = 'e7f8a9b0c1d2'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('products',
        sa.Column('compare_at_price', sa.Numeric(10, 2), nullable=True)
    )


def downgrade() -> None:
    op.drop_column('products', 'compare_at_price')
