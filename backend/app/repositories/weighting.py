from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database.models import Weighting


def weighting_exists_for_animal_on_date(
	db: Session, 
	animal_inventory_number: int, 
	weighted_at: date
) -> bool:
	stmt = select(Weighting.id).where(
		Weighting.animal_inventory_number == animal_inventory_number,
		Weighting.weighted_at == weighted_at,
	)
	return db.scalar(stmt) is not None

def create_weighting(
	db: Session,
	animal_inventory_number: int,
	weighted_at: date,
	weight: int,
	user_id: int,
) -> Weighting:
	weighting = Weighting(
		animal_inventory_number, 
		weighted_at, 
		weight, 
		user_id
	)
	db.add(weighting)
	db.commit()
	db.refresh(weighting)
	return weighting