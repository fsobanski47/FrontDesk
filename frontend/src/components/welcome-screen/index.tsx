export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#0b1e3f",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#5aa9e6",
          width: "80%",
          maxWidth: "1000px",
          height: "600px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function WelcomeScreen() {
  return (
    <MainLayout>
      <h1>Welcome to FrontDesk</h1>
    </MainLayout>
  );
}
