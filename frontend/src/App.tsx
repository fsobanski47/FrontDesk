import React from "react";
import AppLayout from "./components/app-layout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MakeReservation from "./components/make-reservation";
import Rooms from "./components/rooms";
import WelcomeScreen from "./components/welcome-screen";
import Reservations from "./components/reservations";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<WelcomeScreen />} />
          <Route path="make-reservation" element={<MakeReservation />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="*" element={<Navigate to="/rooms" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
