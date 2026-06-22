from sqlalchemy.orm import Session

from app.api.schemas.animal import AnimalCreate
from app.database.models import Animal
from app.repositories.animal import create_animal


def create_animal_service(
	db: Session,
	data: AnimalCreate,
) -> Animal:
	return create_animal(
		db,
		inventory_number=data.inventory_number,
		sex=data.sex,
		nickname=data.nickname,
		arrived_at=data.arrived_at,
		age=data.age,
		breed_id=data.breed_id,
		parent=data.parent
	)