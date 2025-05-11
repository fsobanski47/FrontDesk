import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Guest, Reservation, Room } from "../../types";
import { MainLayout } from "../welcome-screen";
import { Typography, Box, Grid, Paper, Button } from "@mui/material";
import { sampleGuests, sampleReservationRooms, sampleReservations, sampleRooms } from "../../data/sample";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Calendar } from "@mantine/dates";
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
dayjs.extend(isBetween);


export default function RoomView() {
  const location = useLocation();
  const [room, setRoom] = useState<Room | null>(null);
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);

  useEffect(() => {
    if (roomId) {
      const roomData = sampleRooms.find((room) => room.id === Number(roomId));
      setRoom(roomData || null);

      const reservationIds = sampleReservationRooms
        .filter((rr) => rr.roomId === Number(roomId))
        .map((rr) => rr.reservationId);

      const roomReservations = sampleReservations.filter((res) =>
        reservationIds.includes(res.id)
      );

      setReservations(roomReservations);
    }
  }, [roomId]);

  const handleDateClick = (date: Date) => {
    const reservation = reservations.find((res) =>
      dayjs(date).isBetween(dayjs(res.checkInDate).startOf('day'), dayjs(res.checkOutDate).endOf('day'), null, '[]')
    );

    if (reservation) {
      setSelectedReservation(reservation);
      const resGuest = sampleGuests.find((g) => g.id === reservation.guestId);
      setGuest(resGuest || null);
    } else {
      setSelectedReservation(null);
      setGuest(null);
    }

  }

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

      <Grid container spacing={20} sx={{ marginTop: "10px" }}>
        <Grid size={{ xs: 12, md: 6 }} >
          <Typography variant="h5" color="white" gutterBottom sx={{textAlign: "center"}}>
            Reservations
          </Typography>
          <Paper elevation={3} sx={{ padding: 2, width: '300px', height: '320px', boxSizing: 'border-box'}}>
            <Calendar
              getDayProps={(date) => {
                const isReserved = reservations.some((res) =>
                  dayjs(date).isBetween(dayjs(res.checkInDate).startOf('day'), dayjs(res.checkOutDate).endOf('day'), null, '[]')
                );
                return {
                  selected: isReserved,
                  style: isReserved ? { backgroundColor: '#ff9800', color: 'white' } : {},
                  onClick: () => handleDateClick(dayjs(date).toDate()),
                };
              }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" color="white" gutterBottom sx={{ textAlign: "center" }}>
            Reservation Details
          </Typography>
          
          <Paper elevation={3} sx={{ padding: 2, width: '300px', height: '320px', boxSizing: 'border-box' }}>
            {selectedReservation && guest ? (
              <>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Reservation Details
                </Typography>
                <Typography>
                  <strong>Check-in:</strong> {dayjs(selectedReservation.checkInDate).format('YYYY-MM-DD')}
                </Typography>
                <Typography>
                  <strong>Check-out:</strong> {dayjs(selectedReservation.checkOutDate).format('YYYY-MM-DD')}
                </Typography>
                <Typography>
                  <strong>Reservation ID:</strong> {selectedReservation.id}
                </Typography>
                <Typography>
                  <strong>Guest:</strong> {guest.firstName} {guest.lastName}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {guest.phone}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {guest.email}
                </Typography>
                <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
                  Add Service
                </Button>
              </>
            ) : (
              <Typography variant="h6" color="black" sx={{ textAlign: "center" }}>
                Click on a reservation date for details
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
