import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connection from "./database"; // Import MySQL connection

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test API
app.get("/", (req, res) => {
  res.send("🚀 Server is running inside Docker with MySQL!");
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await (await connection).execute("SELECT 1 + 1 AS result");
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
