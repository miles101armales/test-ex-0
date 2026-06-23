import secrets
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.database.models import User

def exists_user_by_login_or_email(
	db: Session,
	login: str,
	email: str,
) -> bool:
	return db.scalar(
		select(User.id).where(or_(User.login == login, User.email == email))
	) is not None

def register_user(
	db: Session,
	login: str,
	email: str,
	hash_password: str,
) -> User:
	activation_token = secrets.token_urlsafe(32)
	user = User(
		login=login,
		email=email,
		hash_password=hash_password,
		role="user",
		is_active=False,
		is_enabled=True,
		activation_token=activation_token
	)
	db.add(user)
	db.commit()
	db.refresh(user)
	print(f"Activate: http://localhost:8000/auth/activate?token={activation_token}")
	return user

def activate_user_by_token(
	db: Session,
	token: str
) -> bool:
	user = db.scalar(select(User).where(User.activation_token == token))
	if user is None:
		return False
	user.is_active = True
	user.activation_token = None
	db.commit()
	return True