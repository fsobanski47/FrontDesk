import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Room } from "../../types";
import { MainLayout } from "../welcome-screen";
import { Typography, Box } from "@mui/material";
import { sampleRooms } from "../../data/sample";

export default function RoomView() {
  const location = useLocation();
  const [room, setRoom] = useState<Room | null>(null);
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");

  useEffect(() => {
    if (roomId) {
      const roomData = sampleRooms.find((room) => room.id === Number(roomId));
      setRoom(roomData || null);
    }
  }, [roomId]);

  if (!room) {
    return (
      <MainLayout>
        <Typography variant="h4">Room not found</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h4" color="white">
        Room Details
      </Typography>
      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        <Typography variant="h6" color="white">
          Room Number: {room.roomNumber}
        </Typography>
        <Typography variant="h6" color="white">
          Type: {room.roomType.name}
        </Typography>
        <Typography variant="h6" color="white">
          Price: ${room.pricePerNight} per night
        </Typography>
        <Typography variant="h6" color="white">
          Status: {room.roomStatus.notes || "Available"}
        </Typography>
      </Box>
    </MainLayout>
  );
}
