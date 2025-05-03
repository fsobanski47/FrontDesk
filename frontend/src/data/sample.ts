import { Room, RoomStatusType } from "../types";
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
