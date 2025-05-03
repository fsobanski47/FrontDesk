import { IconButton } from "@mui/material";
import { Home, Settings, AccountCircle } from "@mui/icons-material";

function Sidebar() {
  <div
    style={{
      backgroundColor: "#5aa9e6",
      width: "50px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: "10px",
    }}
  >
    <IconButton style={{ color: "white" }}>
      <Home />
    </IconButton>
    <IconButton style={{ color: "white" }}>
      <Settings />
    </IconButton>
    <IconButton style={{ color: "white" }}>
      <AccountCircle />
    </IconButton>
  </div>;
}

export default function AppLayout() {
  return (
    <div
      style={{
        backgroundColor: "#0b1e3f",
        height: "100vh",
        margin: 0,
        fontFamily: "Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          backgroundColor: "#5aa9e6",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "white",
            letterSpacing: "0.5rem",
            margin: 0,
          }}
        >
          F R O N T D E S K
        </h1>
      </header>

      <main style={{ flex: 1 }}></main>
    </div>
  );
}
