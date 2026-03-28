"""add image_urls to products

Revision ID: e7f8a9b0c1d2
Revises: d6e7f8a9b0c1
Create Date: 2026-03-29

"""
from alembic import op
import sqlalchemy as sa

revision = 'e7f8a9b0c1d2'
down_revision = 'd6e7f8a9b0c1'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('products',
        sa.Column('image_urls', sa.Text, nullable=False, server_default='[]')
    )


def downgrade() -> None:
    op.drop_column('products', 'image_urls')
