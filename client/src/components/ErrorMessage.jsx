export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        background: "#ffdddd",
        color: "#900",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "1rem",
        border: "1px solid #e0a0a0",
      }}
    >
      {message}
    </div>
  );
}

