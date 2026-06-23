from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.auth import LoginRequest, LoginResponse, RegisterRequest
from app.database.session import get_db
from app.services.auth import activate_service, login_service, register_service


auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register_endpoint(
	data: RegisterRequest, 
	db: Session = Depends(get_db)
):
	return register_service(db, data)

@auth_router.get("/activate")
def activate_endpoint(
	token: str, 
	db: Session = Depends(get_db)
):
	return activate_service(db, token)

@auth_router.post("/login", response_model=LoginResponse)
def login_endpoint(
	data: LoginRequest,
	db: Session = Depends(get_db)
):
	return login_service(db, data)