from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging
from . import crud, models, schemas
from .database import SessionLocal, engine, get_db
import datetime
from decimal import Decimal
from fastapi.middleware.cors import CORSMiddleware


logging.basicConfig(
    level=logging.INFO,  # (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', # format logów
    datefmt='%Y-%m-%d %H:%M:%S' # format daty i czasu 
)

# instancja loggera 
logger = logging.getLogger(__name__)

# jesli baza mysql jest pusta, mozna utworzyc tabele w ten sposob:
# ale my wolelismy robic to skryptami w dbeaver
# models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hotel Management API")


#middleware potrzebny zeby frontend mogl rozmawiac z backendem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # pozwol na zapytania z frontendu na porcie 3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Guest Endpoints ---
@app.post("/guests/", response_model=schemas.Guest, tags=["Guests"])
def create_guest(guest: schemas.GuestCreate, db: Session = Depends(get_db)):
    db_guest = crud.get_guest_by_email(db, email=guest.email)
    if db_guest:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_guest(db=db, guest=guest)

# @app.get("/guests/", response_model=List[schemas.Guest], tags=["Guests"])
# def read_guests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     print("!!!!!!!!!!!!!!!!!!!!!!!!!!!! /guests/ ENDPOINT FUNCTION ENTERED !!!!!!!!!!!!!!!!!!!!!!!!!!!!")
#     guests = crud.get_guests(db, skip=skip, limit=limit)
#     return guests

@app.get("/guests/", response_model=List[schemas.Guest], tags=["Guests"])
def read_guests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logger.info("--- /guests/ ENDPOINT CALLED ---")
    try:
        guests_from_crud = crud.get_guests(db, skip=skip, limit=limit)
        logger.info(f"ENDPOINT: crud.get_guests returned {len(guests_from_crud)} guests.")

        if guests_from_crud:
            logger.info("ENDPOINT: Data of FIRST guest from CRUD before Pydantic conversion:")
            first_guest_obj = guests_from_crud[0]
            logger.info(f"Type of first guest object: {type(first_guest_obj)}")
            if isinstance(first_guest_obj, models.Guest):
                logger.info(f"Guest ID: {getattr(first_guest_obj, 'id', 'N/A')}")
                logger.info(f"Guest First Name: {getattr(first_guest_obj, 'first_name', 'N/A')}")
                logger.info(f"Guest Last Name: {getattr(first_guest_obj, 'last_name', 'N/A')}")
                logger.info(f"Guest Email: {getattr(first_guest_obj, 'email', 'N/A')}")
                logger.info(f"Guest Phone: {getattr(first_guest_obj, 'phone', 'N/A')}")
                # logger.info(f"Guest __dict__: {first_guest_obj.__dict__}") 
            else:
                logger.warning("First object from CRUD is not of type models.Guest!")

            # wiecej logowania dla wiekszej liczby gosci
            if len(guests_from_crud) > 1:
                logger.info("ENDPOINT: Data of SECOND guest from CRUD before Pydantic conversion:")
                second_guest_obj = guests_from_crud[1]
                logger.info(f"Type of second guest object: {type(second_guest_obj)}")
                if isinstance(second_guest_obj, models.Guest):
                    logger.info(f"Guest ID: {getattr(second_guest_obj, 'id', 'N/A')}")
                    logger.info(f"Guest First Name: {getattr(second_guest_obj, 'first_name', 'N/A')}")
                    
        else:
            logger.info("ENDPOINT: crud.get_guests returned an empty list or None.")

        return guests_from_crud
    except Exception as e:
        logger.error(f"ENDPOINT: Error in /guests/ endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error while fetching guests")


@app.get("/guests/{guest_id}", response_model=schemas.Guest, tags=["Guests"])
def read_guest(guest_id: int, db: Session = Depends(get_db)):
    db_guest = crud.get_guest(db, guest_id=guest_id)
    if db_guest is None:
        raise HTTPException(status_code=404, detail="Guest not found")
    return db_guest


@app.get("/guests/reservation/{reservation_id}", response_model=List[schemas.Guest], tags=["Guests"])
def read_guest_by_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_guest = crud.get_guest_by_reservation(db, reservation_id=reservation_id)
    if db_guest is None:
        raise HTTPException(status_code=404, detail="Guest not found")
    return db_guest


