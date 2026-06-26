from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.animaltype import AnimalTypeCreate, AnimalTypeRead, AnimalTypeUpdate
from app.database.session import get_db
from app.services.animaltype import create_animal_type_service, delete_animal_type_service, get_animal_type_by_id_service, list_animal_types_service, update_animal_type_service
from app.api.deps import get_current_user
from app.database.models import User


animal_types_router = APIRouter(prefix="/animaltypes", tags=["animaltypes"])

@animal_types_router.post(
	"/", 
	response_model=AnimalTypeRead, 
	status_code=status.HTTP_201_CREATED
)
def create_animal_type_endpoint(
	data: AnimalTypeCreate,
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return create_animal_type_service(db, data)

@animal_types_router.get("/", response_model=list[AnimalTypeRead])
def list_animal_types_endpoint(
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return list_animal_types_service(db)

@animal_types_router.get("/{id}", response_model=AnimalTypeRead)
def get_animal_type_by_id_endpoint(
	id: int, 
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return get_animal_type_by_id_service(db, id)

@animal_types_router.patch("/{id}", response_model=AnimalTypeRead)
def update_animal_type_endpoint(
	id: int, 
	data: AnimalTypeUpdate, 
	db: Session = Depends(get_db),
	_: User = Depends(get_current_user)
):
	return update_animal_type_service(db, id, data)

@animal_types_router.delete(
	"/{id}", 
	status_code=status.HTTP_204_NO_CONTENT
)
def delete_animal_type_endpoint(
	id: int, 
	db: Session = Depends(get_db),
	_: User = Depends(get_current_user)
):
	delete_animal_type_service(db, id)
	return None