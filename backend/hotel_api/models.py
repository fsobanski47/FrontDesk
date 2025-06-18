from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric, ForeignKey, Table
from sqlalchemy.orm import relationship, declarative_base # 


from .database import Base

# tabela asocjacyjna Many to Many miedzy Reservations i Rooms
# nazwa tabeli w SQL  "ReservationRooms"
reservation_rooms_association_table = Table(
    'ReservationRooms', Base.metadata,
    Column('reservation_id', Integer, ForeignKey('Reservations.id'), primary_key=True),
    Column('room_id', Integer, ForeignKey('Rooms.id'), primary_key=True)
)

class Guest(Base): # nazwa tabeli w SQL to "Guests"
    __tablename__ = "Guests" 
    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20), nullable=True) # phone może być NULL
    email = Column(String(100))

    # relacja do Reservations
    reservations = relationship("Reservation", back_populates="guest")

class RoomType(Base): # nazwa tabeli w SQL to "RoomTypes"
    __tablename__ = "RoomTypes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True)
    description = Column(Text, nullable=True)

    # relacja do Rooms
    rooms = relationship("Room", back_populates="room_type")

class Room(Base): # nazwa tabeli w SQL to "Rooms"
    __tablename__ = "Rooms"
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_number = Column(String(10), unique=True)
    room_type_id = Column(Integer, ForeignKey("RoomTypes.id")) 
    price_per_night = Column(Numeric(10, 2))

    # relacja do RoomType
    room_type = relationship("RoomType", back_populates="rooms")
    # relacja do RoomStatus
    room_statuses = relationship("RoomStatus", back_populates="room") 
    # relacja Many to Many do Reservations
    reservations = relationship(
        "Reservation",
        secondary=reservation_rooms_association_table,
        back_populates="rooms"
    )

class Status(Base): # nazwa tabeli w SQL to "Statuses"
    __tablename__ = "Statuses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(50))
    name = Column(String(50), unique=True)

    # relacje 
    reservations_with_status = relationship("Reservation", back_populates="status") 
    room_statuses_with_status = relationship("RoomStatus", back_populates="status") 
    payments_with_status = relationship("Payment", back_populates="status")

class Reservation(Base): # nazwa tabeli w SQL to "Reservations"
    __tablename__ = "Reservations"
    id = Column(Integer, primary_key=True, autoincrement=True)
    guest_id = Column(Integer, ForeignKey("Guests.id")) 
    check_in_date = Column(DateTime)
    check_out_date = Column(DateTime)
    status_id = Column(Integer, ForeignKey("Statuses.id")) 
    total_price = Column(Numeric(10, 2), nullable=True)

    # relacje
    guest = relationship("Guest", back_populates="reservations")
    status = relationship("Status", back_populates="reservations_with_status")
    room_services = relationship("RoomService", back_populates="reservation")
    payments = relationship("Payment", back_populates="reservation")
    rooms = relationship(
        "Room",
        secondary=reservation_rooms_association_table,
        back_populates="reservations"
    )

class RoomStatus(Base): # nazwa tabeli w SQL to "RoomStatus"
    __tablename__ = "RoomStatus"
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_id = Column(Integer, ForeignKey("Rooms.id")) 
    status_id = Column(Integer, ForeignKey("Statuses.id")) 
    notes = Column(Text, nullable=True)

    # relacje
    room = relationship("Room", back_populates="room_statuses")
    status = relationship("Status", back_populates="room_statuses_with_status")

class Service(Base): # nazwa tabeli w SQL to "Services"
    __tablename__ = "Services"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    price = Column(Numeric(10, 2))
    service_type = Column(String(50))

    # relacja 
    room_services_association = relationship("RoomService", back_populates="service")

class RoomService(Base): # nazwa tabeli w SQL to "RoomServices"
    __tablename__ = "RoomServices"
    id = Column(Integer, primary_key=True, autoincrement=True)
    reservation_id = Column(Integer, ForeignKey("Reservations.id")) 
    service_id = Column(Integer, ForeignKey("Services.id")) 
    schedule_time = Column(DateTime, nullable=True)
    actual_price = Column(Numeric(10, 2))

    # relacje
    reservation = relationship("Reservation", back_populates="room_services")
    service = relationship("Service", back_populates="room_services_association")

class Payment(Base): # nazwa tabeli w SQL to "Payments"
    __tablename__ = "Payments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    reservation_id = Column(Integer, ForeignKey("Reservations.id")) 
    total_amount = Column(Numeric(10, 2))
    status_id = Column(Integer, ForeignKey("Statuses.id")) 

    # relacje
    reservation = relationship("Reservation", back_populates="payments")
    status = relationship("Status", back_populates="payments_with_status")