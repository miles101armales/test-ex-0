from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Breed


def create_breed(
	db: Session,
	name: str,
	animaltype_id: int,
) -> Breed:
	breed = Breed(
		name=name, 
		animaltype_id=animaltype_id
	)
	db.add(breed)
	db.commit()
	db.refresh(breed)
	return breed

def list_breeds(db: Session) -> list[Breed]:
	stmt = select(Breed).order_by(Breed.id)
	return list(db.scalars(stmt).all())