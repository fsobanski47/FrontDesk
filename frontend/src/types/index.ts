export type RoomStatus = {
  room_id: number;
  status_id: number;
  notes: string | null;
  id: number;
  room: Room;
  status: Status;
};

export type RoomStatusCreate = {
  room_id: number;
  status_id: number;
  notes: string | null;
};

export type Room = {
  room_number: string;
  price_per_night: string;
  room_type_id: number;
  id: number;
  room_type: RoomType;
};

export type RoomType = {
  name: string;
  description: string | null;
  id: number;
};

export type RoomCreate = {
  room_number: string;
  price_per_night: number | string;
  room_type_id: number;
};

export type RoomTypeCreate = {
  name: string;
  description: string | null;
};

export type Status = {
  type: string;
  name: string;
  id: number;
};

export type StatusCreate = {
  type: string;
  name: string;
};

export type Guest = {
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
  id: number;
};

export type GuestCreate = {
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
};

export type Reservation = {
  guest_id: number;
  check_in_date: Date;
  check_out_date: Date;
  status_id: number;
  total_price: string | null;
  id: number;
  guest: Guest;
  status: Status;
  rooms: Room[];
};

export type ReservationCreate = {
  guest_id: number;
  check_in_date: Date;
  check_out_date: Date;
  status_id: number;
  total_price: number | string | null;
  room_ids: number[];
};

export type ReservationRoom = {
  reservationId: number;
  roomId: number;
};

export type Payment = {
  reservation_id: number;
  total_amount: string;
  status_id: number;
  id: number;
  status: Status;
};

export type PaymentCreate = {
  reservation_id: number;
  total_amount: number | string;
  status_id: number;
};

export type RoomService = {
  reservation_id: number;
  service_id: number;
  schedule_time: string | null;
  actual_price: string;
  id: number;
  reservation: Reservation;
  service: Service;
};

export type RoomServiceCreate = {
  reservation_id: number;
  service_id: number;
  schedule_time: string | null;
  actual_price: number | string;
};

export type Service = {
  name: string;
  price: string;
  service_type: string;
  id: number;
};

export type ServiceCreate = {
  name: string;
  price: number | string;
  service_type: string;
};

export enum RoomStatusType {
  Available = 3,
  Occupied = 4,
  Maintenance = 5,
}

export enum ReservationStatusType {
  Awaiting = 1,
  Confirmed = 2,
}

export enum PaymentStatusType {
  Paid = 6,
  Unpaid = 7,
}

export enum RoomTypeType {
  Standard = 1,
  Penthouse = 2,
}
