export default function JSONViewer({ data }) {
  if (!data) return <p>No response</p>;

  return (
    <pre
      style={{
        background: "#f5f5f5",
        padding: "1rem",
        borderRadius: "5px",
        overflowX: "auto",
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}


