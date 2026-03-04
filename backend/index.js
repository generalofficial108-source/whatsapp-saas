require("dotenv").config();
const express = require("express");
const cors = require("cors");

const webhookRoutes = require("./src/routes/routes");
const adminRoutes = require("./src/routes/adminRoutes");
const processMessage = require("./src/shared/processMessage");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/webhook", webhookRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("THIS IS SAAS BACKEND");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
