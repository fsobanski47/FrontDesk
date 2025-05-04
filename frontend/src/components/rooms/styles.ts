import { CSSProperties } from "react";

export const roomCardStyles = {
  backgroundColor: "#0b1e3f",
  color: "white",
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
};

export const roomsContainerStyles: CSSProperties = {
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

export const filtersContainerStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  marginBottom: "20px",
};

export const createButtonStyles = {
  marginBottom: "20px",
  color: "white",
  height: "56px",
};

export const createContainerStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  maxWidth: "400px",
  margin: "0 auto",
  marginTop: "32px",
};
