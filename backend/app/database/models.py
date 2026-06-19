from sqlalchemy import Column, Date, Integer, String
from sqlalchemy.orm import relationship
from .session import Base


class AnimalType(Base):
	__tablename__ = "animaltype"

	id = Column(Integer, primary_key=True, autoincrement=True)
	name = Column(String, nullable=False)

class Breed(Base):
	__tablename__ = "breed"

	id = Column(Integer, primary_key=True, autoincrement=True)
	name = Column(String, nullable=False)
	animaltype = relationship(AnimalType, back_populates="name")

class Animal(Base):
	__tablename__ = "animal"

	inventory_number = Column(Integer, primary_key=True)
	sex = Column(String, nullable=False)
	nickname = Column(String, nullable=False)
	arrived_at = Column(Date, nullable=False)
	age = Column(Integer, nullable=False)
	breed = relationship(Breed, back_populates="name")
	parents = Column(String, nullable=True)

class Weighting(Base):
	__tablename__ = "weighting"

	id = Column(Integer, primary_key=True, autoincrement=True)
	animal = relationship(Animal, back_populates="nickname")
	weighted_at = Column(Date, nullable=False)
	weight = Column(Integer, nullable=False)

class Users(Base):
	__tablename__ = "users"

	id = Column(Integer, primary_key=True, autoincrement=True)
	login = Column(String, unique=True, nullable=False)
	email = Column(String, unique=True, nullable=False)
	hash_password = Column(String, nullable=False)
	role = Column(String, default="user")

