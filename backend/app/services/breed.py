from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas.breed import BreedCreate, BreedUpdate
from app.database.models import Breed
from app.repositories.breed import create_breed, delete_breed, get_breed_by_id, list_breeds, update_breed
from app.services.animaltype import get_animal_type_by_id_service


def create_breed_service(
	db: Session,
	data: BreedCreate,
) -> Breed:
	get_animal_type_by_id_service(db, data.animaltype_id)
	return create_breed(
		db,
		name=data.name,
		animaltype_id=data.animaltype_id,
	)

def list_breeds_service(db: Session) -> list[Breed]:
	return list_breeds(db)

def get_breed_by_id_service(
	db: Session,
	id: int
) -> Breed:
	breed = get_breed_by_id(db, id)
	if breed is None:
		raise HTTPException(
		status_code=status.HTTP_404_NOT_FOUND,
		detail="Порода не найдена"
		)
	return breed


def update_breed_service(
	db: Session,
	id: int,
	data: BreedUpdate,
) -> Breed:
	breed = get_breed_by_id_service(db, id)
	if data.animaltype_id is not None:
		get_animal_type_by_id_service(db, data.animaltype_id)
	return update_breed(
		db,
		breed,
		name=data.name,
		animaltype_id=data.animaltype_id
	)

def delete_breed_service(
	db: Session,
	id: int,
) -> None:
	breed = get_breed_by_id_service(db, id)
	if breed.animals:
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="Нельзя удалить: есть связанные животные"
		)
	delete_breed(db, breed)