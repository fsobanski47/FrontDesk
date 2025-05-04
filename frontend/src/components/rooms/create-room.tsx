import { useNavigate } from "react-router-dom";
import { MainLayout } from "../welcome-screen";
import { createContainerStyles, headingStyles } from "./styles";
import { useState } from "react";
import { sampleRooms } from "../../data/sample";
import { roomTypes } from "../../types/rooms";
import { Room, RoomStatusType } from "../../types";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

export default function CreateRoom() {
  const navigate = useNavigate();

  const nextId = sampleRooms.length + 1;

  const [roomNumber, setRoomNumber] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number>(roomTypes[0].id);

  const handleCreate = () => {
    if (
      roomNumber === "" ||
      price === "" ||
      isNaN(roomNumber) ||
      isNaN(price)
    ) {
      alert("Please enter valid numbers for Room Number and Price.");
      return;
    }
    const selectedType = roomTypes.find((type) => type.id === typeId);
    if (!selectedType) return;

    const newRoom: Room = {
      id: nextId,
      roomNumber: Number(roomNumber),
      roomType: selectedType,
      pricePerNight: Number(price),
      roomStatus: {
        roomId: nextId,
        statusId: RoomStatusType.Available,
        notes: null,
      },
    };

    sampleRooms.push(newRoom);
    navigate("/rooms");
  };

  return (
    <MainLayout>
      <h2 style={headingStyles}>Create Room</h2>

      <Box sx={createContainerStyles}>
        <TextField label="ID" value={nextId} disabled fullWidth />

        <TextField
          label="Room Number"
          type="number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(Number(e.target.value))}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Room Type</InputLabel>
          <Select
            value={typeId}
            label="Room Type"
            onChange={(e) => setTypeId(Number(e.target.value))}
          >
            {roomTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
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
        />

        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </Box>
    </MainLayout>
  );
}
