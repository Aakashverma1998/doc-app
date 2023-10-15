const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const admin = require("./routes/adminRoute");
const doctor = require("./routes/doctorRoute");
const path = require("path")

const morgan = require("morgan");
const connectDB = require("./config/db");
require("dotenv").config();
require("colors");

connectDB();
const app = express();

const Port = process.env.port || 8000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", admin);
app.use("/api/v1/doctor", doctor);


app.listen(Port, () => {
  console.log(`server is running on port:-${Port}`.bgCyan.white);
});
