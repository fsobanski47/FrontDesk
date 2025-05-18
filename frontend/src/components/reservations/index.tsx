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
import { useEffect, useState } from "react";
import {
  Guest,
  Payment,
  PaymentStatusType,
  Reservation,
  ReservationStatusType,
  Room,
} from "../../types";
import { headingStyles, titleStyles } from "../rooms/styles";
import { MainLayout } from "../welcome-screen";
import { Endpoints } from "../../constants";

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resResp, payResp, guestResp, roomResp] = await Promise.all([
          fetch(Endpoints.RESERVATIONS),
          fetch(Endpoints.PAYMENTS),
          fetch(Endpoints.GUESTS),
          fetch(Endpoints.ROOMS),
        ]);

        const [resData, payData, guestData, roomData] = await Promise.all([
          resResp.json(),
          payResp.json(),
          guestResp.json(),
          roomResp.json(),
        ]);

        setReservations(resData);
        setPayments(payData);
        setGuests(guestData);
        setRooms(roomData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const getReservationStatus = (
    checkIn: Date,
    checkOut: Date
  ): ReservationStatusType => {
    const now = dayjs();
    if (now.isBefore(checkIn)) return ReservationStatusType.Awaiting;
    if (now.isAfter(checkOut)) return ReservationStatusType.Confirmed;
    return ReservationStatusType.Confirmed;
  };

  const togglePaymentStatus = (paymentId: number) => {
    const updatedPayments = payments.map((p) =>
      p.id === paymentId
        ? {
            ...p,
            statusId:
              p.status_id === PaymentStatusType.Paid
                ? PaymentStatusType.Unpaid
                : PaymentStatusType.Paid,
          }
        : p
    );
    setPayments(updatedPayments);
  };

  return (
    <MainLayout>
      <div style={titleStyles}>
        <h2 style={headingStyles}>Reservations</h2>
      </div>
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
            {reservations.map((res) => {
              const guest = guests.find((g) => g.id === res.guest_id);
              const payment = payments.find((p) => p.reservation_id === res.id);
              const room = rooms.find((r) =>
                res.rooms.some((rm) => rm.id === r.id)
              );
              const servicePrice =
                payment && room
                  ? Number(payment.total_amount) - Number(res.total_price)
                  : 0;

              return (
                <TableRow key={res.id}>
                  <TableCell>{res.id}</TableCell>
                  <TableCell>{guest?.first_name ?? "-"}</TableCell>
                  <TableCell>{guest?.last_name ?? "-"}</TableCell>
                  <TableCell>{guest?.phone ?? "-"}</TableCell>
                  <TableCell>{guest?.email ?? "-"}</TableCell>
                  <TableCell>
                    {dayjs(res.check_in_date).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {dayjs(res.check_out_date).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    {getReservationStatus(
                      new Date(res.check_in_date),
                      new Date(res.check_out_date)
                    )}
                  </TableCell>
                  <TableCell>${room?.price_per_night ?? 0}</TableCell>
                  <TableCell>${servicePrice}</TableCell>
                  <TableCell>${payment?.total_amount ?? 0}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={payment?.status_id === PaymentStatusType.Paid}
                      onChange={() => togglePaymentStatus(payment!.id)}
                      disabled={!payment}
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
