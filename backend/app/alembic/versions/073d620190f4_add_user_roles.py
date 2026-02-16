"""Add user roles

Revision ID: 073d620190f4
Revises: 082f794c323f
Create Date: 2026-02-14 10:07:27.493494

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel 


# revision identifiers, used by Alembic.
revision: str = '073d620190f4'
down_revision: Union[str, Sequence[str], None] = '082f794c323f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create the enum type first
    user_role_enum = sa.Enum('USER', 'ADMIN', 'SUPER_ADMIN', name='userrole')
    user_role_enum.create(op.get_bind(), checkfirst=True)
    
    # Add the column with default value
    op.add_column('users', sa.Column('role', user_role_enum, nullable=False, server_default='USER'))
    
    # Remove server_default after adding (optional - keeps it clean)
    op.alter_column('users', 'role', server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop the column
    op.drop_column('users', 'role')
    
    # Drop the enum type
    sa.Enum(name='userrole').drop(op.get_bind(), checkfirst=True)