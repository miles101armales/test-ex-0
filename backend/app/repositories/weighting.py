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

def weighting_exists_for_animal_on_date_excluding_id(
    db: Session,
    animal_inventory_number: int,
    weighted_at: date,
    *,
    exclude_id: int,
) -> bool:
    stmt = select(Weighting.id).where(
        Weighting.animal_inventory_number == animal_inventory_number,
        Weighting.weighted_at == weighted_at,
        Weighting.id != exclude_id,
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
		animal_inventory_number=animal_inventory_number, 
		weighted_at=weighted_at, 
		weight=weight, 
		user_id=user_id
	)
	db.add(weighting)
	db.commit()
	db.refresh(weighting)
	return weighting

def list_weightings(
	db: Session, 
	*,
	user_id: int | None = None
) -> list[Weighting]:
	stmt = select(Weighting).order_by(Weighting.id)
	if user_id is not None:
		stmt = stmt.where(Weighting.user_id == user_id)
	return list(db.scalars(stmt).all())

def get_weighting_by_id(
	db: Session, 
	id: int
) -> Weighting | None:
	return db.get(Weighting, id)

def update_weighting(
	db: Session,
	weighting: Weighting,
	**fields
) -> Weighting:
	for key, value in fields.items():
		if value is not None:
			setattr(weighting, key, value)
	db.commit()
	db.refresh(weighting)
	return weighting

def delete_weighting(
	db: Session,
	weighting: Weighting
) -> None:
	db.delete(weighting)
	db.commit()