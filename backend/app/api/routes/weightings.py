from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.weighting import WeightingCreate, WeightingRead
from app.database.session import get_db
from app.services.weighting import create_weighting_service


weightings_router = APIRouter(prefix="/weightings")

@weightings_router.post("/create", response_model=WeightingRead, status_code=status.HTTP_201_CREATED)
def create_weighting_endpoint(
	data: WeightingCreate,
	db: Session = Depends(get_db),
):
	user_id = 1
	return create_weighting_service(db, data, user_id=user_id)