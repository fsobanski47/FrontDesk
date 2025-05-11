import { Guest, Reservation, ReservationRoom, Room, RoomStatusType } from "../types";
import { roomTypes } from "../types/rooms";

export const sampleRooms: Room[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  const roomNumber = id;
  const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
  const pricePerNight = 150 + Math.floor(Math.random() * 150);

  const statusType = Math.floor(Math.random() * 3) + 1;
  let notes: string | null = null;

  if (statusType === RoomStatusType.Occupied) {
    notes = "Room Occupied";
  } else if (statusType === RoomStatusType.Maintenance) {
    notes = "Room is under repair";
  }

  return {
    id,
    roomNumber,
    roomType,
    pricePerNight,
    roomStatus: {
      roomId: id,
      statusId: statusType,
      notes,
    },
  };
});

export const sampleGuests: Guest[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  firstName: `Guest${i + 1}`,
  lastName: `Surname${i + 1}`,
  phone: `+481234567${(i % 10).toString().padStart(2, "0")}`,
  email: `guest${i + 1}@example.com`,
}));

let reservationId = 1;
export const sampleReservations: Reservation[] = [];
export const sampleReservationRooms: ReservationRoom[] = [];

sampleRooms.forEach((room, index) => {
  const guest = sampleGuests[index % sampleGuests.length];
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + index);
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkInDate.getDate() + 2);
  const totalPrice = room.pricePerNight * 2;

  sampleReservations.push({
    id: reservationId,
    guestId: guest.id,
    checkInDate,
    checkOutDate,
    totalPrice,
  });

  sampleReservationRooms.push({
    reservationId,
    roomId: room.id,
  });

  reservationId++;
});
