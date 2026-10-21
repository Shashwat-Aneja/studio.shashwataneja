export default function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        background: "#fff",
        color: "#171717",
        padding: "48px 24px",
        fontFamily: "system-ui, sans-serif",
        fontSize: 16,
        lineHeight: 1.6,
      }}
    >
      <div style={{ maxWidth: 680, margin: "12vh auto 0" }}>
        <p style={{ color: "#666", fontSize: 12, letterSpacing: "0.12em" }}>
          STUDIO / SHASHWAT ANEJA
        </p>
        <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", lineHeight: 1.05, fontWeight: 500 }}>
          A digital workshop.
        </h1>
        <p style={{ color: "#666" }}>A new version is in preparation.</p>
      </div>
    </main>
  );
}
