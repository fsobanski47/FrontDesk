import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { Room, RoomStatus, RoomStatusType, RoomType } from "../../types";
import { MainLayout } from "../welcome-screen";
import { useEffect, useState } from "react";
import { Endpoints, ROOMS_PER_PAGE } from "../../constants";
import {
  roomCardStyles,
  roomsGridStyles,
  roomsContainerStyles,
  titleStyles,
  headingStyles,
  paginationContainerStyles,
  filtersContainerStyles,
  createButtonStyles,
} from "./styles";
import { getStatusColor } from "./utils";
import { Link, useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/use-http";

type RoomCardProps = {
  room: Room;
};

function RoomCard({ room }: RoomCardProps) {
  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);

  useEffect(() => {
    const fetchRoomStatus = async () => {
      try {
        const res = await fetch(Endpoints.ROOM_STATUS(room.id));
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setRoomStatus(data);
      } catch (err) {
        console.error("Failed to fetch room status:", err);
      }
    };

    fetchRoomStatus();
  }, [room.id]);

  if (!roomStatus) return <></>;

  const statusColor = getStatusColor(roomStatus.status_id);

  return (
    <Link
      to={`/rooms/room-view?roomId=${room.id}`}
      style={{ textDecoration: "none" }}
    >
      <Button
        variant="contained"
        style={{
          ...roomCardStyles,
          backgroundColor: statusColor,
        }}
      >
        {room.id}
      </Button>
    </Link>
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

type RoomFilterProps = {
  selectedType: number | "all";
  onChange: (value: number | "all") => void;
};

function RoomFilter({ selectedType, onChange }: RoomFilterProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const res = await fetch(Endpoints.ROOM_TYPES);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setRoomTypes(data);
      } catch (err) {
        console.error("Failed to fetch room types:", err);
      }
    };

    fetchRoomTypes();
  }, []);

  return (
    <FormControl fullWidth style={{ marginBottom: 20, maxWidth: 300 }}>
      <InputLabel id="room-type-label" style={{ color: "white" }}>
        Room Type
      </InputLabel>
      <Select
        labelId="room-type-label"
        value={selectedType}
        onChange={(e) => onChange(e.target.value as number | "all")}
        style={{ color: "white", backgroundColor: "#4dabf5" }}
      >
        <MenuItem value="all">All</MenuItem>
        {roomTypes.map((type) => (
          <MenuItem key={type.id} value={type.id}>
            {type.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function RoomStatusLegend() {
  const statusLabels = {
    [RoomStatusType.Available]: "Available",
    [RoomStatusType.Occupied]: "Occupied",
    [RoomStatusType.Maintenance]: "Maintenance",
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {Object.values(RoomStatusType)
        .filter((v) => typeof v === "number")
        .map((statusId) => (
          <Box key={statusId} display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: getStatusColor(statusId as RoomStatusType),
                marginBottom: "20px",
              }}
            />
            <span
              style={{
                color: "white",
                fontSize: "0.9rem",
                marginBottom: "20px",
              }}
            >
              {statusLabels[statusId as RoomStatusType]}
            </span>
          </Box>
        ))}
    </Box>
  );
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [roomTypeFilter, setRoomTypeFilter] = useState<number | "all">("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch(Endpoints.ROOMS);
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();
        setRooms(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <p>Loading...</p>
      </MainLayout>
    );
  }

  if (error || !rooms) {
    return (
      <MainLayout>
        <p>Error: {error}</p>
      </MainLayout>
    );
  }

  const filteredRooms =
    roomTypeFilter === "all"
      ? rooms
      : rooms.filter((room) => room.room_type_id === roomTypeFilter);

  const totalPages = Math.ceil(filteredRooms.length / ROOMS_PER_PAGE);
  const paginatedRooms = filteredRooms.slice(
    (page - 1) * ROOMS_PER_PAGE,
    page * ROOMS_PER_PAGE
  );

  return (
    <MainLayout>
      <div style={roomsContainerStyles}>
        <div style={titleStyles}>
          <h2 style={headingStyles}>Rooms</h2>
        </div>
        <div style={filtersContainerStyles}>
          <RoomStatusLegend />
          <RoomFilter
            selectedType={roomTypeFilter}
            onChange={(value) => {
              setRoomTypeFilter(value);
              setPage(1);
            }}
          />
          <Button
            variant="contained"
            style={createButtonStyles}
            onClick={() => navigate("/rooms/create-room")}
          >
            Create Room
          </Button>
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
