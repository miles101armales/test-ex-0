from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.core.security import ALGORITHM, SECRET_KEY
from app.database.session import get_db
from app.repositories.user import get_user_by_login
from app.database.models import User, UserRoles


http_bearer = HTTPBearer()

def get_current_user(
	credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
	db: Session = Depends(get_db)
) -> User:
	token = credentials.credentials
	try:
		payload = jwt.decode(
			token, 
			SECRET_KEY, 
			algorithms=[ALGORITHM]
		)
		login = payload.get("sub")
		if login is None:
			raise HTTPException(
				status_code=status.HTTP_401_UNAUTHORIZED,
				detail="Невалидный токен"
			)
	except JWTError:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Невалидный токен"
		)
	user = get_user_by_login(db, login)
	if user is None:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Невалидный логин"
		)
	if not user.is_active:
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Подтвердите email по ссылке"
		)
	if not user.is_enabled:
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Учетная запись отключена администратором"
		)
	return user

def get_current_admin(
	user: User = Depends(get_current_user)
) -> User:
	if user.role != UserRoles.ADMIN:
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Доступ только для администратора"
		)
	return user