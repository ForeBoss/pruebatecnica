const express = require("express");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./utils/errorHandler");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", userRoutes);

app.use(errorHandler);

module.exports = app;
