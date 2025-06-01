from sqlalchemy.orm import Session
from . import models, schemas
from typing import List
import datetime

# --- Guest CRUD ---
def get_guest(db: Session, guest_id: int):
    return db.query(models.Guest).filter(models.Guest.id == guest_id).first()

def get_guest_by_email(db: Session, email: str):
    return db.query(models.Guest).filter(models.Guest.email == email).first()

def get_guests(db: Session, skip: int = 0, limit: int = 100):
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!! get guests  FUNCTION ENTERED !!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    return db.query(models.Guest).offset(skip).limit(limit).all()

def create_guest(db: Session, guest: schemas.GuestCreate):
    db_guest = models.Guest(**guest.model_dump())
    db.add(db_guest)
    db.commit()
    db.refresh(db_guest)
    return db_guest

def get_guest_by_reservation(db: Session, reservation_id: int):
    return db.query(models.Guest).join(models.Reservation).filter(models.Reservation.id == reservation_id).all()

def get_ongoing_and_next_reservations_by_room(db: Session, room_id: int):
    now = datetime.datetime.now()
    return db.query(models.Reservation).join(models.Reservation.rooms).filter(
        models.Room.id == room_id,
        models.Reservation.check_in_date <= now,
        models.Reservation.check_out_date >= now
    ).all()
# --- RoomType CRUD ---
def get_room_type(db: Session, room_type_id: int):
    return db.query(models.RoomType).filter(models.RoomType.id == room_type_id).first()

def get_room_types(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.RoomType).offset(skip).limit(limit).all()

def create_room_type(db: Session, room_type: schemas.RoomTypeCreate):
    db_room_type = models.RoomType(**room_type.model_dump())
    db.add(db_room_type)
    db.commit()
    db.refresh(db_room_type)
    return db_room_type

# --- Room CRUD ---
def get_room(db: Session, room_id: int):
    return db.query(models.Room).filter(models.Room.id == room_id).first()

def get_rooms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Room).offset(skip).limit(limit).all()

def create_room(db: Session, room: schemas.RoomCreate):
    db_room = models.Room(**room.model_dump())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

# --- Status CRUD ---
def get_status(db: Session, status_id: int):
    return db.query(models.Status).filter(models.Status.id == status_id).first()

def get_statuses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Status).offset(skip).limit(limit).all()

def create_status(db: Session, status: schemas.StatusCreate):
    db_status = models.Status(**status.model_dump())
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status

# --- Reservation CRUD ---
def get_reservation(db: Session, reservation_id: int):
    return db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()

def get_reservations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reservation).offset(skip).limit(limit).all()

def create_reservation(db: Session, reservation: schemas.ReservationCreate):
    # Extract room_ids and create reservation object without it
    room_ids = reservation.room_ids
    reservation_data = reservation.model_dump(exclude={"room_ids"})
    db_reservation = models.Reservation(**reservation_data)
    
    # Fetch room objects
    if room_ids:
        rooms = db.query(models.Room).filter(models.Room.id.in_(room_ids)).all()
        if len(rooms) != len(room_ids):
            # Handle error: some rooms not found
            # For simplicity, we'll assume all rooms exist for now
            # or raise an exception
            pass
        db_reservation.rooms.extend(rooms)
    
    
        
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    
    # db_payment = models.Payment(
    #     reservation_id=db_reservation.id,
    #     total_amount=reservation.total_price,  # lub inna logika wyliczania kwoty
    #     status_id=7  # lub inny domyślny status
    # )
    # db.add(db_payment)
    # db.commit()
    # db.refresh(db_payment)
    return db_reservation


def delete_reservation(db: Session, reservation_id: int):
    db_reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if db_reservation:
        db.delete(db_reservation)
        db.commit()
        return True
    return False

# --- Service CRUD ---
def get_service(db: Session, service_id: int):
    return db.query(models.Service).filter(models.Service.id == service_id).first()

def get_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Service).offset(skip).limit(limit).all()

def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.Service(**service.model_dump())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

# --- RoomService CRUD ---
def get_room_service(db: Session, room_service_id: int):
    return db.query(models.RoomService).filter(models.RoomService.id == room_service_id).first()

def get_room_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.RoomService).offset(skip).limit(limit).all()

def create_room_service(db: Session, room_service: schemas.RoomServiceCreate):
    db_room_service = models.RoomService(**room_service.model_dump())
    db.add(db_room_service)
    db.commit()
    db.refresh(db_room_service)
    return db_room_service

def get_room_service_by_reservation(db: Session, reservation_id: int):
    return db.query(models.RoomService).join(models.Reservation).filter(models.Reservation.id == reservation_id).all()

# --- Payment CRUD ---
def get_payment(db: Session, payment_id: int):
    return db.query(models.Payment).filter(models.Payment.id == payment_id).first()

def get_payments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Payment).offset(skip).limit(limit).all()

def create_payment(db: Session, payment: schemas.PaymentCreate):
    db_payment = models.Payment(**payment.model_dump())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment



# --- RoomStatus CRUD ---
def get_room_status(db: Session, room_status_id: int):
    return db.query(models.RoomStatus).filter(models.RoomStatus.id == room_status_id).first()

def get_all_room_statuses(db: Session, skip: int = 0, limit: int = 100): # Renamed from get_room_statuses
    return db.query(models.RoomStatus).offset(skip).limit(limit).all()

def create_room_status(db: Session, room_status: schemas.RoomStatusCreate):
    db_room_status = models.RoomStatus(**room_status.model_dump())
    db.add(db_room_status)
    db.commit()
    db.refresh(db_room_status)
    return db_room_status

def get_room_status_by_room_id(db: Session, room_id: int):
    return db.query(models.RoomStatus).join(models.Room).filter(models.Room.id == room_id).first()

def get_available_rooms(db: Session, check_in_date: datetime, check_out_date: datetime):
    # Fetch all rooms
    all_rooms = db.query(models.Room).all()
    
    # Fetch all reservations that overlap with the given dates
    overlapping_reservations = db.query(models.Reservation).filter(
        models.Reservation.check_in_date < check_out_date,
        models.Reservation.check_out_date > check_in_date
    ).all()
    
    # Extract room IDs from overlapping reservations
    reserved_room_ids = set()
    for reservation in overlapping_reservations:
        for room in reservation.rooms:
            reserved_room_ids.add(room.id)
    
    # Filter out reserved rooms
    available_rooms = [room for room in all_rooms if room.id not in reserved_room_ids]
    
    return available_rooms
