// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// ----------------------------
// 🗂 In-memory collections storage
// ----------------------------
let collections = [
  { id: 1, name: "Demo Collection" },
  { id: 2, name: "Sample APIs" }
];
let nextId = 3;

// ----------------------------
// GET /collections
// ----------------------------
app.get("/collections", (req, res) => {
  res.json(collections);
});

// ----------------------------
// POST /collections  (Create new collection)
// ----------------------------
app.post("/collections", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Collection name is required" });
  }

  const newCollection = {
    id: nextId++,
    name,
  };

  collections.push(newCollection);

  return res.json(newCollection);
});

// ----------------------------
// GET /collections/:id/items  (NEW ROUTE ADDED 🔥)
// ----------------------------
app.get("/collections/:id/items", (req, res) => {
  const { id } = req.params;

  // For now always return empty list
  res.json({
    collectionId: id,
    items: [],
  });
});

// ----------------------------
// POST /collections/:id/items (Save items to a collection)
// ----------------------------
app.post("/collections/:id/items", (req, res) => {
  console.log("Saved to collection:", req.body);
  res.json({ message: "Saved to collection successfully!" });
});

// ----------------------------
// PROXY ENDPOINT
// ----------------------------
app.post("/proxy", async (req, res) => {
  try {
    const { url, method, body } = req.body;

    if (!url || !method) {
      return res.status(400).json({ error: "Missing URL or method" });
    }

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();

    try {
      res.json(JSON.parse(text));
    } catch {
      res.json({ raw: text });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy request failed" });
  }
});

// ----------------------------
// ROOT
// ----------------------------
app.get("/", (req, res) => {
  res.json({ message: "Backend running correctly!" });
});

// ----------------------------
// START SERVER
// ----------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
