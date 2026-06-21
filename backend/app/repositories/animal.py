from datetime import date
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