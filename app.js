const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

/* Default error handling middleware
   express.js will handle this only on requests where an error was thrown.
   So, it will execute if any middleware in front of it yields and error.*/
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  // either we have an error-message or we set it to 500 "something went wrong"
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occured!" });
});

app.listen(5000);
