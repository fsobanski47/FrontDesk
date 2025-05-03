import { IconButton } from "@mui/material";
import { SensorDoor, Create, Toc } from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { icon: <Create />, path: "/make-reservation" },
    { icon: <SensorDoor />, path: "/rooms" },
    { icon: <Toc />, path: "/reservations" },
  ];

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
      {buttons.map(({ icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <IconButton
            key={path}
            style={{
              color: "white",
              opacity: isActive ? 0.4 : 1,
              cursor: isActive ? "default" : "pointer",
            }}
            onClick={() => {
              if (!isActive) navigate(path);
            }}
            disabled={isActive}
          >
            {icon}
          </IconButton>
        );
      })}
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
      <Outlet />
    </div>
  );
}
