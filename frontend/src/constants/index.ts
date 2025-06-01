export const ROOMS_PER_PAGE = 21;
export const API_BASE_URL = "http://localhost:8000";

const buildUrl = (endpoint: string) => `${API_BASE_URL}/${endpoint}`;

export const Endpoints = {
  ROOMS: buildUrl("rooms"),
  ROOM: (roomId: number) => buildUrl(`rooms/${roomId}`),
  ROOMS_AVAILABLE: (checkInDate: string, checkOutDate: string) =>
    buildUrl(`rooms/${checkInDate}/${checkOutDate}`),
  STATUSES: buildUrl("statuses"),
  STATUS: (statusId: number) => buildUrl(`statuses/${statusId}`),
  RESERVATIONS: buildUrl("reservations"),
  RESERVATION: (reservationId: number) =>
    buildUrl(`reservations/${reservationId}`),
  SERVICES: buildUrl("services"),
  SERVICE: (serviceId: number) => buildUrl(`services/${serviceId}`),
  ROOM_SERVICES: buildUrl("roomservices"),
  ROOM_SERVICE: (roomServiceId: number) =>
    buildUrl(`roomservices/${roomServiceId}`),
  PAYMENTS: buildUrl("payments"),
  PAYMENT: (paymentId: number) => buildUrl(`payments/${paymentId}`),
  ROOM_STATUSES: buildUrl(`roomstatuses`),
  ROOM_STATUS: (roomStatusId: number) =>
    buildUrl(`roomstatuses/${roomStatusId}`),
  ROOM_TYPES: buildUrl("roomtypes"),
  ROOM_TYPE: (roomTypeId: number) => buildUrl(`roomtypes/${roomTypeId}`),
  GUESTS: buildUrl("guests"),
  GUEST: (guestId: number) => buildUrl(`guests/${guestId}`),
  RESERVATION_GUEST: (reservationId: number) =>
    buildUrl(`guests/reservation/${reservationId}`),
  ROOM_RESERVATIONS: (roomId: number) =>
    buildUrl(`reservations/room/${roomId}`),
  STATUS_RESTORE: (roomId: number) => buildUrl(`rooms/${roomId}/restore`),
  STATUS_MAINTENANCE: (roomId: number) =>
    buildUrl(`rooms/${roomId}/maintenance`),
  TOGGLE_PAY: (reservationId: number) =>
    buildUrl(`payments/by-reservation/${reservationId}`),
};
