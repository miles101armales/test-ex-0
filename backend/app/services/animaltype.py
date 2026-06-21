from sqlalchemy.orm import Session

from backend.app.api.schemas.animaltype import AnimalTypeCreate
from backend.app.database.models import AnimalType
from backend.app.repositories.animaltype import create_animal_type


def create_animal_type_service(
	db: Session,
	data: AnimalTypeCreate,
) -> AnimalType:
	return create_animal_type(
		db,
		name=data.name,
	)