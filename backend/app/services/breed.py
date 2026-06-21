from sqlalchemy.orm import Session

from backend.app.api.schemas.breed import BreedCreate
from backend.app.database.models import Breed
from backend.app.repositories.breed import create_breed


def create_breed_service(
	db: Session,
	data: BreedCreate,
) -> Breed:
	return create_breed(
		db,
		name=data.name,
		animaltype_id=data.animaltype_id,
	)