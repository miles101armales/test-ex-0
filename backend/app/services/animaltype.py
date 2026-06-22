from sqlalchemy.orm import Session

from app.api.schemas.animaltype import AnimalTypeCreate
from app.database.models import AnimalType
from app.repositories.animaltype import create_animal_type, list_animal_types


def create_animal_type_service(
	db: Session,
	data: AnimalTypeCreate,
) -> AnimalType:
	return create_animal_type(
		db,
		name=data.name,
	)

def list_animal_types_service(db: Session) -> list[AnimalType]:
	return list_animal_types(db)