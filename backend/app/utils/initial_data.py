from sqlmodel import Session, select
from app.core.db import engine
from app.models import User, UserRole
from app.core.config import settings
from uuid import uuid4

def init_db_and_create_admin():
    with Session(engine) as session:
        # Check if the admin user already exists
        admin_user = session.exec(select(User).where(User.email == settings.FIRST_SUPERUSER)).first()
        
        if not admin_user:
            # Create the admin user (without password - managed by Supabase)
            admin_user = User(
                email=settings.FIRST_SUPERUSER,
                full_name="Admin User",
                uuid=uuid4(),  # Generate a UUID
                is_active=True,
                role=UserRole.SUPER_ADMIN,
            )
            session.add(admin_user)
            session.commit()
            session.refresh(admin_user)
            
            print(f"✅ Admin user {admin_user.email} created with SUPER_ADMIN role.")
            # TODO: You must also create this user in Supabase Auth!
        else:
            # User exists - update their role to SUPER_ADMIN
            if admin_user.role != UserRole.SUPER_ADMIN:
                admin_user.role = UserRole.SUPER_ADMIN
                session.add(admin_user)
                session.commit()
                print(f"✅ Updated {admin_user.email} to SUPER_ADMIN role.")
            else:
                print(f"ℹ️  Admin user {admin_user.email} already exists with SUPER_ADMIN role.")
            
if __name__ == "__main__":
    init_db_and_create_admin()
