const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
console.log("MONGO_URI =", process.env.MONGO_URI);
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoute");

const app = express();

// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ================= UPLOADS =================

// Uploaded images/PDF ko browser me access karne ke liye
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ================= DATABASE =================

connectDB();

// ================= HOME ROUTE =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DocVerify Backend is running",
  });
});

// ================= AUTH TEST =================

app.get("/api/auth/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route is working",
  });
});

// ================= AUTH ROUTES =================

app.use("/api/auth", authRoutes);

// ================= DOCUMENT ROUTES =================

app.use("/api/documents", documentRoutes);

// ================= SERVER =================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});