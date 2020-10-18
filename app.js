const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// * IMPORT ENV FILE
require("dotenv/config");

// * EXPRESS CONFIGURATIONS
const app = express();
app.use(express.json());
app.use(bodyParser.json());

// * IMPORT APPICATION ROUTES
const userRoutes = require("./routes/users");

// * USE APPLICATION ROUTES
app.use("/users", userRoutes);

// * INDEX ROUTE
app.get("/", (req, res) => {
  res.send("This app is made by tyb9900");
});

// * DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ! DATABASE CONNECTION * SUCCCESS OR ERROR
const db = mongoose.connection;
db.on("error", console.log.bind(console, "Unable to connect to database"));
db.once(
  "open",
  console.log.bind(console, "Successfully cconnected to database")
);

// * LISTEN TO PORT
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port`);
});
