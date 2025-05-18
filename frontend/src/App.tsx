import React from "react";
import AppLayout from "./components/app-layout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MakeReservation from "./components/make-reservation";
import Rooms from "./components/rooms";
import WelcomeScreen from "./components/welcome-screen";
import Reservations from "./components/reservations";
import CreateRoom from "./components/rooms/create-room";
import RoomView from "./components/rooms/room-view";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<WelcomeScreen />} />
            <Route path="make-reservation" element={<MakeReservation />} />
            <Route path="rooms">
              <Route index element={<Rooms />} />
              <Route path="create-room" element={<CreateRoom />} />
              <Route path="room-view" element={<RoomView />} />
            </Route>
            <Route path="reservations" element={<Reservations />} />
            <Route path="*" element={<Navigate to="/rooms" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
