"""Create division ranking system

Revision ID: 67afe7b303a2
Revises: 073d620190f4
Create Date: 2026-02-14 18:47:48.220235

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel 
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '67afe7b303a2'
down_revision: Union[str, Sequence[str], None] = '073d620190f4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add columns with server_default='0' for existing rows
    op.add_column('crackmode_profiles', sa.Column('weekly_easy', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('crackmode_profiles', sa.Column('weekly_medium', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('crackmode_profiles', sa.Column('weekly_hard', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('crackmode_profiles', sa.Column('weekly_total', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('crackmode_profiles', sa.Column('weekly_stats_updated_at', sa.DateTime(), nullable=True))
    op.add_column('crackmode_profiles', sa.Column('monthly_easy', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('crackmode_profiles', sa.Column('monthly_medium', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('crackmode_profiles', sa.Column('monthly_hard', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('crackmode_profiles', sa.Column('monthly_total', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('crackmode_profiles', sa.Column('monthly_stats_updated_at', sa.DateTime(), nullable=True))
    op.add_column('crackmode_profiles', sa.Column('performance_score', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('crackmode_profiles', sa.Column('contest_ranking', sa.Integer(), nullable=True))
    
    # Remove server_default after adding (so new rows don't get it)
    op.alter_column('crackmode_profiles', 'weekly_easy', server_default=None)
    op.alter_column('crackmode_profiles', 'weekly_medium', server_default=None)
    op.alter_column('crackmode_profiles', 'weekly_hard', server_default=None)
    op.alter_column('crackmode_profiles', 'weekly_total', server_default=None)
    op.alter_column('crackmode_profiles', 'monthly_easy', server_default=None)
    op.alter_column('crackmode_profiles', 'monthly_medium', server_default=None)
    op.alter_column('crackmode_profiles', 'monthly_hard', server_default=None)
    op.alter_column('crackmode_profiles', 'monthly_total', server_default=None)
    op.alter_column('crackmode_profiles', 'performance_score', server_default=None)
    
    op.alter_column('crackmode_profiles', 'last_synced',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               type_=sa.DateTime(),
               nullable=True)
    op.alter_column('crackmode_profiles', 'created_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               type_=sa.DateTime(),
               existing_nullable=False)
    op.alter_column('crackmode_profiles', 'updated_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               type_=sa.DateTime(),
               existing_nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('crackmode_profiles', 'updated_at',
               existing_type=sa.DateTime(),
               type_=postgresql.TIMESTAMP(timezone=True),
               existing_nullable=False)
    op.alter_column('crackmode_profiles', 'created_at',
               existing_type=sa.DateTime(),
               type_=postgresql.TIMESTAMP(timezone=True),
               existing_nullable=False)
    op.alter_column('crackmode_profiles', 'last_synced',
               existing_type=sa.DateTime(),
               type_=postgresql.TIMESTAMP(timezone=True),
               nullable=False)
    op.drop_column('crackmode_profiles', 'contest_ranking')
    op.drop_column('crackmode_profiles', 'performance_score')
    op.drop_column('crackmode_profiles', 'monthly_stats_updated_at')
    op.drop_column('crackmode_profiles', 'monthly_total')
    op.drop_column('crackmode_profiles', 'monthly_hard')
    op.drop_column('crackmode_profiles', 'monthly_medium')
    op.drop_column('crackmode_profiles', 'monthly_easy')
    op.drop_column('crackmode_profiles', 'weekly_stats_updated_at')
    op.drop_column('crackmode_profiles', 'weekly_total')
    op.drop_column('crackmode_profiles', 'weekly_hard')
    op.drop_column('crackmode_profiles', 'weekly_medium')
    op.drop_column('crackmode_profiles', 'weekly_easy')