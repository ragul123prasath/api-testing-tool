export default function Spinner() {
  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <div
        style={{
          width: "30px",
          height: "30px",
          border: "4px solid #ddd",
          borderTop: "4px solid #000",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "auto",
        }}
      />
      <style>
        {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}
      </style>
    </div>
  );
}
