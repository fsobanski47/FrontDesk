import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import {
  sampleGuests,
  samplePayments,
  sampleReservationRooms,
  sampleReservations,
  sampleRooms,
} from "../../data/sample";
import { PaymentStatusType, ReservationStatusType, Room } from "../../types";
import { headingStyles } from "../rooms/styles";
import { MainLayout } from "../welcome-screen";

export default function Reservations() {
  const [payments, setPayments] = useState(samplePayments);

  const getReservationStatus = (
    checkIn: Date,
    checkOut: Date
  ): ReservationStatusType => {
    const now = dayjs();
    if (now.isBefore(checkIn)) return ReservationStatusType.Upcoming;
    if (now.isAfter(checkOut)) return ReservationStatusType.Completed;
    return ReservationStatusType.Ongoing;
  };

  const togglePaymentStatus = (paymentId: number) => {
    const paymentIndex = samplePayments.findIndex((p) => p.id === paymentId);
    if (paymentIndex === -1) return;

    const current = samplePayments[paymentIndex];
    const newStatus =
      current.statusId === PaymentStatusType.Paid
        ? PaymentStatusType.Unpaid
        : PaymentStatusType.Paid;

    samplePayments[paymentIndex] = {
      ...current,
      statusId: newStatus,
    };

    setPayments([...samplePayments]);
  };

  return (
    <MainLayout>
      <h2 style={headingStyles}>Reservations</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Room Price</TableCell>
              <TableCell>Service Price</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Paid</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleReservations.map((res) => {
              const guest = sampleGuests.find((g) => g.id === res.guestId)!;
              const payment = payments.find((p) => p.reservationId === res.id)!;
              const roomId = sampleReservationRooms.find(
                (rr) => rr.reservationId === res.id
              )?.roomId;
              const room = sampleRooms.find((r) => r.id === roomId) as Room;
              const servicePrice = payment.totalPrice - res.totalPrice;

              return (
                <TableRow key={res.id}>
                  <TableCell>{res.id}</TableCell>
                  <TableCell>{guest.firstName}</TableCell>
                  <TableCell>{guest.lastName}</TableCell>
                  <TableCell>{guest.phone}</TableCell>
                  <TableCell>{guest.email}</TableCell>
                  <TableCell>
                    {dayjs(res.checkInDate).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {dayjs(res.checkOutDate).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {getReservationStatus(res.checkInDate, res.checkOutDate)}
                  </TableCell>
                  <TableCell>${room.pricePerNight}</TableCell>
                  <TableCell>${servicePrice}</TableCell>
                  <TableCell>${payment.totalPrice}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={payment.statusId === PaymentStatusType.Paid}
                      onChange={() => togglePaymentStatus(payment.id)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </MainLayout>
  );
}
