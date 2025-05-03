import { RoomType } from ".";

export const roomTypes: RoomType[] = [
  { id: 1, name: "Single", description: "Single bed room for one person" },
  { id: 2, name: "Double", description: "Double bed for two guests" },
  { id: 3, name: "Suite", description: "Luxury suite with lounge area" },
];

export const statusTypes = [
  { type: 1, name: "Available" },
  { type: 2, name: "Occupied" },
  { type: 3, name: "Maintenance" },
];
