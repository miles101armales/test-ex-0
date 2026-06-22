from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.schemas.breed import BreedCreate, BreedRead
from app.database.session import get_db
from app.services.breed import create_breed_service, list_breeds_service


breeds_router = APIRouter(prefix="/breeds", tags=["breeds"])

@breeds_router.post("/", response_model=BreedRead, status_code=status.HTTP_201_CREATED)
def create_breed_endpoint(
	data: BreedCreate,
	db: Session = Depends(get_db)
):
	return create_breed_service(db, data)

@breeds_router.get("/", response_model=list[BreedRead])
def list_breeds_endpoint(db: Session = Depends(get_db)):
	return list_breeds_service(db)