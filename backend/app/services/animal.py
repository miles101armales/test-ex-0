from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas.animal import AnimalCreate, AnimalUpdate
from app.database.models import Animal
from app.repositories.animal import create_animal, delete_animal, get_animal_by_inventory_number, list_animals, update_animal
from app.repositories.breed import get_breed_by_id
from app.services.breed import get_breed_by_id_service


def create_animal_service(
	db: Session,
	data: AnimalCreate,
) -> Animal:
	breed = get_breed_by_id(db, data.breed_id)
	if breed is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Порода не найдена"
		)
	return create_animal(
		db,
		sex=data.sex,
		nickname=data.nickname,
		arrived_at=data.arrived_at,
		age=data.age,
		breed_id=data.breed_id,
		parent=data.parent
	)

def list_animals_service(db: Session) -> list[Animal]:
	return list_animals(db)

def get_animal_by_inventory_number_service(
	db: Session,
	inventory_number: int
) -> Animal:
	animal = get_animal_by_inventory_number(db, inventory_number)
	if animal is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Животное не найдено"
		)
	return animal

def update_animal_service(
	db: Session,
	inventory_number: int,
	data: AnimalUpdate
) -> Animal:
	animal = get_animal_by_inventory_number_service(db, inventory_number)
	if data.breed_id is not None:
		get_breed_by_id_service(db, data.breed_id)
	return update_animal(
		db, 
		animal, 
		sex=data.sex, 
		nickname=data.nickname, 
		arrived_at=data.arrived_at, 
		age=data.age, 
		breed_id=data.breed_id, 
		parent=data.parent
	)

def delete_animal_service(db: Session, inventory_number: int) -> None:
	animal = get_animal_by_inventory_number_service(db, inventory_number)
	if animal.weightings:
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="Нельзя удалить: есть связанные взвешивания"
		)
	delete_animal(db, animal)