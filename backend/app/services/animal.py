from sqlalchemy.orm import Session

from backend.app.api.schemas.animal import AnimalCreate
from backend.app.database.models import Animal
from backend.app.repositories.animal import create_animal


def create_animal_service(
	db: Session,
	data: AnimalCreate,
) -> Animal:
	return create_animal(
		db,
		sex=data.sex,
		nickname=data.nickname,
		arrived_at=data.arrived_at,
		age=data.age,
		breed_id=data.breed_id,
		parent=data.parent
	)