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

def get_animal_type_by_id(db: Session, id: int) -> AnimalType:
	stmt = select(AnimalType).where(AnimalType.id == id)
	return db.scalar(stmt)

def update_animal_type(db: Session, id: int, name: str) -> AnimalType:
	stmt = select(AnimalType).where(AnimalType.id == id)
	animal_type = db.scalar(stmt)
	animal_type.name = name
	db.commit()
	db.refresh(animal_type)
	return animal_type

def delete_animal_type(db: Session, id: int) -> None:
	stmt = select(AnimalType).where(AnimalType.id == id)
	animal_type = db.scalar(stmt)
	db.delete(animal_type)
	db.commit()