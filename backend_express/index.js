const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/user.routes.js");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
