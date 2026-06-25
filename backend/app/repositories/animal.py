from datetime import date
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Animal


def create_animal(
	db: Session,
	sex: str,
	nickname: str,
	arrived_at: date,
	age: int,
	breed_id: int,
	parent: str
) -> Animal:
	animal = Animal(
		sex=sex,
		nickname=nickname,
		arrived_at=arrived_at,
		age=age,
		breed_id=breed_id,
		parent=parent
	)
	db.add(animal)
	db.commit()
	db.refresh(animal)
	return animal

def list_animals(db: Session) -> list[Animal]:
	stmt = select(Animal).order_by(Animal.inventory_number)
	return list(db.scalars(stmt).all())

def get_animal_by_inventory_number(db: Session, inventory_number: int) -> Animal:
	return db.get(Animal, inventory_number)

def update_animal(db: Session, animal: Animal, **fields):
	for key, value in fields.items():
		if value is not None:
			setattr(animal, key, value)
	db.commit()
	db.refresh(animal)
	return animal

def delete_animal(db: Session, animal: Animal) -> None:
	db.delete(animal)
	db.commit()