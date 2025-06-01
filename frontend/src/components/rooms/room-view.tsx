import "@mantine/core/styles.css";
import { Calendar } from "@mantine/dates";
import "@mantine/dates/styles.css";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Endpoints } from "../../constants";
import {
  Guest,
  Reservation,
  Room,
  RoomStatus,
  RoomStatusType,
} from "../../types";
import { MainLayout } from "../welcome-screen";
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
  const [status, setStatus] = useState<RoomStatus | null>(null);

  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(1);
  const [scheduledDate, setScheduledDate] = useState<Dayjs | null>(null);
  const [actualPrice, setActualPrice] = useState<number>(50);

  const servicePrices: Record<number, number> = {
    1: 50,
    2: 30,
    3: 0,
  };

  const handleServiceChange = (value: number) => {
    setSelectedServiceId(value);
    setActualPrice(servicePrices[value]);
  };

  const handleAddService = async () => {
    if (!selectedReservation || !scheduledDate) {
      alert("Please select a reservation and schedule date.");
      return;
    }

    const payload = {
      reservation_id: selectedReservation.id,
      service_id: selectedServiceId,
      schedule_time: scheduledDate,
      actual_price: actualPrice,
    };

    try {
      const res = await fetch(`${Endpoints.ROOM_SERVICES}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to add room service.");
      }

      alert("Service added successfully.");
      setServiceDialogOpen(false);
    } catch (err) {
      console.error("Add service error:", err);
      alert("Failed to add service.");
    }
  };

  const handleStatusChange = async (checked: boolean) => {
    try {
      const endpoint = checked
        ? Endpoints.STATUS_MAINTENANCE(Number(roomId))
        : Endpoints.STATUS_RESTORE(Number(roomId));

      const res = await fetch(endpoint, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to update room status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update room status.");
    }
  };

  useEffect(() => {
    if (!roomId) return;

    const fetchData = async () => {
      try {
        const [roomRes, reservationsRes, statusRes] = await Promise.all([
          fetch(Endpoints.ROOM(Number(roomId))),
          fetch(Endpoints.ROOM_RESERVATIONS(Number(roomId))),
          fetch(Endpoints.ROOM_STATUS(Number(roomId))),
        ]);

        if (!roomRes.ok || !reservationsRes.ok || !statusRes.ok) {
          throw new Error("Failed to fetch one or more resources.");
        }

        const roomData = await roomRes.json();
        const reservationsData = await reservationsRes.json();
        const statusData = await statusRes.json();

        setRoom(roomData);
        setReservations(reservationsData);
        setStatus(statusData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [roomId, handleStatusChange]);

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
      const resGuest = reservation.guest;
      setSelectedReservation(reservation);
      setGuest(resGuest || null);
    } else {
      setSelectedReservation(null);
      setGuest(null);
    }
  };

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
          Room Number: {room.room_number}
        </Typography>
        <Typography variant="h6" color="white">
          Type: {room.room_type.name}
        </Typography>
        <Typography variant="h6" color="white">
          Price: ${room.price_per_night} per night
        </Typography>
        <Box display="flex" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={status?.status_id === RoomStatusType.Maintenance}
                onChange={(_, checked) => handleStatusChange(checked)}
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
                  onClick={() => setServiceDialogOpen(true)}
                >
                  Add Service
                </Button>

                <Dialog
                  open={serviceDialogOpen}
                  onClose={() => setServiceDialogOpen(false)}
                >
                  <DialogTitle>Add Room Service</DialogTitle>
                  <DialogContent>
                    <FormControlLabel
                      control={
                        <Select
                          fullWidth
                          value={selectedServiceId}
                          onChange={(e) =>
                            handleServiceChange(Number(e.target.value))
                          }
                          sx={{ mt: 2 }}
                        >
                          <MenuItem value={1}>Breakfast</MenuItem>
                          <MenuItem value={2}>Cleaning</MenuItem>
                          <MenuItem value={3}>Service</MenuItem>
                        </Select>
                      }
                      label=""
                    />

                    <TextField
                      label="Price"
                      value={`$${actualPrice}`}
                      fullWidth
                      margin="normal"
                      disabled
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Schedule Date"
                        value={scheduledDate}
                        onChange={(newValue) => setScheduledDate(newValue)}
                        minDateTime={dayjs().subtract(1, "day")}
                        maxDateTime={dayjs().add(1, "month")}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: "normal",
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </DialogContent>

                  <DialogActions>
                    <Button onClick={() => setServiceDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleAddService}>
                      Add Service
                    </Button>
                  </DialogActions>
                </Dialog>
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
