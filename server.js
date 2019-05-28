const express = require("express");
const connectDb = require("./config/db");

const app = express();

// connect to db
connectDb();

app.get("/", (req, res) => {
  res.send("API running");
});

// middleware
app.use(express.json({ extended: false }));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/auth", require("./routes/api/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
