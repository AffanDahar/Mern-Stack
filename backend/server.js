const express = require("express");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const PlacesRoutes = require("./routes/placesRoutes");
const app = express();

app.use(express.json());
app.use("/api/places", PlacesRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = 5000;
app.listen(
  PORT,
  console.log(`App is running on development mode on port ${PORT}`)
);
