from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.weighting import WeightingCreate, WeightingRead, WeightingUpdate
from app.database.session import get_db
from app.services.weighting import create_weighting_service, delete_weighting_service, get_weighting_by_id_service, list_weightings_service, update_weighting_service
from app.api.deps import get_current_user
from app.database.models import User


weightings_router = APIRouter(prefix="/weightings", tags=["weightings"])

@weightings_router.post("/", response_model=WeightingRead, status_code=status.HTTP_201_CREATED)
def create_weighting_endpoint(
	data: WeightingCreate,
	db: Session = Depends(get_db),
	current_user: User = Depends(get_current_user),
):
	return create_weighting_service(db, data, user_id=current_user.id)

@weightings_router.get("/", response_model=list[WeightingRead])
def list_weightings_endpoint(
	db: Session = Depends(get_db),
	current_user: User = Depends(get_current_user),
):
	return list_weightings_service(db, current_user)

@weightings_router.get("/{id}", response_model=WeightingRead)
def get_weighting_by_id_endpoint(
	id: int, 
	db: Session = Depends(get_db),
	current_user: User = Depends(get_current_user),
):
	return get_weighting_by_id_service(db, id, current_user)

@weightings_router.patch("/{id}", response_model=WeightingRead)
def update_weighting_endpoint(
	id: int,
	data: WeightingUpdate, 
	db: Session = Depends(get_db),
	current_user: User = Depends(get_current_user)
):
	return update_weighting_service(db, id, data, current_user)

@weightings_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_weighting_endpoint(
	id: int,
	db: Session = Depends(get_db),
	current_user: User = Depends(get_current_user)
):
	delete_weighting_service(db, id, current_user)