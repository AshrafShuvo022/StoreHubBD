"""add slug to products

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-03-29

"""
import re
import sqlalchemy as sa
from alembic import op

revision = 'b2c3d4e5f6a7'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-') or 'product'


def upgrade() -> None:
    op.add_column('products', sa.Column('slug', sa.String(300), nullable=True))

    conn = op.get_bind()
    products = conn.execute(
        sa.text("SELECT id, seller_id, name FROM products ORDER BY created_at ASC")
    ).fetchall()

    # Track used slugs per seller to handle duplicates
    used: dict[tuple, int] = {}

    for product in products:
        base = _slugify(product.name)
        key = (str(product.seller_id), base)
        count = used.get(key, 0)
        used[key] = count + 1
        final_slug = base if count == 0 else f"{base}-{count + 1}"
        conn.execute(
            sa.text("UPDATE products SET slug = :slug WHERE id = :id"),
            {"slug": final_slug, "id": str(product.id)},
        )

    op.alter_column('products', 'slug', nullable=False)
    op.create_unique_constraint('uq_products_seller_slug', 'products', ['seller_id', 'slug'])


def downgrade() -> None:
    op.drop_constraint('uq_products_seller_slug', 'products', type_='unique')
    op.drop_column('products', 'slug')
