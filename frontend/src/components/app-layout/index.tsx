import { IconButton } from "@mui/material";
import { Home, Settings, AccountCircle } from "@mui/icons-material";

function Sidebar() {
  return (
    <div
      style={{
        backgroundColor: "#5aa9e6",
        width: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "10px",
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
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
    </div>
  );
}

export default function AppLayout() {
  return (
    <div
      style={{
        backgroundColor: "#0b1e3f",
        height: "100vh",
        margin: 0,
        padding: 0,
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
      <Sidebar />
    </div>
  );
}
