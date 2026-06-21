from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from app.database import models
from app.database.session import Base, engine, get_db

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    return {"ok": db.connection().connection.is_valid}