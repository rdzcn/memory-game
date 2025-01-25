import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware";

const app = express();
app.use(cors());
const PORT = 4040;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});