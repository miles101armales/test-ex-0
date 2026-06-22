from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.animaltype import AnimalTypeCreate, AnimalTypeRead
from app.database.session import get_db
from app.services.animaltype import create_animal_type_service, list_animal_types_service


animal_types_router = APIRouter(prefix="/animaltypes", tags=["animaltypes"])

@animal_types_router.post("/", response_model=AnimalTypeRead, status_code=status.HTTP_201_CREATED)
def create_animal_type_endpoint(
	data: AnimalTypeCreate,
	db: Session = Depends(get_db),
):
	return create_animal_type_service(db, data)

@animal_types_router.get("/", response_model=list[AnimalTypeRead])
def list_animal_types_endpoint(db: Session = Depends(get_db)):
	return list_animal_types_service(db)