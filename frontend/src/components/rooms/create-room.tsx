import { MainLayout } from "../welcome-screen";
import { createContainerStyles, headingStyles } from "./styles";
import { Room, RoomStatusType, RoomTypeType } from "../../types";
import { Endpoints } from "../../constants";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const navigate = useNavigate();

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
    // if (
    //   roomNumber === "" ||
    //   price === "" ||
    //   isNaN(Number(roomNumber)) ||
    //   isNaN(Number(price))
    // ) {
    //   alert("Please enter valid numbers for Room Number and Price.");
    //   return;
    // }
    // const newRoom = {
    //   id: nextId,
    //   room_number: Number(roomNumber),
    //   room_type_id: typeId,
    //   price_per_night: Number(price),
    // };
    // try {
    //   const response = await fetch(Endpoints.ROOMS, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(newRoom),
    //   });
    //   if (!response.ok) {
    //     throw new Error("Failed to create room.");
    //   }
    //   navigate("/rooms");
    // } catch (err) {
    //   console.error("Create room error:", err);
    //   alert("Something went wrong while creating the room.");
    // }
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
    </MainLayout>
  );
}
