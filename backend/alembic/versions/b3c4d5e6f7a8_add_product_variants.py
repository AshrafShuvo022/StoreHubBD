"""add product variants

Revision ID: b3c4d5e6f7a8
Revises: 82864b354820
Create Date: 2026-03-15

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'b3c4d5e6f7a8'
down_revision = '82864b354820'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add has_variants to products
    op.add_column('products',
        sa.Column('has_variants', sa.Boolean(), nullable=False, server_default='false')
    )

    # Create product_variants table
    op.create_table(
        'product_variants',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('product_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('label', sa.String(200), nullable=False),
        sa.Column('price', sa.Numeric(10, 2), nullable=False),
        sa.Column('is_available', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
    )
    op.create_index('ix_product_variants_product_id', 'product_variants', ['product_id'])

    # Add variant fields to order_items
    op.add_column('order_items',
        sa.Column('variant_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('product_variants.id', ondelete='SET NULL'), nullable=True)
    )
    op.add_column('order_items',
        sa.Column('variant_label', sa.String(200), nullable=True)
    )


def downgrade() -> None:
    op.drop_column('order_items', 'variant_label')
    op.drop_column('order_items', 'variant_id')
    op.drop_index('ix_product_variants_product_id', 'product_variants')
    op.drop_table('product_variants')
    op.drop_column('products', 'has_variants')
