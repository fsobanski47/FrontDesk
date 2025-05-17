from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric, ForeignKey, Table
from sqlalchemy.orm import relationship, declarative_base # Użyj declarative_base

# Zaimportuj Base z Twojego pliku database.py
# Jeśli Base jest zdefiniowane w database.py jako:
# from sqlalchemy.orm import declarative_base
# Base = declarative_base()
# to ten import jest poprawny:
from .database import Base
# Jeśli Base jest zdefiniowane inaczej, dostosuj import.

# Tabela asocjacyjna dla relacji wiele-do-wielu między Reservations i Rooms
# Nazwa tabeli w SQL to "ReservationRooms"
reservation_rooms_association_table = Table(
    'ReservationRooms', Base.metadata,
    Column('reservation_id', Integer, ForeignKey('Reservations.id'), primary_key=True), # Zwróć uwagę na wielkość liter w 'Reservations.id'
    Column('room_id', Integer, ForeignKey('Rooms.id'), primary_key=True) # Zwróć uwagę na wielkość liter w 'Rooms.id'
)

class Guest(Base): # Nazwa tabeli w SQL to "Guests"
    __tablename__ = "Guests" # Dopasuj do wielkości liter w SQL
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20), nullable=True) # Załóżmy, że phone może być NULL
    email = Column(String(100))

    # Relacja do Reservations
    reservations = relationship("Reservation", back_populates="guest")

class RoomType(Base): # Nazwa tabeli w SQL to "RoomTypes"
    __tablename__ = "RoomTypes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True)
    description = Column(Text, nullable=True)

    # Relacja do Rooms
    rooms = relationship("Room", back_populates="room_type")

class Room(Base): # Nazwa tabeli w SQL to "Rooms"
    __tablename__ = "Rooms"
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_number = Column(String(10), unique=True)
    room_type_id = Column(Integer, ForeignKey("RoomTypes.id")) # Dopasuj wielkość liter w 'RoomTypes.id'
    price_per_night = Column(Numeric(10, 2))

    # Relacja do RoomType
    room_type = relationship("RoomType", back_populates="rooms")
    # Relacja do RoomStatus
    room_statuses = relationship("RoomStatus", back_populates="room") # Zmieniono z 'statuses' na 'room_statuses' dla jasności
    # Relacja wiele-do-wielu do Reservations
    reservations = relationship(
        "Reservation",
        secondary=reservation_rooms_association_table,
        back_populates="rooms"
    )

class Status(Base): # Nazwa tabeli w SQL to "Statuses"
    __tablename__ = "Statuses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(50))
    name = Column(String(50), unique=True)

    # Relacje dla różnych typów statusów
    reservations_with_status = relationship("Reservation", back_populates="status") # Zmieniona nazwa dla unikalności
    room_statuses_with_status = relationship("RoomStatus", back_populates="status") # Zmieniona nazwa dla unikalności
    payments_with_status = relationship("Payment", back_populates="status") # Zmieniona nazwa dla unikalności

class Reservation(Base): # Nazwa tabeli w SQL to "Reservations"
    __tablename__ = "Reservations"
    # Uwaga: W SQL masz "AUTO_INCREMENT AUTO_INCREMENT PRIMARY KEY", co jest redundantne.
    # SQLAlchemy obsłuży pojedyncze AUTO_INCREMENT dla PRIMARY KEY.
    id = Column(Integer, primary_key=True, autoincrement=True)
    guest_id = Column(Integer, ForeignKey("Guests.id")) # Dopasuj wielkość liter
    check_in_date = Column(DateTime)
    check_out_date = Column(DateTime)
    status_id = Column(Integer, ForeignKey("Statuses.id")) # Dopasuj wielkość liter
    total_price = Column(Numeric(10, 2), nullable=True)

    # Relacje
    guest = relationship("Guest", back_populates="reservations")
    status = relationship("Status", back_populates="reservations_with_status")
    room_services = relationship("RoomService", back_populates="reservation")
    payments = relationship("Payment", back_populates="reservation")
    rooms = relationship(
        "Room",
        secondary=reservation_rooms_association_table,
        back_populates="reservations"
    )

class RoomStatus(Base): # Nazwa tabeli w SQL to "RoomStatus"
    __tablename__ = "RoomStatus"
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_id = Column(Integer, ForeignKey("Rooms.id")) # Dopasuj wielkość liter
    status_id = Column(Integer, ForeignKey("Statuses.id")) # Dopasuj wielkość liter
    notes = Column(Text, nullable=True)

    # Relacje
    room = relationship("Room", back_populates="room_statuses")
    status = relationship("Status", back_populates="room_statuses_with_status")

class Service(Base): # Nazwa tabeli w SQL to "Services"
    __tablename__ = "Services"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    price = Column(Numeric(10, 2))
    service_type = Column(String(50))

    # Relacja do RoomServices
    room_services_association = relationship("RoomService", back_populates="service")

class RoomService(Base): # Nazwa tabeli w SQL to "RoomServices"
    __tablename__ = "RoomServices"
    id = Column(Integer, primary_key=True, autoincrement=True)
    reservation_id = Column(Integer, ForeignKey("Reservations.id")) # Dopasuj wielkość liter
    service_id = Column(Integer, ForeignKey("Services.id")) # Dopasuj wielkość liter
    schedule_time = Column(DateTime, nullable=True)
    actual_price = Column(Numeric(10, 2))

    # Relacje
    reservation = relationship("Reservation", back_populates="room_services")
    service = relationship("Service", back_populates="room_services_association")

class Payment(Base): # Nazwa tabeli w SQL to "Payments"
    __tablename__ = "Payments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    reservation_id = Column(Integer, ForeignKey("Reservations.id")) # Dopasuj wielkość liter
    total_amount = Column(Numeric(10, 2))
    status_id = Column(Integer, ForeignKey("Statuses.id")) # Dopasuj wielkość liter

    # Relacje
    reservation = relationship("Reservation", back_populates="payments")
    status = relationship("Status", back_populates="payments_with_status")