from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.database.models import User
from app.repositories.user import get_user_by_id, list_users, set_user_enabled


def list_users_service(db: Session) -> list[User]:
	return list_users(db)

def set_user_enabled_service(
	db: Session, 
	user_id: int, 
	is_enabled: bool,
	admin: User,
) -> User:
	user = get_user_by_id(db, user_id)
	if user is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Пользователь не найден"
		)
	if user_id == admin.id and not is_enabled:
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="Нельзя отключить свой аккаунт"
		)
	return set_user_enabled(db, user, is_enabled)