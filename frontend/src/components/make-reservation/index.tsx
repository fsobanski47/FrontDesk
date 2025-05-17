import { useState } from "react";
import { DatePicker } from "@mantine/dates";
import { Box, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { MainLayout } from "../welcome-screen";

export default function MakeReservation() {
  const [value, setValue] = useState<[string | null, string | null]>([
    null,
    null,
  ]);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [start, end] = value;

  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
          px: 2,
        }}
      >
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
                start && end && dayjs(date).isBetween(start, end, "day", "[]");

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
        </Paper>
        {value[0] && value[1] && (
          <Box mt={2} textAlign="center">
            <Typography>
              Selected range: {dayjs(value[0]).format("YYYY-MM-DD")} —{" "}
              {dayjs(value[1]).format("YYYY-MM-DD")}
            </Typography>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}
