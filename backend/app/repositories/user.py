from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import User


def list_users(db: Session) -> list[User]:
	stmt = select(User).order_by(User.id)
	return list(db.scalars(stmt).all())

def get_user_by_id(db: Session, user_id: int) -> User | None:
	return db.get(User, user_id)

def get_user_by_login(
	db: Session,
	login: str,
) -> User | None:
	return db.scalar(select(User).where(User.login == login))

def set_user_enabled(db: Session, user: User, is_enabled: bool) -> User:
	user.is_enabled = is_enabled
	db.commit()
	db.refresh(user)
	return user