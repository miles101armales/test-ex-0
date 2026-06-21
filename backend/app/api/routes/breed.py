from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.breed import BreedCreate, BreedRead
from app.database.session import get_db
from app.services.breed import create_breed_service


breeds_router = APIRouter(prefix="/breeds")

@breeds_router.post("/create", response_model=BreedRead, status_code=status.HTTP_201_CREATED)
def create_breed_endpoint(
	data: BreedCreate,
	db: Session = Depends(get_db)
):
	return create_breed_service(db, data)