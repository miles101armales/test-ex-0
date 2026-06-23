from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.schemas.user import UserEnabledUpdate, UserRead
from app.database.models import User
from app.database.session import get_db
from app.api.deps import get_current_admin
from app.services.user import list_users_service, set_user_enabled_service


users_router = APIRouter(prefix="/users", tags=["users"])

@users_router.get("/", response_model=list[UserRead])
def list_users_endpoint(
	db: Session = Depends(get_db),
	_: User = Depends(get_current_admin)
):
	return list_users_service(db)

@users_router.patch("/{user_id}/enabled", response_model=UserRead)
def set_user_enabled_endpoint(
    user_id: int,
    data: UserEnabledUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    return set_user_enabled_service(db, user_id, data.is_enabled, admin)