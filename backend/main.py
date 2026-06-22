from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from app.database import models
from app.database.session import Base, engine, get_db
from app.api.routes.animal import animals_router
from app.api.routes.animaltype import animaltypes_router
from app.api.routes.breed import breeds_router
from app.api.routes.weightings import weightings_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(animaltypes_router)
app.include_router(breeds_router)
app.include_router(animals_router)
app.include_router(weightings_router)

@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    return {"ok": db.connection().connection.is_valid}