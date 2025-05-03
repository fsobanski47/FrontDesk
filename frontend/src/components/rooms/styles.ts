import { CSSProperties } from "react";

export const roomCardStyles = {
  backgroundColor: "#0b1e3f",
  color: "white",
  border: "2px solid #5aa9e6",
  borderRadius: "8px",
  height: "80px",
  width: "90px",
  fontWeight: "bold",
  fontSize: "1.1rem",
};

export const roomsGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "6px",
  maxWidth: "100%",
  gridAutoRows: "minmax(100px, auto)",
  justifyItems: "center",
  paddingLeft: "60px",
};

export const roomsContainerStyles: CSSProperties = {
  paddingLeft: "60px",
  flex: 1,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

export const titleStyles = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
};

export const headingStyles = {
  color: "white",
};

export const paginationContainerStyles = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
  paddingBottom: "20px",
};
