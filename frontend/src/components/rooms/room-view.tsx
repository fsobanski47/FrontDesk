import "@mantine/core/styles.css";
import { Calendar } from "@mantine/dates";
import "@mantine/dates/styles.css";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Guest,
  Reservation,
  Room,
  RoomStatus,
  RoomStatusType,
} from "../../types";
import { MainLayout } from "../welcome-screen";
import { useHttp } from "../../hooks/use-http";
import { Endpoints } from "../../constants";
dayjs.extend(isBetween);

export default function RoomView() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");

  const [room, setRoom] = useState<Room | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [status, setStatus] = useState<RoomStatus | null>(null);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const fetchData = async () => {
      try {
        const [roomRes, reservationsRes, guestsRes, statusRes] =
          await Promise.all([
            fetch(Endpoints.ROOM(Number(roomId))),
            fetch(Endpoints.RESERVATIONS),
            fetch(Endpoints.GUESTS),
            fetch(Endpoints.ROOM_STATUS(Number(roomId))),
          ]);

        if (
          !roomRes.ok ||
          !reservationsRes.ok ||
          !guestsRes.ok ||
          !statusRes.ok
        ) {
          throw new Error("Failed to fetch one or more resources.");
        }

        const roomData = await roomRes.json();
        const allReservations = await reservationsRes.json();
        const guestsData = await guestsRes.json();
        const statusData = await statusRes.json();

        console.log(roomData);

        setRoom(roomData);
        setGuests(guestsData);
        setStatus(statusData);

        const reservationIds = allReservations
          .filter((reservation: Reservation) =>
            reservation.rooms.some((room) => room.id === Number(roomId))
          )
          .map((reservation: Reservation) => reservation.id);

        const roomReservations = allReservations.filter((res: Reservation) =>
          reservationIds.includes(res.id)
        );

        setReservations(roomReservations);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [roomId]);

  const handleDateClick = (date: Date) => {
    const reservation = reservations.find((res) =>
      dayjs(date).isBetween(
        dayjs(res.check_in_date).startOf("day"),
        dayjs(res.check_out_date).endOf("day"),
        null,
        "[]"
      )
    );

    if (reservation) {
      const resGuest = guests.find((g) => g.id === reservation.guest_id);
      setSelectedReservation(reservation);
      setGuest(resGuest || null);
    } else {
      setSelectedReservation(null);
      setGuest(null);
    }
  };

  if (!room) {
    console.log("elo");
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
          Room Number: {room.room_number}
        </Typography>
        <Typography variant="h6" color="white">
          Type: {room.room_type.name}
        </Typography>
        <Typography variant="h6" color="white">
          Price: ${room.price_per_night} per night
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" color="white">
            Status: {status?.notes || "Available"}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={status?.id === RoomStatusType.Maintenance}
                onChange={(_, checked) => {
                  // status changing
                }}
                sx={{ color: "white" }}
              />
            }
            label={
              <Typography color="white" fontSize="0.875rem">
                Set as Maintenance
              </Typography>
            }
          />
        </Box>
      </Box>

      <Grid container spacing={20} sx={{ marginTop: "10px" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h5"
            color="white"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            Reservations
          </Typography>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              width: "300px",
              height: "320px",
              boxSizing: "border-box",
              margin: "0 auto",
            }}
          >
            <Calendar
              getDayProps={(date) => {
                const isReserved = reservations.some((res) =>
                  dayjs(date).isBetween(
                    dayjs(res.check_in_date).startOf("day"),
                    dayjs(res.check_out_date).endOf("day"),
                    null,
                    "[]"
                  )
                );
                return {
                  selected: isReserved,
                  style: isReserved
                    ? { backgroundColor: "#ff9800", color: "white" }
                    : {},
                  onClick: () => handleDateClick(dayjs(date).toDate()),
                };
              }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h5"
            color="white"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            Reservation Details
          </Typography>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              width: "300px",
              height: "320px",
              boxSizing: "border-box",
              margin: "0 auto",
            }}
          >
            {selectedReservation && guest ? (
              <>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Reservation Details
                </Typography>
                <Typography>
                  <strong>Check-in:</strong>{" "}
                  {dayjs(selectedReservation.check_in_date).format(
                    "YYYY-MM-DD"
                  )}
                </Typography>
                <Typography>
                  <strong>Check-out:</strong>{" "}
                  {dayjs(selectedReservation.check_out_date).format(
                    "YYYY-MM-DD"
                  )}
                </Typography>
                <Typography>
                  <strong>Reservation ID:</strong> {selectedReservation.id}
                </Typography>
                <Typography>
                  <strong>Guest:</strong> {guest.first_name} {guest.last_name}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {guest.phone}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {guest.email}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                >
                  Add Service
                </Button>
              </>
            ) : (
              <Typography
                variant="h6"
                color="black"
                sx={{ textAlign: "center" }}
              >
                Click on a reservation date for details
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
