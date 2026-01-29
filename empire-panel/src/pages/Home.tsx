export default function Home() {
  return (
    <div>
      <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
        <div style={card}>
          <h4>You have</h4>
          <h1>0</h1>
        </div>

        <div style={card}>
          <h4>Credits</h4>
          <h1>0</h1>
        </div>
      </div>

      <h2>Your bots</h2>
      <p>No bots yet.</p>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  minWidth: 200,
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
};
