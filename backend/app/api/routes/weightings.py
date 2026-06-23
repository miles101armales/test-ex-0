from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.weighting import WeightingCreate, WeightingRead
from app.database.session import get_db
from app.services.weighting import create_weighting_service, list_weightings_service
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
def list_weightings_endpoint(db: Session = Depends(get_db)):
	return list_weightings_service(db)