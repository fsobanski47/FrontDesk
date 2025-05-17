import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import dayjs from "dayjs";
import {
  sampleReservationRooms,
  sampleReservations,
  sampleRooms,
  sampleGuests,
} from "../../data/sample";
import { roomTypes } from "../../types/rooms";
import { RoomStatusType } from "../../types";

type RoomSelectionDialogProps = {
  open: boolean;
  onClose: () => void;
  startDate: string | null;
  endDate: string | null;
  guestsCount: number;
  onReservationAdded?: () => void;
};

function isRoomOccupied(roomId: number, date: Date) {
  return sampleReservationRooms.some((rr) => {
    if (rr.roomId !== roomId) {
      return false;
    }
    const reservation = sampleReservations.find(
      (res) => res.id === rr.reservationId
    );
    if (!reservation) {
      return false;
    }
    return (
      (dayjs(date).isSame(dayjs(reservation.checkInDate), "day") ||
        dayjs(date).isAfter(dayjs(reservation.checkInDate), "day")) &&
      dayjs(date).isBefore(dayjs(reservation.checkOutDate), "day")
    );
  });
}

export const RoomSelectionDialog: React.FC<RoomSelectionDialogProps> = ({
  open,
  onClose,
  startDate,
  endDate,
  guestsCount,
  onReservationAdded,
}) => {
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const [guestFirstName, setGuestFirstName] = useState("");
  const [guestLastName, setGuestLastName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const dateRange = React.useMemo(() => {
    if (!startDate || !endDate) return [];
    const start = dayjs(startDate).subtract(10, "day");
    const end = dayjs(endDate).add(10, "day");
    const dates: Date[] = [];
    let current = start;
    while (current.isBefore(end) || current.isSame(end, "day")) {
      dates.push(current.toDate());
      current = current.add(1, "day");
    }
    return dates;
  }, [startDate, endDate]);

  const filteredRooms = React.useMemo(() => {
    if (!startDate || !endDate) return [];

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    return sampleRooms.filter((room) => {
      const capacityMap: Record<number, number> = {
        1: 1,
        2: 2,
        3: 4,
      };
      const capacity = capacityMap[room.roomType.id] ?? 1;
      if (capacity < guestsCount) {
        return false;
      }

      const isReservedInRange = sampleReservationRooms.some((rr) => {
        if (rr.roomId !== room.id) return false;
        const reservation = sampleReservations.find(
          (res) => res.id === rr.reservationId
        );
        if (!reservation) return false;

        const resStart = dayjs(reservation.checkInDate);
        const resEnd = dayjs(reservation.checkOutDate);

        return resStart.isBefore(end, "day") && resEnd.isAfter(start, "day");
      });

      return !isReservedInRange;
    });
  }, [guestsCount, startDate, endDate]);

  const toggleRoomSelection = (roomId: number) => {
    setSelectedRoomIds((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const isFormValid =
    selectedRoomIds.length > 0 &&
    startDate &&
    endDate &&
    guestsCount > 0 &&
    guestFirstName.trim() !== "" &&
    guestLastName.trim() !== "" &&
    guestEmail.trim() !== "" &&
    guestPhone.trim() !== "";

  const handleAddReservation = () => {
    // if (!isFormValid) return;
    // const newGuestId = sampleGuests.length
    //   ? Math.max(...sampleGuests.map((g) => g.id)) + 1
    //   : 1;
    // const newReservationId = sampleReservations.length
    //   ? Math.max(...sampleReservations.map((r) => r.id)) + 1
    //   : 1;
    // sampleGuests.push({
    //   id: newGuestId,
    //   firstName: guestFirstName,
    //   lastName: guestLastName,
    //   email: guestEmail,
    //   phone: guestPhone,
    // });
    // const checkIn = dayjs(startDate).toDate();
    // const checkOut = dayjs(endDate).toDate();
    // const nights = dayjs(endDate).diff(dayjs(startDate), "day");
    // let totalPrice = 0;
    // selectedRoomIds.forEach((roomId) => {
    //   const room = sampleRooms.find((r) => r.id === roomId);
    //   if (room) totalPrice += room.pricePerNight * nights;
    // });
    // sampleReservations.push({
    //   id: newReservationId,
    //   guestId: newGuestId,
    //   checkInDate: checkIn,
    //   checkOutDate: checkOut,
    //   totalPrice,
    // });
    // selectedRoomIds.forEach((roomId) => {
    //   sampleReservationRooms.push({
    //     reservationId: newReservationId,
    //     roomId,
    //   });
    //   const room = sampleRooms.find((r) => r.id === roomId);
    //   if (room) {
    //     room.roomStatus.statusId = RoomStatusType.Occupied;
    //     room.roomStatus.notes = "Room Occupied";
    //   }
    // });
    // onClose();
    // setSelectedRoomIds([]);
    // setGuestFirstName("");
    // setGuestLastName("");
    // setGuestEmail("");
    // setGuestPhone("");
    // if (onReservationAdded) onReservationAdded();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      scroll="paper"
    >
      <DialogTitle>Choose Rooms</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Guest Information</Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              mt: 1,
              mb: 2,
            }}
          >
            <TextField
              label="First Name"
              value={guestFirstName}
              onChange={(e) => setGuestFirstName(e.target.value)}
              required
            />
            <TextField
              label="Last Name"
              value={guestLastName}
              onChange={(e) => setGuestLastName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
            />
            <TextField
              label="Phone"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              required
            />
          </Box>
        </Box>
        {filteredRooms.length === 0 ? (
          <Typography>
            No rooms available for the selected guests and dates.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>Room ID</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Price per night</TableCell>
                  {dateRange.map((date) => (
                    <TableCell
                      key={dayjs(date).format("YYYY-MM-DD")}
                      align="center"
                    >
                      {dayjs(date).format("MM-DD")}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRooms.map((room) => {
                  const isSelected = selectedRoomIds.includes(room.id);
                  return (
                    <TableRow key={room.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleRoomSelection(room.id)}
                          inputProps={{
                            "aria-label": `select room ${room.id}`,
                          }}
                        />
                      </TableCell>
                      <TableCell>{room.id}</TableCell>
                      <TableCell>
                        {roomTypes.find((rt) => rt.id === room.roomType.id)
                          ?.name ?? "Unknown"}
                      </TableCell>
                      <TableCell>${room.pricePerNight}</TableCell>
                      {dateRange.map((date) => {
                        const occupied = isRoomOccupied(room.id, date);
                        return (
                          <TableCell
                            key={dayjs(date).format("YYYY-MM-DD")}
                            align="center"
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                bgcolor: occupied ? red[500] : green[500],
                                margin: "auto",
                              }}
                              title={occupied ? "Occupied" : "Available"}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!isFormValid}
          onClick={handleAddReservation}
        >
          Add Reservation
        </Button>
      </DialogActions>
    </Dialog>
  );
};
