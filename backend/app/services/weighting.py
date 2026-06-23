from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas.weighting import WeightingCreate, WeightingUpdate
from app.database.models import User, Weighting
from app.repositories.weighting import create_weighting, delete_weighting, get_weighting_by_id, list_weightings, update_weighting, weighting_exists_for_animal_on_date, weighting_exists_for_animal_on_date_excluding_id
from app.repositories.animal import get_animal_by_inventory_number
from app.services.animal import get_animal_by_inventory_number_service

def _ensure_can_access_weighting(weighting: Weighting, current_user: User) -> None:
	if current_user.role != "admin" and weighting.user_id != current_user.id:
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Нет доступа к этой записи"
		)

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
	animal = get_animal_by_inventory_number(db, data.animal_inventory_number)
	if animal is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Животное не найдено"
		)
	return create_weighting(
		db,
		animal_inventory_number=data.animal_inventory_number,
		weighted_at=data.weighted_at,
		weight=data.weight,
		user_id=user_id,
	)

def list_weightings_service(db: Session, current_user: User) -> list[Weighting]:
	if current_user.role == "admin":
		return list_weightings(db)
	return list_weightings(db, user_id=current_user.id)

def get_weighting_by_id_service(
	db: Session, 
	id: int, 
	current_user: User
) -> Weighting:
	weighting_note = get_weighting_by_id(db, id)
	if weighting_note is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Взвешивание не найдено"
		)
	_ensure_can_access_weighting(weighting_note, current_user)
	return weighting_note

def update_weighting_service(
	db: Session,
	id: int,
	data: WeightingUpdate,
	current_user: User,
) -> Weighting:
	weighting_note = get_weighting_by_id_service(db, id, current_user)
	new_animal = data.animal_inventory_number or weighting_note.animal_inventory_number
	new_date = data.weighted_at or weighting_note.weighted_at
	if weighting_exists_for_animal_on_date_excluding_id(db, new_animal, new_date, exclude_id=weighting_note.id):
		raise HTTPException(
			status_code=status.HTTP_409_CONFLICT,
			detail="Взвешивание на эту дату уже существует"
		)
	if data.animal_inventory_number is not None:
		get_animal_by_inventory_number_service(db, data.animal_inventory_number)
	return update_weighting(
		db,
		weighting_note,
		animal_inventory_number=data.animal_inventory_number,
		weighted_at=data.weighted_at,
		weight=data.weight
	)

def delete_weighting_service(db: Session, id: int, current_user: User)-> None:
	weighting_note = get_weighting_by_id_service(db, id, current_user)
	delete_weighting(db, weighting_note)