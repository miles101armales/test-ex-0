from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.breed import BreedCreate, BreedRead, BreedUpdate
from app.database.session import get_db
from app.services.breed import create_breed_service, delete_breed_service, get_breed_by_id_service, list_breeds_service, update_breed_service
from app.api.deps import get_current_user
from app.database.models import User


breeds_router = APIRouter(prefix="/breeds", tags=["breeds"])

@breeds_router.post("/", response_model=BreedRead, status_code=status.HTTP_201_CREATED)
def create_breed_endpoint(
	data: BreedCreate,
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return create_breed_service(db, data)

@breeds_router.get("/", response_model=list[BreedRead])
def list_breeds_endpoint(
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return list_breeds_service(db)

@breeds_router.get("/{id}", response_model=BreedRead)
def get_breed_endpoint(
	id: int,
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
) -> BreedRead:
	return get_breed_by_id_service(db, id)

@breeds_router.patch("/{id}", response_model=BreedRead)
def update_breed_endpoint(
	id: int,
	data: BreedUpdate,
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return update_breed_service(db, id, data)

@breeds_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_breed_endpont(
	id: int,
	db: Session = Depends(get_db), 
	_: User = Depends(get_current_user)
):
	return delete_breed_service(db, id)