# --- RoomType Endpoints ---
@app.post("/roomtypes/", response_model=schemas.RoomType, tags=["Room Types"])
def create_room_type(room_type: schemas.RoomTypeCreate, db: Session = Depends(get_db)):
    return crud.create_room_type(db=db, room_type=room_type)

@app.get("/roomtypes/", response_model=List[schemas.RoomType], tags=["Room Types"])
def read_room_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_room_types(db, skip=skip, limit=limit)

@app.get("/roomtypes/{room_type_id}", response_model=schemas.RoomType, tags=["Room Types"])
def read_room_type(room_type_id: int, db: Session = Depends(get_db)):
    db_room_type = crud.get_room_type(db, room_type_id=room_type_id)
    if db_room_type is None:
        raise HTTPException(status_code=404, detail="RoomType not found")
    return db_room_type

# --- Room Endpoints ---
@app.post("/rooms/", response_model=schemas.Room, tags=["Rooms"])
def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db)):
    # czy RoomType istnieje?
    db_room_type = crud.get_room_type(db, room_type_id=room.room_type_id)
    if not db_room_type:
        raise HTTPException(status_code=404, detail=f"RoomType with id {room.room_type_id} not found")
    created_room = crud.create_room(db=db, room=room)

    available_status_id = 3 
    # czy Status id=3 istnieje (dostepny)? 
    db_status = crud.create_room_status(db=db, room_status=schemas.RoomStatusCreate(
        room_id=created_room.id, 
        status_id=available_status_id,
        notes="Swiezo stworzony pokoj." # placeholder defaultowa notatka
    ))
    if not db_status:
        raise HTTPException(status_code=500, detail=f"Default status with id {available_status_id} not found. Cannot set room status.")

    return created_room

@app.get("/rooms/", response_model=List[schemas.Room], tags=["Rooms"])
def read_rooms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    now = datetime.datetime.now()
    reservations = crud.get_reservations(db)
    for reservation in reservations:
        for room in reservation.rooms:
            room_id = room.id
            # jesli rezerwacja trwa TERAZ, ustaw status na "zajety" (id=4)
            if reservation.check_in_date <= now <= reservation.check_out_date:
                db_room_status = db.query(models.RoomStatus).filter(models.RoomStatus.room_id == room_id).first()
                if not db_room_status:
                    room_status_data = schemas.RoomStatusCreate(room_id=room_id, status_id=4)
                    crud.create_room_status(db=db, room_status=room_status_data)
                else:
                    if db_room_status.status_id != 4:
                        db_room_status.status_id = 4
                        db.commit()
                        db.refresh(db_room_status)
            # jesli rezerwacja się zakonczyła, ustaw status na "dostepny" (id=3)
            elif reservation.check_out_date < now:
                db_room_status = db.query(models.RoomStatus).filter(models.RoomStatus.room_id == room_id).first()
                if db_room_status and db_room_status.status_id != 3:
                    db_room_status.status_id = 3
                    db.commit()
    return crud.get_rooms(db, skip=skip, limit=limit)

@app.get("/rooms/{room_id}", response_model=schemas.Room, tags=["Rooms"])
def read_room(room_id: int, db: Session = Depends(get_db)):
    db_room = crud.get_room(db, room_id=room_id)
    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return db_room

# toggle statusu pokoju na maintenance (id=5)
@app.put("/rooms/{room_id}/maintenance", response_model=schemas.RoomStatus, tags=["Room Statuses"])
def set_room_to_maintenance(room_id: int, db: Session = Depends(get_db)):
    # znajdz status maintenance (id=5)
    maintenance_status = db.query(models.Status).filter(models.Status.id == "5").first()
    if not maintenance_status:
        raise HTTPException(status_code=404, detail="Status id '5' not found")
    # znajdz roomstatus dla tego pokoju
    db_room_status = db.query(models.RoomStatus).filter(models.RoomStatus.room_id == room_id).first()
    if not db_room_status:
        # jesli ten pokoj nie ma roomstatus, to go utworz
        room_status_data = schemas.RoomStatusCreate(room_id=room_id, status_id=maintenance_status.id)
        return crud.create_room_status(db=db, room_status=room_status_data)
    # a jesli posiada, to go zaktualizuj
    db_room_status.status_id = maintenance_status.id
    db.commit()
    db.refresh(db_room_status)
    return db_room_status

