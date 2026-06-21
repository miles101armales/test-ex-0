from sqlalchemy import Boolean, Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .session import Base

class AnimalType(Base):
	__tablename__ = "animaltype"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
	name: Mapped[str] = mapped_column(String, nullable=False)

	breeds: Mapped[list["Breed"]] = relationship(back_populates="animaltype")

class Breed(Base):
	__tablename__ = "breed"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
	name: Mapped[str] = mapped_column(String, nullable=False)
	animaltype_id: Mapped[int] = mapped_column(ForeignKey("animaltype.id"), nullable=False)

	animaltype: Mapped["AnimalType"] = relationship(back_populates="breeds")
	animals: Mapped[list["Animal"]] = relationship(back_populates="breed")

class Animal(Base):
	__tablename__ = "animal"

	inventory_number: Mapped[int] = mapped_column(Integer, primary_key=True)
	sex: Mapped[str] = mapped_column(String, nullable=False)
	nickname: Mapped[str] = mapped_column(String, nullable=False)
	arrived_at: Mapped[Date] = mapped_column(Date, nullable=False)
	age: Mapped[int] = mapped_column(Integer, nullable=False)
	breed_id: Mapped[int] = mapped_column(ForeignKey("breed.id"), nullable=False)
	parents: Mapped[str | None] = mapped_column(String, nullable=True)

	breed: Mapped["Breed"] = relationship(back_populates="animals")
	weightings: Mapped[list["Weighting"]] = relationship(back_populates="animal")

class Weighting(Base):
	__tablename__ = "weighting"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
	animal_inventory_number: Mapped[int] = mapped_column(ForeignKey("animal.inventory_number"), nullable=False)
	weighted_at: Mapped[Date] = mapped_column(Date, nullable=False)
	weight: Mapped[int] = mapped_column(Integer, nullable=False)
	user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

	animal: Mapped["Animal"] = relationship(back_populates="weightings")
	user: Mapped["Users"] = relationship(back_populates="weightings")

class Users(Base):
	__tablename__ = "users"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
	login: Mapped[str] = mapped_column(String, unique=True, nullable=False)
	email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
	hash_password: Mapped[str] = mapped_column(String, nullable=False)
	role: Mapped[str] = mapped_column(String, default="user")
	is_active: Mapped[bool] = mapped_column(Boolean, default=False)
	is_enabled: Mapped[bool] = mapped_column(Boolean, default=True)

	weightings: Mapped[list["Weighting"]] = relationship(back_populates="user")