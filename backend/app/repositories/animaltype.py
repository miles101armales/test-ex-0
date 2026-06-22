from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import AnimalType


def create_animal_type(
	db: Session,
	name: str,
) -> AnimalType:
	animal_type = AnimalType(
		name=name
	)
	db.add(animal_type)
	db.commit()
	db.refresh(animal_type)
	return animal_type

def list_animal_types(db: Session) -> list[AnimalType]:
	stmt = select(AnimalType).order_by(AnimalType.id)
	return list(db.scalars(stmt).all())