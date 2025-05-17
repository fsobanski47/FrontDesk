from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

# --- Guest Schemas ---
class GuestBase(BaseModel):
    first_name: str
    last_name: str
    phone: Optional[str] = None
    email: EmailStr

class GuestCreate(GuestBase):
    pass

class Guest(GuestBase):
    id: int
    class Config:
        from_attributes = True # Pydantic V2 (orm_mode w V1)

# --- RoomType Schemas ---
class RoomTypeBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoomTypeCreate(RoomTypeBase):
    pass

class RoomType(RoomTypeBase):
    id: int
    class Config:
        from_attributes = True

# --- Room Schemas ---
class RoomBase(BaseModel):
    room_number: str
    price_per_night: Decimal
    room_type_id: int

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    room_type: RoomType # Nested schema for reading
    class Config:
        from_attributes = True

# --- Status Schemas ---
class StatusBase(BaseModel):
    type: str
    name: str

class StatusCreate(StatusBase):
    pass

class Status(StatusBase):
    id: int
    class Config:
        from_attributes = True

# --- Reservation Schemas ---
class ReservationBase(BaseModel):
    guest_id: int
    check_in_date: datetime
    check_out_date: datetime
    status_id: int
    total_price: Optional[Decimal] = None

class ReservationCreate(ReservationBase):
    room_ids: List[int] # To associate rooms during creation

class Reservation(ReservationBase):
    id: int
    guest: Guest # Nested schema
    status: Status # Nested schema
    rooms: List[Room] # Nested list of rooms
    class Config:
        from_attributes = True

# --- RoomStatus Schemas ---
class RoomStatusBase(BaseModel):
    room_id: int
    status_id: int
    notes: Optional[str] = None

class RoomStatusCreate(RoomStatusBase):
    pass

class RoomStatus(RoomStatusBase):
    id: int
    room: Room # Nested
    status: Status # Nested
    class Config:
        from_attributes = True

# --- Service Schemas ---
class ServiceBase(BaseModel):
    name: str
    price: Decimal
    service_type: str

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    class Config:
        from_attributes = True

# --- RoomService Schemas ---
class RoomServiceBase(BaseModel):
    reservation_id: int
    service_id: int
    schedule_time: Optional[datetime] = None
    actual_price: Decimal

class RoomServiceCreate(RoomServiceBase):
    pass

class RoomService(RoomServiceBase):
    id: int
    reservation: Reservation # Nested, might be too much detail, consider ReservationBase
    service: Service # Nested
    class Config:
        from_attributes = True

# --- Payment Schemas ---
class PaymentBase(BaseModel):
    reservation_id: int
    total_amount: Decimal
    status_id: int

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: int
    # reservation: Reservation # Could be too much detail
    status: Status # Nested
    class Config:
        from_attributes = True