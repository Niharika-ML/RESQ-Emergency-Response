const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RESQ Backend is running 🚑"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "RESQ server is healthy ❤️"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚑 RESQ Backend running on http://localhost:${PORT}`);
});