# toggle statusu pokoju na "dostepny" (id=3)
@app.put("/rooms/{room_id}/restore", response_model=schemas.RoomStatus, tags=["Room Statuses"])
def set_room_to_maintenance(room_id: int, db: Session = Depends(get_db)):
    # znajdz status available (id=3)
    maintenance_status = db.query(models.Status).filter(models.Status.id == "3").first()
    if not maintenance_status:
        raise HTTPException(status_code=404, detail="Status id '3' not found")
    # znajdz roomstatus dla tego pokoju
    db_room_status = db.query(models.RoomStatus).filter(models.RoomStatus.room_id == room_id).first()
    if not db_room_status:
        # jesli ten pokoj nie ma roomstatus, to go utworz
        room_status_data = schemas.RoomStatusCreate(room_id=room_id, status_id=maintenance_status.id)
        return crud.create_room_status(db=db, room_status=room_status_data)
    # a jesli posiada, to go zaktualizuj
    db_room_status.status_id = maintenance_status.id
    db.commit()
    db.refresh(db_room_status)
    return db_room_status

# --- Status Endpoints ---
@app.post("/statuses/", response_model=schemas.Status, tags=["Statuses"])
def create_status(status: schemas.StatusCreate, db: Session = Depends(get_db)):
    return crud.create_status(db=db, status=status)

@app.get("/statuses/", response_model=List[schemas.Status], tags=["Statuses"])
def read_statuses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_statuses(db, skip=skip, limit=limit)

@app.get("/statuses/{status_id}", response_model=schemas.Status, tags=["Statuses"])
def read_status(status_id: int, db: Session = Depends(get_db)):
    db_status = crud.get_status(db, status_id=status_id)
    if db_status is None:
        raise HTTPException(status_code=404, detail="Status not found")
    return db_status

# --- Reservation Endpoints ---
@app.post("/reservations/", response_model=schemas.Reservation, tags=["Reservations"])
def create_reservation(reservation: schemas.ReservationCreate, db: Session = Depends(get_db)):
    # czy gosc istnieje?
    db_guest = crud.get_guest(db, guest_id=reservation.guest_id)
    if not db_guest:
        raise HTTPException(status_code=404, detail=f"Guest with id {reservation.guest_id} not found")
    # czy status istnieje?
    db_status = crud.get_status(db, status_id=reservation.status_id)
    if not db_status:
        raise HTTPException(status_code=404, detail=f"Status with id {reservation.status_id} not found")
    
    # czy pokoje istnieja?
    total_price = Decimal("0.0")
    for room_id in reservation.room_ids:
        db_room = crud.get_room(db, room_id=room_id)
        if not db_room:
            raise HTTPException(status_code=404, detail=f"Room with id {room_id} not found")
        nights = (reservation.check_out_date - reservation.check_in_date).days
        total_price += Decimal(db_room.price_per_night * nights)
        reservation.total_price = total_price
    created_reservation = crud.create_reservation(db=db, reservation=reservation)

    #actually jest w crudzie ale gorzej wiec jednak siedzi tutaj:

    status_unpaid = 7
    db_payment = crud.create_payment(db=db, payment=schemas.PaymentCreate(
        reservation_id=created_reservation.id,
        status_id=status_unpaid,
        total_amount=reservation.total_price
    ))
    if not db_payment:
        raise HTTPException(status_code=500, detail="Failed to create payment for the reservation")
    

    return created_reservation

@app.get("/reservations/", response_model=List[schemas.Reservation], tags=["Reservations"])
def read_reservations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_reservations(db, skip=skip, limit=limit)

@app.get("/reservations/{reservation_id}", response_model=schemas.Reservation, tags=["Reservations"])
def read_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = crud.get_reservation(db, reservation_id=reservation_id)
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return db_reservation

@app.get("/reservations/room/{room_id}", response_model=List[schemas.Reservation], tags=["Reservations"])
def get_ongoing_and_next_reservations_by_room(room_id: int, db: Session = Depends(get_db)):
    db_ongoing_and_next = crud.get_ongoing_and_next_reservations_by_room(db, room_id=room_id)
    if db_ongoing_and_next is None:
        raise HTTPException(status_code=404, detail="No ongoing or next reservations found for this room")
    return db_ongoing_and_next


