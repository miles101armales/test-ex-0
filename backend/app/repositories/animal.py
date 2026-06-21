from datetime import date
from sqlalchemy.orm import Session

from backend.app.database.models import Animal


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
		sex,
		nickname,
		arrived_at,
		age,
		breed_id,
		parent
	)
	db.add(animal)
	db.commit()
	db.refresh(animal)
	return animal