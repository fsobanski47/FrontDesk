export type RoomStatus = {
  roomId: number;
  statusId: RoomStatusType;
  notes: string | null;
};

export type Room = {
  id: number;
  roomNumber: number;
  roomType: RoomType;
  pricePerNight: number;
  roomStatus: RoomStatus;
};

export type RoomType = {
  id: number;
  name: string;
  description: string | null;
};

export enum RoomStatusType {
  Available = 1,
  Occupied = 2,
  Maintenance = 3,
}