@app.delete("/reservations/{reservation_id}", tags=["Reservations"])
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = crud.get_reservation(db, reservation_id=reservation_id)
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    crud.delete_reservation(db, reservation_id=reservation_id)
    return {"detail": f"Reservation {reservation_id} deleted successfully"}


# --- Service Endpoints ---
@app.post("/services/", response_model=schemas.Service, tags=["Services"])
def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    return crud.create_service(db=db, service=service)

@app.get("/services/", response_model=List[schemas.Service], tags=["Services"])
def read_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_services(db, skip=skip, limit=limit)

@app.get("/services/{service_id}", response_model=schemas.Service, tags=["Services"])
def read_service(service_id: int, db: Session = Depends(get_db)):
    db_service = crud.get_service(db, service_id=service_id)
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return db_service

# --- RoomService Endpoints ---
@app.post("/roomservices/", response_model=schemas.RoomService, tags=["Room Services"])
def create_room_service(room_service: schemas.RoomServiceCreate, db: Session = Depends(get_db)):
    # czy rezerwacja istnieje?
    db_reservation = crud.get_reservation(db, reservation_id=room_service.reservation_id)
    if not db_reservation:
        raise HTTPException(status_code=404, detail=f"Reservation with id {room_service.reservation_id} not found")
    # czy serwis istnieje?
    db_service = crud.get_service(db, service_id=room_service.service_id)
    if not db_service:
        raise HTTPException(status_code=404, detail=f"Service with id {room_service.service_id} not found")
    return crud.create_room_service(db=db, room_service=room_service)

@app.get("/roomservices/", response_model=List[schemas.RoomService], tags=["Room Services"])
def read_room_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_room_services(db, skip=skip, limit=limit)

@app.get("/roomservices/{room_service_id}", response_model=schemas.RoomService, tags=["Room Services"])
def read_room_service(room_service_id: int, db: Session = Depends(get_db)):
    db_room_service = crud.get_room_service(db, room_service_id=room_service_id)
    if db_room_service is None:
        raise HTTPException(status_code=404, detail="RoomService not found")
    return db_room_service

@app.get("/roomservices/reservation/{reservation_id}", response_model=List[schemas.RoomService], tags=["Room Services"])
def read_room_service_by_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_room_service = crud.get_room_service_by_reservation(db, reservation_id=reservation_id)
    if db_room_service is None:
        raise HTTPException(status_code=404, detail="RoomService not found")
    return db_room_service

@app.get("/roomservices/reservation/{reservation_id}/sum", response_model=float, tags=["Room Services"])
def sum_room_services_by_reservation(reservation_id: int, db: Session = Depends(get_db)):
    room_services = db.query(models.RoomService).filter(models.RoomService.reservation_id == reservation_id).all()
    total = sum(rs.actual_price for rs in room_services if rs.actual_price is not None)
    return total



# --- Payment Endpoints ---
@app.post("/payments/", response_model=schemas.Payment, tags=["Payments"])
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    # czy rezerwacja istnieje?
    db_reservation = crud.get_reservation(db, reservation_id=payment.reservation_id)
    if not db_reservation:
        raise HTTPException(status_code=404, detail=f"Reservation with id {payment.reservation_id} not found")
    # czy status istnieje?
    db_status = crud.get_status(db, status_id=payment.status_id)
    if not db_status:
        raise HTTPException(status_code=404, detail=f"Status with id {payment.status_id} not found")
    return crud.create_payment(db=db, payment=payment)

@app.get("/payments/", response_model=List[schemas.Payment], tags=["Payments"])
def read_payments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_payments(db, skip=skip, limit=limit)

@app.get("/payments/{payment_id}", response_model=schemas.Payment, tags=["Payments"])
def read_payment(payment_id: int, db: Session = Depends(get_db)):
    db_payment = crud.get_payment(db, payment_id=payment_id)
    if db_payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return db_payment

@app.put("/payments/by-reservation/{reservation_id}/paid", response_model=schemas.Payment, tags=["Payments"])
def set_payment_paid_by_reservation(reservation_id: int, db: Session = Depends(get_db)):
    status_id = 6  # id 6 = paid
    db_payment = db.query(models.Payment).filter(models.Payment.reservation_id == reservation_id).first()
    if db_payment is None:
        raise HTTPException(status_code=404, detail="Payment for this reservation not found")
    db_status = crud.get_status(db, status_id=status_id)
    if db_status is None:
        raise HTTPException(status_code=404, detail=f"Status with id {status_id} not found")
    db_payment.status_id = status_id
    db.commit()
    db.refresh(db_payment)
    return db_payment

