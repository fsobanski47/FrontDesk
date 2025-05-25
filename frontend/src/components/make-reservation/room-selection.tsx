import React, { useState, useEffect } from "react";
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
  TablePagination,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import dayjs from "dayjs";
import { Endpoints } from "../../constants";
import { Reservation, Room, RoomTypeType } from "../../types";

type RoomSelectionDialogProps = {
  open: boolean;
  onClose: () => void;
  startDate: string | null;
  endDate: string | null;
  guestsCount: number;
};

function isRoomOccupied(
  roomId: number,
  date: Date,
  reservations: Reservation[] | null
) {
  if (!reservations) {
    return false;
  }

  return reservations.some((rr) => {
    if (!rr.rooms.some((r) => r.id === roomId)) {
      return false;
    }
    // find reservation by id (redundant here since rr is a reservation?)
    const reservation = reservations.find((res) => res.id === rr.id);
    if (!reservation) {
      return false;
    }
    return (
      (dayjs(date).isSame(dayjs(reservation.check_in_date), "day") ||
        dayjs(date).isAfter(dayjs(reservation.check_in_date), "day")) &&
      dayjs(date).isBefore(dayjs(reservation.check_out_date), "day")
    );
  });
}

export const RoomSelectionDialog: React.FC<RoomSelectionDialogProps> = ({
  open,
  onClose,
  startDate,
  endDate,
  guestsCount,
  //onReservationAdded,
}) => {
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const [guestFirstName, setGuestFirstName] = useState("");
  const [guestLastName, setGuestLastName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [allReservations, setAllReservations] = useState<Reservation[] | null>(
    null
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddReservation = async () => {
    try {
      // 1. Create guest
      const guestResponse = await fetch(Endpoints.GUESTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: guestFirstName,
          last_name: guestLastName,
          email: guestEmail,
          phone: guestPhone,
        }),
      });

      if (!guestResponse.ok) {
        throw new Error("Failed to create guest");
      }

      const guestData = await guestResponse.json();
      const guestId = guestData.id;

      // 2. Calculate total price
      const nights = dayjs(endDate).diff(dayjs(startDate), "day");
      const selectedRooms =
        rooms?.filter((room) => selectedRoomIds.includes(room.id)) || [];
      const totalPrice = selectedRooms.reduce(
        (sum, room) => sum + Number(room.price_per_night) * nights,
        0
      );

      // 3. Create reservation
      const reservationResponse = await fetch(Endpoints.RESERVATIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest_id: guestId,
          check_in_date: startDate,
          check_out_date: endDate,
          status_id: 1, // zakładam: 1 = aktywna, dostosuj do swojego modelu
          total_price: totalPrice,
          room_ids: selectedRoomIds,
        }),
      });

      if (!reservationResponse.ok) {
        throw new Error("Failed to create reservation");
      }

      // Optional: close dialog, reset form
      onClose();
    } catch (err) {
      console.error("Reservation creation failed:", err);
      alert("Failed to create reservation. Please try again.");
    }
  };

  // Fetch rooms
  useEffect(() => {
    if (!open) return; // only fetch when dialog is open
    fetch(Endpoints.ROOMS)
      .then((res) => res.json())
      .then((data: Room[]) => setRooms(data))
      .catch(() => setRooms(null));
  }, [open]);

  // Fetch reservations
  useEffect(() => {
    if (!open) return;
    fetch(Endpoints.RESERVATIONS)
      .then((res) => res.json())
      .then((data: Reservation[]) => setAllReservations(data))
      .catch(() => setAllReservations(null));
  }, [open]);

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
    if (!startDate || !endDate || !rooms) return [];

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    return rooms.filter((room) => {
      const capacityMap: Record<number, number> = {
        1: 1,
        2: 4,
      };
      const capacity = capacityMap[room.room_type_id] ?? 1;
      if (capacity < guestsCount) {
        return false;
      }

      const isReservedInRange = allReservations?.some((rr) => {
        if (!rr.rooms.some((r) => r.id === room.id)) {
          return false;
        }
        const reservation = allReservations.find((res) => res.id === rr.id);
        if (!reservation) return false;

        const resStart = dayjs(reservation.check_in_date);
        const resEnd = dayjs(reservation.check_out_date);

        return resStart.isBefore(end, "day") && resEnd.isAfter(start, "day");
      });

      return !isReservedInRange;
    });
  }, [guestsCount, startDate, endDate, rooms, allReservations]);

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
        {filteredRooms
          ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((room) => {
            const isSelected = selectedRoomIds.includes(room.id);
            return (
              <TableRow key={room.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleRoomSelection(room.id)}
                    inputProps={{ "aria-label": `select room ${room.id}` }}
                  />
                </TableCell>
                <TableCell>{room.id}</TableCell>
                <TableCell>
                  {RoomTypeType[room.room_type_id] ?? "Unknown"}
                </TableCell>
                <TableCell>${room.price_per_night}</TableCell>
                {dateRange.map((date) => {
                  const occupied = isRoomOccupied(
                    room.id,
                    date,
                    allReservations
                  );
                  return (
                    <TableCell
                      key={dayjs(date).format("YYYY-MM-DD")}
                      align="center"
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
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
      </DialogContent>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredRooms?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
