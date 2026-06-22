from sqlalchemy.orm import Session

from app.api.schemas.breed import BreedCreate
from app.database.models import Breed
from app.repositories.breed import create_breed, list_breeds


def create_breed_service(
	db: Session,
	data: BreedCreate,
) -> Breed:
	return create_breed(
		db,
		name=data.name,
		animaltype_id=data.animaltype_id,
	)

def list_breeds_service(db: Session) -> list[Breed]:
	return list_breeds(db)