@app.put("/payments/by-reservation/{reservation_id}/unpaid", response_model=schemas.Payment, tags=["Payments"])
def set_payment_unpaid_by_reservation(reservation_id: int, db: Session = Depends(get_db)):
    status_id = 7  # id 7 = unpaid
    db_payment = db.query(models.Payment).filter(models.Payment.reservation_id == reservation_id).first()
    if db_payment is None:
        raise HTTPException(status_code=404, detail="Payment for this reservation not found")
    db_status = crud.get_status(db, status_id=status_id)
    if db_status is None:
        raise HTTPException(status_code=404, detail=f"Status with id {status_id} not found")
    db_payment.status_id = status_id
    db.commit()
    db.refresh(db_payment)
    return db_payment

# --- RoomStatus Endpoints ---
@app.post("/roomstatuses/", response_model=schemas.RoomStatus, tags=["Room Statuses"])
def create_room_status(room_status: schemas.RoomStatusCreate, db: Session = Depends(get_db)):
    # czy pokoj istnieje?
    db_room = crud.get_room(db, room_id=room_status.room_id)
    if not db_room:
        raise HTTPException(status_code=404, detail=f"Room with id {room_status.room_id} not found")
    # czy status istnieje?
    db_status = crud.get_status(db, status_id=room_status.status_id)
    if not db_status:
        raise HTTPException(status_code=404, detail=f"Status with id {room_status.status_id} not found")
    return crud.create_room_status(db=db, room_status=room_status)

@app.get("/roomstatuses/", response_model=List[schemas.RoomStatus], tags=["Room Statuses"])
def read_all_room_statuses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_room_statuses(db, skip=skip, limit=limit)

@app.get("/roomstatuses/{room_id}", response_model=schemas.RoomStatus, tags=["Room Statuses"])
def read_room_status(room_id: int, db: Session = Depends(get_db)):
    db_room_status = crud.get_room_status_by_room_id(db, room_id=room_id)
    if db_room_status is None:
        raise HTTPException(status_code=404, detail=f"RoomStatus not found for room_id {room_id}")
    return db_room_status


@app.put("/roomstatuses/{room_id}/{set_id}/{note}", response_model=schemas.RoomStatus, tags=["Room Statuses"])
def set_room_to_status(room_id: int, set_id: int, note: str, db: Session = Depends(get_db)):
    new_status = db.query(models.Status).filter(models.Status.id == str(set_id)).first()
    if not new_status:
        raise HTTPException(status_code=404, detail=f"Status id {set_id} not found")
    # znajdz roomstatus dla tego pokoju
    db_room_status = db.query(models.RoomStatus).filter(models.RoomStatus.room_id == room_id).first()
    if not db_room_status:
        # jesli nie istnieje, to go stworz
        room_status_data = schemas.RoomStatusCreate(room_id=room_id, status_id=new_status.id)
        return crud.create_room_status(db=db, room_status=room_status_data)
    # jesli istnieje, to go zaktualizuj 
    db_room_status.status_id = new_status.id
    db_room_status.notes = note
    db.commit()
    db.refresh(db_room_status)
    return db_room_status

# znajdz pokoje dostepne w danym przedziale czasowym
@app.get("/rooms/{check_in_date}/{check_out_date}", response_model=List[schemas.Room], tags=["Rooms"])
def read_available_rooms(check_in_date: str, check_out_date: str, db: Session = Depends(get_db)):
    # konwersja dat z formatu string do datetime
    try:
        check_in_date = datetime.datetime.strptime(check_in_date, "%Y-%m-%d")
        check_out_date = datetime.datetime.strptime(check_out_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    # wywolanie funkcji z cruda
    available_rooms = crud.get_available_rooms(db, check_in_date=check_in_date, check_out_date=check_out_date)
    
    if not available_rooms:
        raise HTTPException(status_code=404, detail="No available rooms found for the given date range.")
    
    return available_rooms


# --- Root Endpoint ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Hotel Management API"}