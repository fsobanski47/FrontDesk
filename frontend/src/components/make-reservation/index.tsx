import { useState } from "react";
import { DatePicker } from "@mantine/dates";
import {
  Box,
  Button,
  Grid,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { MainLayout } from "../welcome-screen";
import { titleStyles, headingStyles } from "../rooms/styles";
import { RoomSelectionDialog } from "./room-selection";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  height: "400px",
  color: theme.palette.text.secondary,
}));

export default function MakeReservation() {
  const [value, setValue] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [guests, setGuests] = useState("1");
  const [roomsDialogOpen, setRoomsDialogOpen] = useState(false);

  const [guestFirstName, setGuestFirstName] = useState("");
  const [guestLastName, setGuestLastName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [start, end] = value;

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuests(e.target.value);
  };

  const openRoomsDialog = () => {
    // Można tu np. wykonać fetch wstępnie pobierający dostępne pokoje
    setRoomsDialogOpen(true);
  };

  const closeRoomsDialog = () => setRoomsDialogOpen(false);

  const isGuestInfoValid =
    guestFirstName.trim() !== "" &&
    guestLastName.trim() !== "" &&
    guestEmail.trim() !== "" &&
    guestPhone.trim() !== "" &&
    start &&
    end &&
    guests &&
    parseInt(guests, 10) > 0;

  return (
    <MainLayout>
      <div style={titleStyles}>
        <h2 style={headingStyles}>Make a Reservation</h2>
      </div>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2, px: 2 }}>
        <Item>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              width: "300px",
              height: "320px",
              boxSizing: "border-box",
            }}
          >
            <DatePicker
              type="range"
              value={value}
              onChange={setValue}
              minDate={new Date()}
              style={{ width: "100%" }}
              getDayProps={(date) => {
                const isSelected =
                  start &&
                  end &&
                  dayjs(date).isBetween(start, end, "day", "[]");

                const isPreview =
                  start &&
                  !end &&
                  hoveredDate &&
                  dayjs(date).isBetween(
                    dayjs(start),
                    dayjs(hoveredDate),
                    "day",
                    "[]"
                  );

                return {
                  onMouseEnter: () => {
                    if (start && !end) {
                      setHoveredDate(date);
                    }
                  },
                  style: {
                    backgroundColor: isSelected
                      ? "#ff9800"
                      : isPreview
                      ? "rgba(255, 152, 0, 0.4)"
                      : undefined,
                    color: isSelected || isPreview ? "white" : undefined,
                    borderRadius: 4,
                  },
                };
              }}
            />
            {start && end && (
              <Box mt={2} textAlign="center">
                <Typography>
                  {dayjs(start).format("YYYY-MM-DD")} -{" "}
                  {dayjs(end).format("YYYY-MM-DD")}
                </Typography>
                <Box mt={0}>
                  <Button
                    variant="contained"
                    onClick={openRoomsDialog}
                    disabled={!isGuestInfoValid}
                  >
                    Choose Rooms
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Item>

        <Item>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              width: "300px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Number of Guests
            </Typography>
            <TextField
              name="guests"
              label="Number of Guests"
              type="number"
              inputProps={{ min: 1 }}
              value={guests}
              onChange={handleGuestsChange}
              fullWidth
              size="small"
            />
            <TextField
              label="First Name"
              value={guestFirstName}
              onChange={(e) => setGuestFirstName(e.target.value)}
              fullWidth
              required
              sx={{ mb: 1 }}
              size="small"
            />
            <TextField
              label="Last Name"
              value={guestLastName}
              onChange={(e) => setGuestLastName(e.target.value)}
              fullWidth
              required
              sx={{ mb: 1 }}
              size="small"
            />
            <TextField
              label="Email"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              fullWidth
              required
              sx={{ mb: 1 }}
              size="small"
            />
            <TextField
              label="Phone"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              fullWidth
              required
              size="small"
            />
          </Paper>
        </Item>
      </Grid>

      <RoomSelectionDialog
        open={roomsDialogOpen}
        onClose={closeRoomsDialog}
        startDate={start ? dayjs(start).format("YYYY-MM-DD") : null}
        endDate={end ? dayjs(end).format("YYYY-MM-DD") : null}
        guestsCount={parseInt(guests, 10) || 1}
        guestFirstName={guestFirstName}
        guestLastName={guestLastName}
        guestEmail={guestEmail}
        guestPhone={guestPhone}
      />
    </MainLayout>
  );
}
