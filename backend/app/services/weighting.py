from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas.weighting import WeightingCreate
from app.database.models import Weighting
from app.repositories.weighting import create_weighting, list_weightings, weighting_exists_for_animal_on_date

def create_weighting_service(
	db: Session,
	data: WeightingCreate,
	user_id: int,
) -> Weighting:
	if weighting_exists_for_animal_on_date(
		db,
		data.animal_inventory_number,
		data.weighted_at,
	):
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="Взвешивание на эту дату уже существует"
		)
	return create_weighting(
		db,
		animal_inventory_number=data.animal_inventory_number,
		weighted_at=data.weighted_at,
		weight=data.weight,
		user_id=user_id,
	)

def list_weightings_service(db: Session) -> list[Weighting]:
	return list_weightings(db)