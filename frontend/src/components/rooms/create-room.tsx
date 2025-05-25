import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Endpoints } from "../../constants";
import { Room, RoomTypeType } from "../../types";
import { MainLayout } from "../welcome-screen";
import { createContainerStyles, headingStyles } from "./styles";

export default function CreateRoom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomNumber, setRoomNumber] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number>(RoomTypeType.Standard);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(Endpoints.ROOMS);
        if (!response.ok) throw new Error("Failed to fetch rooms.");
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const nextId = rooms.length + 1;

  const handleCreate = async () => {
    if (
      roomNumber === "" ||
      price === "" ||
      isNaN(Number(roomNumber)) ||
      isNaN(Number(price))
    ) {
      alert("Please enter valid numbers for Room Number and Price.");
      return;
    }

    const newRoom = {
      room_number: String(roomNumber),
      price_per_night: Number(price),
      room_type_id: typeId,
    };

    try {
      // 1. POST room
      const roomResponse = await fetch(`${Endpoints.ROOMS}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });

      if (!roomResponse.ok) {
        throw new Error("Failed to create room.");
      }

      const createdRoom = await roomResponse.json();

      // 2. POST room status
      const roomTypeName = Object.keys(RoomTypeType).find(
        (key) => RoomTypeType[key as keyof typeof RoomTypeType] === typeId
      );

      const statusPayload = {
        room_id: createdRoom.id,
        status_id: 3, // Available
        notes: `${roomTypeName} Room`,
      };

      const statusResponse = await fetch(`${Endpoints.ROOM_STATUSES}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusPayload),
      });

      if (!statusResponse.ok) {
        throw new Error("Failed to set room status.");
      }

      alert("Room and status created successfully.");
      setRoomNumber("");
      setPrice("");
      setTypeId(RoomTypeType.Standard);
    } catch (err) {
      console.error("Create room or status error:", err);
      alert("Something went wrong while creating the room or its status.");
    }
  };
  if (loading)
    return (
      <MainLayout>
        <p>Loading...</p>
      </MainLayout>
    );

  return (
    <MainLayout>
      <h2 style={headingStyles}>Create Room</h2>

      <Paper elevation={3} sx={{ p: 4, backgroundColor: "#fff" }}>
        <Box sx={createContainerStyles}>
          <TextField label="ID" value={nextId} disabled fullWidth />

          <TextField
            label="Room Number"
            type="number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 0 }}
          />

          <FormControl fullWidth>
            <InputLabel>Room Type</InputLabel>
            <Select
              value={typeId}
              label="Room Type"
              onChange={(e) => setTypeId(Number(e.target.value))}
            >
              {Object.entries(RoomTypeType)
                .filter(([_, value]) => typeof value === "number")
                .map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="Price Per Night"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 0 }}
          />

          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </Box>
      </Paper>
    </MainLayout>
  );
}
