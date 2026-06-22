from datetime import date
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Animal


def create_animal(
	db: Session,
	inventory_number,
	sex: str,
	nickname: str,
	arrived_at: date,
	age: int,
	breed_id: int,
	parent: str
) -> Animal:
	animal = Animal(
		inventory_number=inventory_number,
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