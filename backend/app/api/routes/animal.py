from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.animal import AnimalCreate, AnimalRead, AnimalUpdate
from app.database.session import get_db
from app.services.animal import create_animal_service, delete_animal_service, get_animal_by_inventory_number_service, list_animals_service, update_animal_service
from app.api.deps import get_current_user
from app.database.models import User


animals_router = APIRouter(prefix="/animals", tags=["animals"])

@animals_router.post("/", response_model=AnimalRead, status_code=status.HTTP_201_CREATED)
def create_animal_endpoint(
	data: AnimalCreate,
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return create_animal_service(db, data)

@animals_router.get("/", response_model=list[AnimalRead])
def list_animals_endpoint(
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return list_animals_service(db)

@animals_router.get("/{inventory_number}", response_model=AnimalRead)
def get_animal_by_inventory_number_endpoint(
	inventory_number: int, 
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return get_animal_by_inventory_number_service(db, inventory_number)

@animals_router.patch("/{inventory_number}", response_model=AnimalRead)
def update_animal_endpoint(
	inventory_number: int,
	data: AnimalUpdate,
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return update_animal_service(db, inventory_number, data)

@animals_router.delete("/{inventory_number}", status_code=status.HTTP_204_NO_CONTENT)
def delete_animal_endpoint(
	inventory_number: int,
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return delete_animal_service(db, inventory_number)