import { RoomStatusType } from "../../types";

export const getStatusColor = (statusType: number) => {
  switch (statusType) {
    case RoomStatusType.Available:
      return "#0b1e3f";
    case RoomStatusType.Occupied:
      return "#FFCC00";
    case RoomStatusType.Maintenance:
      return "#FF0000";
    default:
      return "#0b1e3f";
  }
};
