const express = require("express");
const cors = require("cors");
const regionsRoutes = require("./src/routes/regionsRoutes");
const gamesRoutes = require("./src/routes/gamesRoutes");
const statsRoutes = require("./src/routes/statsRoutes");

const app = express();
//Cross-Origin Resource Sharing
app.use(
  cors({
    origin: "*",
    methods: ["GET"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(express.json());

//Routes
app.use("/regions", regionsRoutes);
app.use("/games", gamesRoutes);
app.use("/stats", statsRoutes);

//Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Opps, something broke!");
});

const PORT = process.env.PORT || 5008; //Use the PORT from environment variables or default to 5008
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
