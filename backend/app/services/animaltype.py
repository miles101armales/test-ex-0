from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas.animaltype import AnimalTypeCreate, AnimalTypeUpdate
from app.database.models import AnimalType
from app.repositories.animaltype import create_animal_type, delete_animal_type, get_animal_type_by_id, list_animal_types, update_animal_type


def create_animal_type_service(
	db: Session,
	data: AnimalTypeCreate,
) -> AnimalType:
	return create_animal_type(
		db,
		name=data.name,
	)

def list_animal_types_service(db: Session) -> list[AnimalType]:
	return list_animal_types(db)

def get_animal_type_by_id_service(db: Session, id: int) -> AnimalType:
	animal_type = get_animal_type_by_id(db, id)
	if animal_type is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Тип животного не найден"
		)
	return animal_type

def update_animal_type_service(
	db: Session, 
	id: int, 
	data: AnimalTypeUpdate
) -> AnimalType:
	get_animal_type_by_id_service(db, id)
	return update_animal_type(db, id, data.name)

def delete_animal_type_service(db: Session, id: int) -> None:
	animal_type = get_animal_type_by_id_service(db, id)
	if animal_type.breeds:
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="Нельзя удалить, так как есть связанные породы"
		)
	return delete_animal_type(db, id)