import { Button, Pagination } from "@mui/material";
import { Room, RoomStatusType } from "../../types";
import { MainLayout } from "../welcome-screen";
import { sampleRooms } from "../../data/sample";
import { useState } from "react";
import { ROOMS_PER_PAGE } from "../../constants";
import {
  roomCardStyles,
  roomsGridStyles,
  roomsContainerStyles,
  titleStyles,
  headingStyles,
  paginationContainerStyles,
} from "./styles";

const getStatusColor = (statusType: number) => {
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

type RoomCardProps = {
  room: Room;
};

function RoomCard({ room }: RoomCardProps) {
  const statusColor = getStatusColor(room.roomStatus.statusId);

  return (
    <Button
      variant="contained"
      style={{
        ...roomCardStyles,
        backgroundColor: statusColor,
      }}
    >
      {room.roomNumber}
    </Button>
  );
}

type RoomsGridProps = {
  rooms: Room[];
};

function RoomsGrid({ rooms }: RoomsGridProps) {
  return (
    <div style={roomsGridStyles}>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

export default function Rooms() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(sampleRooms.length / ROOMS_PER_PAGE);
  const paginatedRooms = sampleRooms.slice(
    (page - 1) * ROOMS_PER_PAGE,
    page * ROOMS_PER_PAGE
  );

  return (
    <MainLayout>
      <div style={roomsContainerStyles}>
        <div style={titleStyles}>
          <h2 style={headingStyles}>Rooms</h2>
        </div>
        <RoomsGrid rooms={paginatedRooms} />

        <div style={paginationContainerStyles}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </div>
      </div>
    </MainLayout>
  );
}
