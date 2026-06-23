from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse
from app.database.models import User
from app.repositories.auth import activate_user_by_token, get_user_by_login, exists_user_by_login_or_email, register_user
from app.core.security import create_access_token, hash_password, verify_password


def register_service(
	db: Session,
	data: RegisterRequest
) -> RegisterResponse:
	if exists_user_by_login_or_email(
		db=db,
		login=data.login,
		email=data.email
	):
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="Пользователь с таким логином/почтой уже существует"
		)
	hashed_password = hash_password(data.password)
	register_user(
		db=db,
		login=data.login,
		email=data.email,
		hash_password=hashed_password,
	)
	return RegisterResponse(message="Подтвердите email по ссылке из письма")

def activate_service(
	db: Session,
	token: str
):
	if activate_user_by_token(db, token):
		return {"message": "activated"}
	else:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Пользователь для активации не найден"
		)

def login_service(
	db: Session,
	data: LoginRequest
) -> LoginResponse:
	user = get_user_by_login(db, data.login)
	if user is None:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Неверный login или пароль"
		)
	is_verified = verify_password(data.password, user.hash_password)
	if not(is_verified):
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Неверный login или пароль"
		)
	if not(user.is_active):
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Подтвердите email по ссылке из письма"
		)
	if not(user.is_enabled):
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Учетная запись отключена администратором"
		)
	return LoginResponse(access_token=create_access_token(user.login))