from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.animal import AnimalCreate, AnimalRead
from app.database.session import get_db
from app.services.animal import create_animal_service


animals_router = APIRouter(prefix="/animals", tags=["animals"])

@animals_router.post("/create", response_model=AnimalRead, status_code=status.HTTP_201_CREATED)
def create_animal_endpoint(
	data: AnimalCreate,
	db: Session = Depends(get_db)
):
	return create_animal_service(db, data)