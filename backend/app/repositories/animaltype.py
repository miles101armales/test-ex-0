from sqlalchemy.orm import Session

from app.database.models import Animal


def create_animal_type(
	db: Session,
	name: str,
) -> Animal:
	animal = Animal(
		name=name
	)
	db.add(animal)
	db.commit()
	db.refresh(animal)
	return animal